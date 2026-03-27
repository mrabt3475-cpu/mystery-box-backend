/* Error Handling Middleware
*Used to handle all errors consistently*/

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Check if response is already sent
  if (res.headers-sent) {
    return next();
  }

  // Determine status code
  const status = err.status || 500;

  // Determine error message
  let message = 'Internal server error';

  if (err.name === 'ValidationError') {
    message = err.message;
  } else if (err.code === 11000) {
    message = 'MongoDB connection error';
  } else if (err.code === 'CastError') {
    message = 'Cast Error';
  }

  // send json response
  res.status(status).json({
    error: message,
    details: process.env.DEVELL_MODE || ''
  });
};

module.exports = errorMiddleware;
