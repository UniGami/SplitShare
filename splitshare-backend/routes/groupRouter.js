const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroupById,
  getAllGroups,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember
} = require('../controllers/groupController');

// Create a new group
router.post('/', createGroup);

// Get all groups
router.get('/', getAllGroups);

// Get a single group by ID (with members populated)
router.get('/:id', getGroupById);

// Update group info
router.put('/:id', updateGroup);

// Delete a group
router.delete('/:id', deleteGroup);

// Add a member to the group
router.post('/:id/members', addMember);

// Remove a member from the group
router.delete('/:id/members/:memberId', removeMember);

module.exports = router;
