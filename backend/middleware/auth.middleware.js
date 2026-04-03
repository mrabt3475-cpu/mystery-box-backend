const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'غير مصادق' });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: 'المستخدم غير موجود' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'الحساب معطل' });
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'انتهت صلاحية الجلسة' });
    }
    return res.status(401).json({ success: false, error: 'غير مصادق' });
  }
};

module.exports = auth;
