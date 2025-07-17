import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import store from '../database.js';
import { isEmailWhitelisted } from './whitelisted-emails.js';

const router = express.Router();

// Register endpoint with email whitelist validation
router.post('/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if email is whitelisted
  if (!isEmailWhitelisted(email)) {
    return res.status(403).json({ 
      message: 'Registration is restricted to authorized personnel only. Please contact your administrator.' 
    });
  }

  const session = store.openSession();
  try {
    // Check if user already exists
    const existingUser = await session.query({ collection: 'Users' })
      .whereEquals('email', email)
      .firstOrNull();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with underwriter role
    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: 'underwriter',
      permissions: ['view_applications', 'approve_loans', 'reject_loans', 'access_underwriter_portal'],
      '@metadata': {
        '@collection': 'Users'
      }
    };

    await session.store(newUser);
    await session.saveChanges();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role, permissions: newUser.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        permissions: newUser.permissions
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  } finally {
    session.dispose();
  }
});

// Login endpoint
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const session = store.openSession();
  try {
    // Find user by email
    const user = await session.query({ collection: 'Users' })
      .whereEquals('email', email)
      .firstOrNull();

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has underwriter permissions
    if (!user.role || user.role !== 'underwriter') {
      return res.status(403).json({ message: 'Access denied. Underwriter role required.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, permissions: user.permissions },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  } finally {
    session.dispose();
  }
});

export default router;