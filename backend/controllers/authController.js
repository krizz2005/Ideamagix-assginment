const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logActivity = require('../utils/logger');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(403).json({ message: 'Your account is suspended. Contact Super Admin.' });
      }

      await logActivity(user._id, 'LOGIN', 'User authenticated successfully', req);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { loginUser, getUserProfile };