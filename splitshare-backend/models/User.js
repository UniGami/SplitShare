const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, unique: true, sparse: true }, // for Firebase users
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional, empty for Google users
    phone: { type: String },
    dateJoined: { type: Date, default: Date.now }
  }, { timestamps: true });

// Virtuals
userSchema.virtual('bills', {
  ref: 'Bill',
  localField: '_id',
  foreignField: 'userId'
});

userSchema.virtual('groups', {
  ref: 'Group',
  localField: '_id',
  foreignField: 'members.user'
});

// Include virtuals in JSON
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
