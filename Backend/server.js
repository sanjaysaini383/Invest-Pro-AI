// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// require('dotenv').config();

// const { connectDB } = require('./config/database');
// const { connectRedis } = require('./config/redis');
// const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');
// const { apiLimiter } = require('./middleware/rateLimit');

// const app = express();
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Initialize connections
// const initializeApp = async () => {
//   try {
//     await connectDB();
//     await connectRedis();
//     console.log('✅ All database connections established');
//   } catch (error) {
//     console.error('❌ Failed to initialize app:', error);
//     process.exit(1);
//   }
// };

// initializeApp();

// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:"],
//     },
//   },
// }));

// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:3000",
//   credentials: true
// }));

// // Request logging
// app.use(requestLogger);

// // Rate limiting
// app.use('/api/', apiLimiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Socket.io for real-time updates
// io.on('connection', (socket) => {
//   console.log('👤 User connected:', socket.id);

//   socket.on('join-room', (userId) => {
//     socket.join(`user-${userId}`);
//     console.log(`👤 User ${userId} joined room`);
//   });

//   socket.on('disconnect', () => {
//     console.log('👤 User disconnected:', socket.id);
//   });
// });

// // Make io available to routes
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

// // Root route
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: "InvestAI Backend API is running successfully! 🚀",
//     version: "1.0.0",
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       auth: "/api/auth",
//       investments: "/api/investments",
//       portfolio: "/api/portfolio",
//       roundup: "/api/roundup",
//       challenges: "/api/challenges",
//       user: "/api/user",
//       health: "/api/health"
//     }
//   });
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     status: 'OK',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     environment: process.env.NODE_ENV || 'development',
//     database: 'connected',
//     redis: 'connected'
//   });
// });

// // API Routes - Order matters!
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/investments', require('./routes/investments'));
// app.use('/api/portfolio', require('./routes/portfolio'));
// app.use('/api/roundup', require('./routes/roundup'));
// app.use('/api/challenges', require('./routes/challenges'));
// app.use('/api/user', require('./routes/user'));

// // 404 handler (MUST be after all routes)
// app.use(notFound);

// // Error handling middleware (MUST be last)
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   server.close(() => {
//     console.log('Process terminated');
//   });
// });

// module.exports = app;


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/database');
// const { connectRedis } = require('./config/redis'); // Comment out
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Initialize connections
const initializeApp = async () => {
  try {
    await connectDB();
    // await connectRedis(); // Comment out
    console.log('✅ Database connections established');
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    // Don't exit in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

initializeApp();

// Middleware setup
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(requestLogger);
app.use('/api/', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Socket.io setup
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "InvestAI Backend API is running successfully! 🚀",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: "/api/auth",
      investments: "/api/investments",
      portfolio: "/api/portfolio",
      roundup: "/api/roundup",
      challenges: "/api/challenges",
      user: "/api/user",
      health: "/api/health"
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'connected'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/roundup', require('./routes/roundup'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/user', require('./routes/user'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
