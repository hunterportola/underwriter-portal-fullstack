// In backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const store = require('./database');

// Import routes from their correct locations
const authRoutes = require('./auth/routes/auth-routes.js');
const loanRoutes = require('./routes/loan.js'); // Updated path

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use the routes, prefixed with /api
app.use('/api', authRoutes);
app.use('/api', loanRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});