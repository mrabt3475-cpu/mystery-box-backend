const mongoose = require('mongoose');

// Database Transaction Helper
// Wraps operations in a transaction for atomic updates

const runTransaction = async (operations, options = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction(options);

  try {
    const result = await operations(session);
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// Transaction wrapper for withTransaction
const withTransaction = (fn) => {
  return async (...args) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const result = await fn(...args, session);
      await session.commitTransaction();
      await session.endSession();
      return result;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  };
};

module.exports = {
  runTransaction,
  withTransaction
};
