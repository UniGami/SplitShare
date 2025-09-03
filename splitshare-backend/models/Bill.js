const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // bill creator
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null }, // null = personal bill
  category: { type: String, required:true },
  contents: { type: [String], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },

  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shareAmount: { type: Number } // optional, can be calculated evenly
  }]
}, { timestamps: true });

// Virtual for receipts linked to this bill
billSchema.virtual('receipts', {
  ref: 'Receipt',
  localField: '_id',
  foreignField: 'billId'
});

billSchema.set('toObject', { virtuals: true });
billSchema.set('toJSON', { virtuals: true });

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
