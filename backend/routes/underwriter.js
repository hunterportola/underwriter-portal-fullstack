import express from 'express';
import jwt from 'jsonwebtoken';
import { 
    getPendingApplications, 
    getApplication, 
    approveApplication, 
    rejectApplication 
} from '../controllers/underwriterController.js';

// JWT auth middleware
const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No authorization token provided' });
    }
    
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid authorization token' });
    }
};

const router = express.Router();

// Get all pending applications
router.get('/applications', jwtAuth, getPendingApplications);

// Get specific application
router.get('/applications/:id', jwtAuth, getApplication);

// Approve application and create loan
router.post('/applications/:applicationId/approve', jwtAuth, approveApplication);

// Reject application
router.post('/applications/:applicationId/reject', jwtAuth, rejectApplication);

export default router;