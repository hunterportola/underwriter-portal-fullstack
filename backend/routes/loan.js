// In backend/routes/loan.js
import express from 'express';
import { submitApplication } from '../controllers/loanController.js';
// import { optionalAuth } from '../auth/middleware/auth-middleware.js';

// JWT auth middleware
import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.userId,
                email: decoded.email
            };
            // User authenticated
        } catch (error) {
            // Invalid authentication token
            // Don't set req.user for invalid tokens
        }
    }
    next();
};

const router = express.Router();

console.log('Setting up loan routes...');
router.post('/application', jwtAuth, submitApplication);
console.log('Loan route /application registered');

export default router;