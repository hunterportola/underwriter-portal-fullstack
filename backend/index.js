// In backend/index.js
import express from 'express';
import cors from 'cors';
import { validateEnvironment } from './config/env-validation.js';
import store from './database.js';

// Validate environment variables first
validateEnvironment();

// Import routes using ES Module syntax
import authRoutes from './auth/routes/auth-routes.js';
import loanRoutes from './routes/loan.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Use the routes
app.use('/api', authRoutes);
app.use('/api', loanRoutes);

// Add a test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🗄️  Database: ${process.env.RAVENDB_DATABASE} at ${process.env.RAVENDB_URL}`);
});