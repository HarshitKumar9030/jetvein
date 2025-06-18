# JetVein ✈️

JetVein is a flight tracking and info app with real-time aircraft tracking, flight search and aircraft history.

<br />

<p align="center">
  <img src="/public/jetvein.png" alt="JetVein" />
</p>

## 🚀 Features

- [x] Modern UI with dark/light/system theme toggle
- [x] Responsive design with mobile-friendly navbar
- [x] Cool text animations (typewriter, glitch, wave, etc.)
- [x] Authentication with NextAuth.js
- [x] User registration and signin
- [ ] Real-time aircraft tracking
- [ ] Flight search functionality
- [ ] Flight history tracking
- [ ] Push notifications for flight updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB (user data & authentication)
- **Authentication**: NextAuth.js with MongoDB adapter
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide Icons
- **Theme**: next-themes

## 📋 Todo List

### 🎨 UI/UX
- [x] ~~Create responsive navbar with mobile sheet~~
- [x] ~~Add theme toggle (dark/light/system)~~
- [x] ~~Implement text animations~~
- [x] ~~Create footer with credits~~
- [ ] Hide Navbar on auth pages
- [ ] Design aircraft tracking dashboard
- [ ] Create flight details modal
- [ ] Add loading skeletons
- [ ] Implement error boundaries

### 🔧 Backend/API
- [x] ~~Set up MongoDB configuration~~
- [x] ~~Create authentication system~~
- [x] ~~Add health check API~~
- [x] ~~Implement user registration API~~
- [x] ~~Add middleware for security and rate limiting~~
- [ ] Integrate aircraft tracking API
- [ ] Create flight search endpoints
- [ ] Implement API key management
- [ ] Add user search history

### 🔐 Authentication
- [x] ~~Set up authentication system and providers~~
- [x] ~~Created signin page~~
- [x] ~~Implement signup api and signup page~~
- [x] ~~Implement session management~~
- [x] ~~Added forgot password page~~
- [ ] Forgot password api and setup node mailer

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
   # Edit .env.local with your MongoDB URI and authentication configs
   ```

4. **Set up MongoDB database**
   ```bash
   # Using MongoDB Atlas (recommended)
   # Create a free cluster at https://cloud.mongodb.com
   
   # Or using Docker locally
   docker run -p 27017:27017 mongo:latest
   
   # Or install MongoDB locally
   # Follow instructions at https://docs.mongodb.com/manual/installation/
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