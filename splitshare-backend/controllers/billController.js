const Bill = require('../models/Bill');
const Group = require('../models/Group');

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const { userId, groupId, sharedWith } = req.body;

    // If it's a shared bill, validate users are in the group
    if (groupId && sharedWith && sharedWith.length > 0) {
      const group = await Group.findById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });

      const memberIds = group.members.map(m => m.user.toString());
      for (let sw of sharedWith) {
        if (!memberIds.includes(sw.user)) {
          return res.status(400).json({ error: `User ${sw.user} is not a member of the group` });
        }
      }
    }

    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('userId')          // creator
      .populate('groupId')         // group info
      .populate('sharedWith.user') // shared users
      .populate('receipts');       // receipts
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single bill by ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('userId')
      .populate('groupId')
      .populate('sharedWith.user')
      .populate('receipts');

    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a bill by ID
exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('userId')
      .populate('groupId')
      .populate('sharedWith.user')
      .populate('receipts');

    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a bill by ID
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
