const Receipt = require('../models/Receipt');

// Create a new receipt
exports.createReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.create(req.body);
    res.status(201).json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a receipt by ID
exports.updateReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json(receipt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a receipt by ID
exports.deleteReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) return res.status(404).json({ error: 'Receipt not found' });
    res.json({ message: 'Receipt deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
