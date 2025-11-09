const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    // Create the group
    const group = await Group.create(req.body);

    // Populate after creation
    const populatedGroup = await Group.findById(group._id)
      .populate({
        path: "members.user",
        select: "name email _id",
      })
      .populate({
        path: "bills",
        populate: { path: "receipts" },
      });

    res.status(201).json(populatedGroup);
  } catch (err) {
    console.error("❌ Error creating group:", err);
    res.status(400).json({ error: err.message });
  }
};


// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('members.user')
      .populate({ 
        path: 'bills', 
        populate: { path: 'receipts' } 
      });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user')
      .populate({ path: 'bills', populate: { path: 'receipts' } });
    
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update group info
exports.updateGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Build an update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (Array.isArray(members) && members.length > 0) {
      updateFields.members = members; // replace members array
    }

let group = await Group.findByIdAndUpdate(
  req.params.id,
  { $set: updateFields },
  { new: true } // returns the updated document
);

// populate members → user
group = await group.populate({
  path: "members.user",
  select: "name email _id",
});

// populate bills → receipts
group = await group.populate({
  path: "bills",
  populate: { path: "receipts" },
});


    console.log("✅ Updated Group:", group.members);

    if (!group) return res.status(404).json({ error: "Group not found" });

    res.json(group);
  } catch (err) {
    console.error("❌ Error updating group:", err);
    res.status(400).json({ error: err.message });
  }
};



// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a member to the group
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Prevent duplicate members
    const exists = group.members.some(m => m.user.toString() === userId);
    if (exists) return res.status(400).json({ error: 'User already in group' });

    group.members.push({ user: userId, role, joinedAt: new Date() });
    await group.save();
    await group.populate('members.user');
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a member from the group
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.members = group.members.filter(m => m.user.toString() !== memberId);
    await group.save();
    await group.populate('members.user');
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
