const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Explicitly bind environment configuration parameters
dotenv.config();

// Fire database connection instance parameters
connectDB();


const app = express();

// Global Request Middlewares Configuration Matrix
app.use(cors());
app.use(express.json()); // Explicitly handle standard incoming JSON payloads

// Mount REST Router Collections API Layers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));

// Centralized API Route Fallback Error Boundaries Guard
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Production API Server running on port ${PORT} in ${process.env.NODE_ENV} environment`));