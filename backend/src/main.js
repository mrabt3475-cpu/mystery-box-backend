// Main Server Entry Point
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const config = require('./config/env');
const app = require('./app');

// Connect to Database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL,
    credentials: true,
  },
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join channel room
  socket.on('join_channel', (channelId) => {
    socket.join(`channel_${channelId}`);
    console.log(`User ${socket.id} joined channel_${channelId}`);
  });

  // Leave channel room
  socket.on('leave_channel', (channelId) => {
    socket.leave(`channel_${channelId}`);
  });

  // Handle chat message
  socket.on('chat_message', (data) => {
    io.to(`channel_${data.channelId}`).emit('new_message', data);
  });

  // Handle box opening
  socket.on('box_opening', (data) => {
    io.to(`channel_${data.channelId}`).emit('box_opened', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start Server
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
});

module.exports = { server, io };
