/* Auth Routes
const express = require('express');

import authController from '../controllers/auth.controller';

const authRouter = express.router();

// Register
authRouter.post('/register', authController.register);

// Login
authRouter.post('/login', authController.login);

// Logout
authRouter.post('/logout', authController.logout);

