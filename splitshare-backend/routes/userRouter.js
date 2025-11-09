const express = require('express');
const router = express.Router();
const {
  createUser,
  getUserByEmail,
  getUserByID,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

// Get a single user by email (with bills & groups populated)
router.get('/:email', getUserByEmail);
router.get('/id/:id', getUserByID);

// Update a user by email
router.put('/:email', updateUser);

// Delete a user by email
router.delete('/:email', deleteUser);

module.exports = router;
