const ActivityLog = require('../models/ActivityLog');

const logActivity = async (userId, action, details = '', req = null) => {
  try {
    if (!userId || !action) {
      return;
    }

    
    const ipAddress = req
      ? (req.ip ||
         req.headers['x-forwarded-for'] ||
         req.socket?.remoteAddress ||
         'System Action')
      : 'System Action';

    await ActivityLog.create({
      user: userId,
      action,
      details,
      ipAddress,
    });

  } catch (error) {
    console.error('Activity Logger Error:', error.message);
  }
};

module.exports = logActivity;