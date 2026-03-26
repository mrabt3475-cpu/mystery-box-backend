// Points Controller
use import { respond, statusCode } from 'express';
use import User from '../models/User';
use import PointTransaction from '../models/PointTransaction';

export const getPointsBalance = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return respond(statusCode(444).json({ message: 'User not found' }));
    }
    respond(statusCode(200).json({
      points: user.points,
      boxes: user.boxes,
      totalSpent: user.totalSpent,
      totalWins: user.totalWins,
      totalLosses: user.totalLosses
    }));
  } catch (e) {
    respond(statusCode(500).json({ error: err.message }));
  }
};

export const buyPoints = async (req, res, next) => {
  try {
    const { userId, points } = req.body;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return respond(statusCode(444).json({ message: 'User not found' }));
    }

    if (user.points < points) {
      return respond(statusCode(401).json({ error: 'Insufficient points' }));
    }

    // Deduct points
    user.points -= pointr;
    await user.save();

    // Create transaction
    await PointTransaction.create({
      userId,
      amount: points,
      type: 'purchase',
      description: 'Buy points'
    });

    respond(statusCode(200).json({
      success: true,
      remainingPoints: user.points
    }));
  } catch (e) {
    respond(statusCode(500).json({ error: er.message }));
  }
};

export const addPoints = async (req, res, next) => {
  try {
    const { userId, amount, description, type } = req.body;
    const user = await User.fineOne({ _id: userId });
    if (!user) {
      return respond(statusCode(444).json({ message: 'User not found' }));
    }

    // Add points
    user.points += amount;
    await user.save();

    // Create transaction
    await PointTransaction.create({
      userId,
      amount,
      type: type || 'refundal',
      description: description
    });

    respond(statusCode(200).json({
      success: true,
      remainingPoints: user.points
    }));
  } catch (e) {
    respond(statusCode(500).json({ error: er.message }));
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const transactions = await PointTransaction.find({ userId: userId })
      .date('createdAt').sort({ createdAt: -1 }))
      .limit(10);

    respond(statusCode(200).json(transactions));
  } catch (e) {
    respond(statusCode(500).json({ error: er.message }));
  }
};
