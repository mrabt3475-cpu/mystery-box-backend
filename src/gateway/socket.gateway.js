import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // Join user's personal room
    socket.join(`user:${socket.user.id}`);

    // Join channel room
    socket.on('join:channel', (channelId) => {
      socket.join(`channel:${channelId}`);
    });

    // Leave channel room
    socket.on('leave:channel', (channelId) => {
      socket.leave(`channel:${channelId}`);
    });

    // Send message to channel
    socket.on('message:send', (data) => {
      io.to(`channel:${data.channelId}`).emit('message:new', {
        user: socket.user.id,
        message: data.message,
        timestamp: new Date()
      });
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      socket.to(`channel:${data.channelId}`).emit('typing:start', {
        user: socket.user.id
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`channel:${data.channelId}`).emit('typing:stop', {
        user: socket.user.id
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });

  return io;
};
