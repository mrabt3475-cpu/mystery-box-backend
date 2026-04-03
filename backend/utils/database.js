// MongoDB Transaction Helper
const mongoose = require('mongoose');

const runTransaction = async (operations, options = {}) => {
  const session = await mongoose.startSession();
  
  try {
    let result;
    await session.withTransaction(async () => {
      result = await operations(session);
    });
    
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Atomic operations for points
const atomicPointsDeduction = async (userId, amount, session = null) => {
  const user = await mongoose.model('User').findById(userId);
  
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }
  
  if (user.pointsBalance < amount) {
    throw new Error('رصيدك غير كافٍ');
  }
  
  user.pointsBalance -= amount;
  
  const options = session ? { session } : {};
  await user.save(options);
  
  return user;
};

const atomicPointsAddition = async (userId, amount, session = null) => {
  const user = await mongoose.model('User').findById(userId);
  
  if (!user) {
    throw new Error('المستخدم غير موجود');
  }
  
  user.pointsBalance += amount;
  
  const options = session ? { session } : {};
  await user.save(options);
  
  return user;
};

module.exports = {
  runTransaction,
  atomicPointsDeduction,
  atomicPointsAddition
};
