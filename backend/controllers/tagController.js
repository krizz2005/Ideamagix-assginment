const Tag = require('../models/Tag');

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({}).sort({ name: 1 });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTag = async (req, res) => {
  const { name, color } = req.body;
  try {
    const normalized = name.trim();
    let existing = await Tag.findOne({ name: { $regex: new RegExp(`^${normalized}$`, 'i') } });
    if (existing) return res.status(400).json({ message: 'Tag name matches an entry already configured' });

    const newTag = await Tag.create({ name: normalized, color });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTags, createTag, deleteTag };