const express = require('express');
const router = express.Router();
const {
  createReceipt,
  updateReceipt,
  deleteReceipt
} = require('../controllers/receiptController');

// Create a new receipt
router.post('/', createReceipt);

// Update a receipt by ID
router.put('/:id', updateReceipt);

// Delete a receipt by ID
router.delete('/:id', deleteReceipt);

module.exports = router;
