const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'member' },       // e.g., 'admin', 'member'
    joinedAt: { type: Date, default: Date.now }      // when user joined the group
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// Virtual: bills associated with this group
groupSchema.virtual('bills', {
  ref: 'Bill',
  localField: '_id',
  foreignField: 'groupId'
});

groupSchema.set('toObject', { virtuals: true });
groupSchema.set('toJSON', { virtuals: true });

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
