const axios = require('axios');

async function testCrawler() {
  console.log('🕷️ Testing Web Crawler...');
  
  try {
    const response = await axios.post('http://localhost:8080/crawl', {
      url: 'https://example.com',
      maxPages: 3
    });
    
    console.log('✅ Crawl completed!');
    console.log(`📊 Found ${response.data.total} pages:`);
    
    response.data.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Links found: ${result.links?.length || 0}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCrawler();