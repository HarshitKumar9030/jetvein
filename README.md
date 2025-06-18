# JetVein ✈️

A modern aircraft tracking application built with Next.js 15, TypeScript, and Redis.

## 🚀 Features

- [x] Modern UI with dark/light/system theme toggle
- [x] Responsive design with mobile-friendly navbar
- [x] Cool text animations (typewriter, glitch, wave, etc.)
- [x] Redis integration for caching and data storage
- [ ] Real-time aircraft tracking
- [ ] Flight search functionality
- [ ] User authentication
- [ ] Flight history tracking
- [ ] Push notifications for flight updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Redis (caching & data storage)
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide Icons
- **Theme**: next-themes

## 📋 Todo List

### 🎨 UI/UX
- [x] ~~Create responsive navbar with mobile sheet~~
- [x] ~~Add theme toggle (dark/light/system)~~
- [x] ~~Implement text animations~~
- [x] ~~Create footer with credits~~
- [ ] Design aircraft tracking dashboard
- [ ] Create flight details modal
- [ ] Add loading skeletons
- [ ] Implement error boundaries

### 🔧 Backend/API
- [x] ~~Set up Redis configuration~~
- [x] ~~Create Redis service utilities~~
- [x] ~~Implement caching functions~~
- [x] ~~Add health check API~~
- [ ] Integrate aircraft tracking API
- [ ] Create flight search endpoints
- [ ] Add rate limiting
- [ ] Implement API key management

### 🔐 Authentication
- [x] Set up authentication system and providers
- [x] Created signin page 
- [ ] Implement session management
- [ ] Add role-based access control

### 📱 Features
- [ ] Real-time flight tracking
- [ ] Flight search with filters
- [ ] Saved flights/watchlist
- [ ] Flight alerts and notifications
- [ ] Historical flight data
- [ ] Airport information
- [ ] Weather integration

### 🧪 Testing & Quality
- [ ] Unit tests for components
- [ ] API endpoint testing
- [ ] E2E testing with Playwright
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility improvements

### 🚀 Deployment
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Production Redis setup
- [ ] Environment configuration
- [ ] Monitoring and logging

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshitkumar9030/jetvein.git
   cd jetvein
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Redis URL and other configs
   ```

4. **Start Redis server**
   ```bash
   # Using Docker
   docker run -p 6379:6379 redis:alpine
   
   # Or install locally and run
   redis-server
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
jetvein/
├── src/
│   ├── app/                  # App router pages
│   ├── components/           # Reusable components
│   │   ├── animations/       # Text animations
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utilities and configs
│   │   ├── redis.ts         # Redis configuration
│   │   └── redis-service.ts # Redis utility functions
│   └── types/               # TypeScript types
├── public/                  # Static assets
└── README.md
```

## 🌟 API Endpoints

### Health Check
- `GET /api/health` - Check API and Redis status

### Flight Operations
- `GET /api/flights/search` - Search flights (TODO)
- `GET /api/flights/[id]` - Get flight details (TODO)
- `POST /api/flights/track` - Track a flight (TODO)

### Search History
- `GET /api/search-history` - Get user search history
- `POST /api/search-history` - Save search query
- `DELETE /api/search-history` - Clear search history

## 🤝 Contributing

Feel free to contribute to this project! Please check the todo list above for areas that need work.

## 👨‍💻 Made By

**Harshit Kumar**
- GitHub: [@harshitkumar9030](https://github.com/harshitkumar9030)
- Website: [leoncyriac.me](https://leoncyriac.me)
- Twitter: [@Ohharshit](https://twitter.com/Ohharshit)

## 📄 License

© 2025 Harshit Kumar. All rights reserved.

---

*Built with ❤️ for aviation enthusiasts*