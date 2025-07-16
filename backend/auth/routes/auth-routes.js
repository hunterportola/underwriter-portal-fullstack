import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import store from '../../database.js';

const router = Router();

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

// Simple signup endpoint
router.post('/auth/signup', async (req, res) => {
    try {
        // Processing signup request
        console.log('📝 Signup request received:', req.body);
        
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const session = store.openSession();
        try {
            console.log('🔍 Checking for existing user with email:', email);
            // Check if user already exists
            const existingUser = await session.query({ collection: 'Users' })
                .whereEquals('email', email)
                .firstOrNull();
            console.log('👤 Existing user found:', !!existingUser);
                
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create new user
            const newUser = {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                createdAt: new Date(),
                '@metadata': {
                    '@collection': 'Users'
                }
            };
            
            await session.store(newUser);
            await session.saveChanges();
            
            // Create JWT token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name
                }
            });
        } finally {
            session.dispose();
        }
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Simple login endpoint
router.post('/auth/login', async (req, res) => {
    try {
        // Processing login request
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        
        const session = store.openSession();
        try {
            // Find user
            const user = await session.query({ collection: 'Users' })
                .whereEquals('email', email)
                .firstOrNull();
                
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            // Create JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } finally {
            session.dispose();
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;