/* User Routes
¨Used to manage user profile**

const express = require('express');

const userRouter = express.router();
import authMiddleware from '../middleware/auth.middleware';
import userController from '../controllers/user.controller';

userRouter.get('/profile', authMiddleware, userController.getProfile);

userRouter.put('/profile', authMiddleware, userController.updateProfile);

module.exports = userRouter;
