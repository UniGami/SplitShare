const express = require('express');
const router = express.Router();
const {
  createBill,
  getBillById,
  getAllBills,
  updateBill,
  deleteBill
} = require('../controllers/billController');

// Create a new bill
router.post('/', createBill);

// Get all bills
router.get('/', getAllBills);

// Get a single bill by ID (with populated fields)
router.get('/:id', getBillById);

// Update a bill by ID
router.put('/:id', updateBill);

// Delete a bill by ID
router.delete('/:id', deleteBill);

module.exports = router;
