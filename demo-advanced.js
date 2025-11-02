const axios = require('axios');

console.log('🚀 Crawler Pro - Advanced Features Demo\n');

const demoConfigs = [
  {
    name: 'Basic Fast Crawl',
    config: {
      url: 'https://example.com',
      maxPages: 3,
      delay: 100,
      timeout: 5000,
      followRedirects: true,
      respectRobots: false
    }
  },
  {
    name: 'Respectful Crawl with Robots',
    config: {
      url: 'https://example.com',
      maxPages: 5,
      delay: 2000,
      timeout: 10000,
      followRedirects: true,
      respectRobots: true
    }
  },
  {
    name: 'Deep Exploration',
    config: {
      url: 'https://httpbin.org',
      maxPages: 8,
      delay: 800,
      timeout: 15000,
      followRedirects: true,
      respectRobots: false
    }
  }
];

async function runDemo() {
  for (const demo of demoConfigs) {
    console.log(`\n🎯 ${demo.name}`);
    console.log('═'.repeat(50));
    
    try {
      console.log(`Starting crawl with config:`, JSON.stringify(demo.config, null, 2));
      
      const startTime = Date.now();
      const response = await axios.post('http://localhost:8080/crawl', demo.config, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      const { results, total } = response.data;
      
      console.log(`\n✅ Crawl completed in ${duration}s`);
      console.log(`📊 Found ${total} pages`);
      
      // Calculate statistics
      const successful = results.filter(r => r.status >= 200 && r.status < 300).length;
      const errors = results.filter(r => r.status >= 400 || r.error).length;
      const avgDepth = results.reduce((sum, r) => sum + (r.depth || 0), 0) / results.length;
      
      console.log(`\n📈 Statistics:`);
      console.log(`   • Successful: ${successful}`);
      console.log(`   • Errors: ${errors}`);
      console.log(`   • Average Depth: ${avgDepth.toFixed(1)}`);
      
      // Show top results
      console.log(`\n🏆 Top Results:`);
      results.slice(0, 3).forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.title}`);
        console.log(`      URL: ${result.url}`);
        console.log(`      Status: ${result.status} | Depth: ${result.depth} | Links: ${result.links?.length || 0}`);
        if (result.error) {
          console.log(`      Error: ${result.error}`);
        }
      });
      
      if (results.length > 3) {
        console.log(`   ... and ${results.length - 3} more pages`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
    
    // Wait between demos
    if (demo !== demoConfigs[demoConfigs.length - 1]) {
      console.log(`\n⏳ Waiting 3 seconds before next demo...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎉 All demos completed!');
  console.log('\n💡 Try the web interface at: http://localhost:8080');
  console.log('   Features: Real-time progress, advanced stats, beautiful UI');
}

// Check if server is running first
axios.get('http://localhost:8080/status')
  .then(() => {
    console.log('✅ Server is running, starting demos...');
    runDemo();
  })
  .catch(error => {
    console.log('❌ Server is not running. Please start it first with: npm start');
    console.log('   Then run this demo script again.');
  });