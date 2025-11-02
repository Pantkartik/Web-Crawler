# 🕷️ Crawler Pro - Advanced Web Intelligence Platform

A professional-grade web crawling platform with a modern, Sage-like interface. Built with Node.js, Express, and vanilla JavaScript for maximum performance and reliability.

## ✨ Features

### 🎨 Professional UI/UX
- **Modern Design**: Glassmorphism effects with gradient backgrounds
- **Responsive Layout**: Mobile-first design that works on all devices
- **Real-time Updates**: Live progress tracking and notifications
- **Interactive Dashboard**: Advanced statistics and visual feedback

### 🔧 Advanced Configuration
- **Customizable Delays**: Configure request delays (100ms - 5s)
- **Timeout Control**: Set request timeouts (5s - 30s)
- **Redirect Handling**: Toggle redirect following
- **Robots.txt Compliance**: Optional robots.txt respect
- **Depth Control**: Configurable maximum crawl depth

### 📊 Intelligent Analytics
- **Real-time Statistics**: Pages found, success rate, error count
- **Depth Analysis**: Average crawl depth tracking
- **Status Monitoring**: HTTP status code tracking
- **Link Discovery**: Automatic link extraction and counting

### 🚀 Performance Features
- **Efficient Queue Management**: Optimized crawling queue
- **Duplicate Prevention**: Automatic URL deduplication
- **Error Handling**: Graceful error recovery and reporting
- **Memory Efficient**: Optimized for large-scale crawling

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone or download the project
cd web-crawler

# Install dependencies
npm install

# Start the server
npm start
```

### Access the Application
Open your browser and navigate to: `http://localhost:8080`

## 📖 Usage Guide

### Basic Crawling
1. **Enter URL**: Input your target website URL
2. **Set Limits**: Configure maximum pages (1-50)
3. **Start Crawling**: Click the "Start Crawling" button
4. **Monitor Progress**: Watch real-time progress and results

### Advanced Options
Click "Advanced Options" to access:
- **Request Delay**: Control crawling speed
- **Timeout Settings**: Adjust request timeouts
- **Redirect Following**: Enable/disable redirects
- **Robots.txt**: Respect/disregard robots.txt rules

### Results Dashboard
- **Statistics Cards**: Overview of crawl performance
- **Detailed Results**: Individual page information
- **Status Indicators**: Success/error/pending states
- **Link Counts**: Number of links found per page

## 🔧 API Documentation

### POST /crawl
Initiate a new web crawl with advanced configuration.

**Request Body:**
```json
{
  "url": "https://example.com",
  "maxPages": 10,
  "delay": 1000,
  "timeout": 10000,
  "followRedirects": true,
  "respectRobots": false
}
```

**Response:**
```json
{
  "results": [
    {
      "url": "https://example.com",
      "title": "Example Domain",
      "status": 200,
      "depth": 0,
      "links": ["https://www.iana.org/domains/example"]
    }
  ],
  "total": 1
}
```

### GET /status
Check server status and health.

**Response:**
```json
{
  "status": "running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🛠️ Technical Architecture

### Backend Components
- **Express.js**: Fast, minimalist web framework
- **Axios**: HTTP client for web requests
- **Cheerio**: Server-side HTML parsing and manipulation
- **CORS**: Cross-origin resource sharing support

### Frontend Technologies
- **Modern CSS**: Flexbox, Grid, and CSS animations
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: ARIA labels and keyboard navigation

### Performance Optimizations
- **Efficient Memory Usage**: Optimized data structures
- **Connection Pooling**: Reused HTTP connections
- **Timeout Management**: Configurable request timeouts
- **Error Recovery**: Graceful handling of network issues

## 🎨 Design System

### Color Palette
- **Primary**: Gradient from #667eea to #764ba2
- **Success**: Green gradient (#84fab0 to #8fd3f4)
- **Error**: Red gradient (#fa709a to #fee140)
- **Neutral**: Gray scale with glassmorphism effects

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **UI Elements**: Medium weight (500)

### Components
- **Cards**: Glassmorphism with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Progress Bars**: Animated fill with gradient colors
- **Notifications**: Slide-in animations with auto-dismiss

## 🔒 Security Features

- **Input Validation**: URL validation and sanitization
- **Rate Limiting**: Configurable request delays
- **Robots.txt**: Optional compliance with web standards
- **Timeout Protection**: Prevents hanging requests
- **Error Sanitization**: Safe error message handling

## 📱 Browser Support

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS Safari, Chrome Mobile

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Crawler Pro** - Professional web intelligence made simple. 🕷️✨