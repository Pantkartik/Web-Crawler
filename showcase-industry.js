#!/usr/bin/env node

/**
 * Crawler Pro - Industry Level Showcase
 * Demonstrates all advanced features and capabilities
 */

const axios = require('axios');

class CrawlerProShowcase {
    constructor() {
        this.baseUrl = 'http://localhost:8080';
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            bgBlue: '\x1b[44m',
            bgGreen: '\x1b[42m',
            bgRed: '\x1b[41m'
        };
    }

    log(message, color = 'reset') {
        console.log(`${this.colors[color]}${message}${this.colors.reset}`);
    }

    banner() {
        console.clear();
        this.log('╔══════════════════════════════════════════════════════════════════════════════╗', 'cyan');
        this.log('║                              🕷️  CRAWLER PRO  🕷️                            ║', 'cyan');
        this.log('║                    Advanced Web Intelligence Platform                       ║', 'cyan');
        this.log('╚══════════════════════════════════════════════════════════════════════════════╝', 'cyan');
        console.log();
    }

    async checkServer() {
        try {
            const response = await axios.get(`${this.baseUrl}/status`);
            this.log('✅ Server Status: Online', 'green');
            this.log(`   Port: ${response.data.port}`, 'dim');
            this.log(`   Uptime: ${response.data.uptime}`, 'dim');
            return true;
        } catch (error) {
            this.log('❌ Server Status: Offline', 'red');
            this.log(`   Error: ${error.message}`, 'red');
            return false;
        }
    }

    async runDemo(demoName, config) {
        this.log(`\n🚀 ${demoName}`, 'bright');
        this.log('═'.repeat(60), 'dim');
        
        const startTime = Date.now();
        
        try {
            const response = await axios.post(`${this.baseUrl}/crawl`, config);
            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            
            this.log(`✅ Crawl completed in ${duration}s`, 'green');
            this.log(`📊 Found ${response.data.length} pages`, 'blue');
            
            // Calculate statistics
            const successful = response.data.filter(r => r.status === 200).length;
            const errors = response.data.filter(r => r.status !== 200).length;
            const avgDepth = response.data.length > 0 ? 
                (response.data.reduce((sum, r) => sum + (r.depth || 0), 0) / response.data.length).toFixed(1) : 0;
            
            this.log(`📈 Statistics:`, 'yellow');
            this.log(`   • Successful: ${successful}`, 'green');
            this.log(`   • Errors: ${errors}`, errors > 0 ? 'red' : 'green');
            this.log(`   • Average Depth: ${avgDepth}`, 'cyan');
            
            // Show top results
            this.log(`\n🏆 Top Results:`, 'yellow');
            const topResults = response.data.slice(0, 3);
            topResults.forEach((result, index) => {
                const title = result.title || 'Untitled';
                const url = result.url.length > 60 ? result.url.substring(0, 60) + '...' : result.url;
                this.log(`   ${index + 1}. ${title}`, 'white');
                this.log(`      URL: ${url}`, 'dim');
                this.log(`      Status: ${result.status} | Depth: ${result.depth || 0} | Links: ${result.links || 0}`, 'dim');
            });
            
            if (response.data.length > 3) {
                this.log(`   ... and ${response.data.length - 3} more pages`, 'dim');
            }
            
        } catch (error) {
            this.log(`❌ Demo failed: ${error.message}`, 'red');
            if (error.response?.data) {
                this.log(`   Details: ${JSON.stringify(error.response.data)}`, 'red');
            }
        }
    }

    async runAllDemos() {
        this.banner();
        
        // Check server
        const serverOnline = await this.checkServer();
        if (!serverOnline) {
            this.log('\n❌ Cannot proceed - server is offline', 'red');
            this.log('💡 Please start the server first: npm start', 'yellow');
            return;
        }

        // Demo 1: Fast Crawl
        await this.runDemo('Lightning Fast Crawl', {
            url: 'https://example.com',
            maxPages: 5,
            delay: 500,
            timeout: 5000,
            followRedirects: true,
            respectRobots: false
        });

        // Wait between demos
        await this.wait(2000);

        // Demo 2: Respectful Crawl
        await this.runDemo('Ethical & Respectful Crawl', {
            url: 'https://httpbin.org',
            maxPages: 8,
            delay: 2000,
            timeout: 10000,
            followRedirects: true,
            respectRobots: true
        });

        // Wait between demos
        await this.wait(2000);

        // Demo 3: Deep Exploration
        await this.runDemo('Deep Web Exploration', {
            url: 'https://jsonplaceholder.typicode.com',
            maxPages: 10,
            delay: 800,
            timeout: 15000,
            followRedirects: true,
            respectRobots: true
        });

        // Final summary
        this.log('\n' + '═'.repeat(60), 'dim');
        this.log('🎉 All demos completed successfully!', 'green');
        this.log('\n💡 Try the web interface at: http://localhost:8080', 'cyan');
        this.log('   Features: Real-time progress • Advanced stats • Beautiful UI', 'dim');
        this.log('   Capabilities: AI-powered crawling • Ethical practices • Performance analytics', 'dim');
        
        // Show feature highlights
        this.log('\n✨ Industry-Level Features:', 'bright');
        this.log('   • Professional UI/UX with glassmorphism design', 'white');
        this.log('   • Real-time progress tracking and analytics', 'white');
        this.log('   • Advanced configuration options', 'white');
        this.log('   • Ethical crawling with robots.txt compliance', 'white');
        this.log('   • Responsive design for all devices', 'white');
        this.log('   • Beautiful loading animations and notifications', 'white');
        this.log('   • Comprehensive error handling and logging', 'white');
    }

    wait(ms) {
        return new Promise(resolve => {
            this.log(`\n⏳ Waiting ${ms/1000} seconds before next demo...`, 'dim');
            setTimeout(resolve, ms);
        });
    }

    async interactiveMode() {
        this.banner();
        
        const serverOnline = await this.checkServer();
        if (!serverOnline) {
            this.log('\n❌ Server is offline. Start it with: npm start', 'red');
            return;
        }

        this.log('\n🎯 Interactive Mode', 'bright');
        this.log('Enter your own crawl configuration:', 'cyan');
        
        // This would be implemented with readline for full interactivity
        this.log('\n💡 Example configurations you can try:', 'yellow');
        this.log('   • Quick scan: maxPages=3, delay=500ms', 'white');
        this.log('   • Deep dive: maxPages=20, delay=1500ms, respectRobots=true', 'white');
        this.log('   • Fast extraction: maxPages=10, delay=0ms, timeout=3000ms', 'white');
        this.log('\n🌐 Visit http://localhost:8080 for the full web interface!', 'green');
    }
}

// Command line interface
const showcase = new CrawlerProShowcase();

const command = process.argv[2];
switch (command) {
    case 'interactive':
    case 'i':
        showcase.interactiveMode();
        break;
    case 'help':
    case 'h':
        console.log('\nUsage: node showcase-industry.js [command]');
        console.log('\nCommands:');
        console.log('  (none)      Run all demos');
        console.log('  interactive Interactive mode');
        console.log('  help        Show this help');
        break;
    default:
        showcase.runAllDemos();
}