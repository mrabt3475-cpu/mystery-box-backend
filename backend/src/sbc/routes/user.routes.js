/* User Routes
const express = require('express');

import authMiddleware from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';

const userRouter = express.router();

// Get user profile
userRouter.get('/profile', authMiddleware, userController.getProfile);

// Update user profile
userRouter.put('/profile', authMiddleware, userController.updateProfile);

// Get all users
userRouter.get('/', authMiddleware, userController.getAllUsers);

