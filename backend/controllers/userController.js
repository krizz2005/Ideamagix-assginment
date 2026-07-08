const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const logActivity = require('../utils/logger');


const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User profile with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role
    });

   
    if (req.user && req.user._id) {
      await logActivity(req.user._id, 'USER_CREATION', `Created user account for ${email} with role ${role}`, req);
    }

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: `Database Exception: ${error.message}` });
  }
};


const updateUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });


    if (req.body.email && req.body.email.toLowerCase().trim() !== targetUser.email) {
      const emailTaken = await User.findOne({ email: req.body.email.toLowerCase().trim() });
      if (emailTaken) {
        return res.status(400).json({ message: 'This email address is already taken' });
      }
      targetUser.email = req.body.email.toLowerCase().trim();
    }

    if (req.body.name) targetUser.name = req.body.name;
    if (req.body.role) targetUser.role = req.body.role;
    if (req.body.isActive !== undefined) targetUser.isActive = req.body.isActive;

    
    if (req.body.password && req.body.password.trim() !== '' && !req.body.password.includes('••')) {
      targetUser.password = req.body.password;
    }

    const updatedUser = await targetUser.save();

    
    if (req.user && req.user._id) {
      await logActivity(req.user._id, 'USER_UPDATE', `Updated user details for account tracking id: ${updatedUser._id}`, req);
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive
    });
  } catch (error) {
    res.status(500).json({ message: `Database Exception: ${error.message}` });
  }
};

const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'Target profile structure not found' });

    await User.findByIdAndDelete(req.params.id);
    
    if (req.user && req.user._id) {
      await logActivity(req.user._id, 'USER_DELETION', `Deleted user account tracking id: ${req.params.id}`, req);
    }

    res.json({ message: 'User account removed successfully from internal storage registries' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getActivityLogs };