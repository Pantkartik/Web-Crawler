const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

class SimpleCrawler {
  constructor(startUrl, maxPages = 10, options = {}) {
    this.startUrl = startUrl;
    this.maxPages = maxPages;
    this.options = {
      delay: options.delay || 1000,
      timeout: options.timeout || 10000,
      followRedirects: options.followRedirects !== false,
      respectRobots: options.respectRobots || false,
      ...options
    };
    this.visited = new Set();
    this.results = [];
    this.queue = [{url: startUrl, depth: 0}];
  }

  async checkRobotsTxt(url) {
    if (!this.options.respectRobots) return true;
    
    try {
      const urlObj = new URL(url);
      const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
      
      const response = await axios.get(robotsUrl, {
        timeout: 5000,
        headers: {'User-Agent': 'Crawler-Pro/1.0'}
      });
      
      // Simple robots.txt parsing - check if our user-agent is disallowed
      const robotsTxt = response.data.toLowerCase();
      const lines = robotsTxt.split('\n');
      let userAgentApplies = false;
      
      for (const line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('user-agent:')) {
          const ua = cleanLine.split(':')[1]?.trim();
          userAgentApplies = ua === '*' || ua === 'crawler-pro' || ua === 'crawler-pro/1.0';
        } else if (userAgentApplies && cleanLine.startsWith('disallow:')) {
          const disallowPath = cleanLine.split(':')[1]?.trim();
          if (disallowPath && disallowPath !== '/') {
            const urlPath = urlObj.pathname;
            if (urlPath.startsWith(disallowPath)) {
              return false; // URL is disallowed
            }
          } else if (disallowPath === '/') {
            return false; // Everything is disallowed
          }
        }
      }
      
      return true;
    } catch (error) {
      // If robots.txt doesn't exist or can't be fetched, allow crawling
      return true;
    }
  }

  async crawl() {
    while (this.queue.length > 0 && this.results.length < this.maxPages) {
      const {url, depth} = this.queue.shift();
      
      if (this.visited.has(url)) continue;
      
      // Check robots.txt if enabled
      if (this.options.respectRobots) {
        const allowed = await this.checkRobotsTxt(url);
        if (!allowed) {
          console.log(`Robots.txt disallows crawling: ${url}`);
          this.visited.add(url);
          continue;
        }
      }
      
      this.visited.add(url);

      try {
        console.log(`Crawling: ${url}`);
        
        // Enhanced headers to avoid being blocked
        const headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0'
        };

        const response = await axios.get(url, {
          timeout: this.options.timeout,
          maxRedirects: this.options.followRedirects ? 5 : 0,
          headers: headers,
          validateStatus: (status) => status < 500,
          // Add retry logic for transient failures
          'axios-retry': {
            retries: 3,
            retryDelay: (retryCount) => retryCount * 1000,
            retryCondition: (error) => {
              return axios.isRetryableError(error) || (error.response?.status >= 500);
            }
          }
        });

        const $ = cheerio.load(response.data);
        const title = $('title').text().trim() || $('h1').first().text().trim() || 'No title';
        const links = [];
        
        // More comprehensive link extraction
        $('a[href]').each((i, elem) => {
          const href = $(elem).attr('href');
          if (href) {
            try {
              // Handle relative URLs
              const absoluteUrl = new URL(href, url).href;
              if (absoluteUrl.startsWith('http')) {
                links.push(absoluteUrl);
              }
            } catch (e) {
              // Invalid URL, skip it
            }
          }
        });

        // Remove duplicates
        const uniqueLinks = [...new Set(links)];

        this.results.push({
          url,
          title: title || 'Untitled',
          links: uniqueLinks.slice(0, 5),
          status: response.status,
          depth,
          timestamp: new Date().toISOString()
        });

        // Add new links to queue (limit to prevent explosion)
        for (const link of uniqueLinks.slice(0, 2)) {
          if (!this.visited.has(link) && this.results.length < this.maxPages) {
            this.queue.push({url: link, depth: depth + 1});
          }
        }

        // Respectful delay based on configuration
        await new Promise(resolve => setTimeout(resolve, this.options.delay));
        
      } catch (error) {
        console.error(`Error crawling ${url}:`, error.message);
        
        // More detailed error information
        let errorDetails = error.message;
        if (error.response) {
          errorDetails = `HTTP ${error.response.status}: ${error.response.statusText}`;
        } else if (error.code === 'ECONNREFUSED') {
          errorDetails = 'Connection refused - server may be down';
        } else if (error.code === 'ETIMEDOUT') {
          errorDetails = 'Request timed out - server may be slow';
        } else if (error.code === 'ENOTFOUND') {
          errorDetails = 'Domain not found - check the URL';
        }

        this.results.push({
          url,
          title: 'Error - ' + errorDetails,
          error: errorDetails,
          status: error.response?.status || 0,
          depth,
          timestamp: new Date().toISOString()
        });
      }
    }

    return this.results;
  }
}

// API Routes
app.post('/crawl', async (req, res) => {
  const {
    url, 
    maxPages = 10, 
    delay = 1000, 
    timeout = 10000, 
    followRedirects = true, 
    respectRobots = false
  } = req.body;
  
  if (!url) {
    return res.status(400).json({error: 'URL is required'});
  }

  try {
    const crawler = new SimpleCrawler(url, parseInt(maxPages), {
      delay: parseInt(delay),
      timeout: parseInt(timeout),
      followRedirects,
      respectRobots
    });
    const results = await crawler.crawl();
    res.json({results, total: results.length});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.get('/status', (req, res) => {
  res.json({status: 'running', timestamp: new Date().toISOString()});
});

// Start server
app.listen(PORT, () => {
  console.log(`🕷️ Web Crawler server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: POST http://localhost:${PORT}/crawl`);
  console.log(`📋 Example: curl -X POST http://localhost:${PORT}/crawl -H "Content-Type: application/json" -d '{"url":"https://example.com","maxPages":5}'`);
});

// Export for testing
module.exports = SimpleCrawler;