const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.log("User creation failed:", err.message); // 👈 add this
    res.status(400).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    console.log("🟢 getAllUsers called"); // debug log
    const users = await User.find();
    console.log("✅ Users fetched:", users.length);
    res.json(users);
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get a single user by ID (with bills & groups populated)
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({email: req.params.email})
      .populate({
        path: 'bills',
        populate: { path: 'receipts' } // nested populate receipts for each bill
      })
      .populate('groups'); // groups user belongs to

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({email:req.params.email}, req.body, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({email: req.params.email});
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
