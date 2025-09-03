const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
  ocrText: { type: String },
  uploadDate: { type: Date, default: Date.now },
  filePath: { type: String, required: true } // path or URL to the receipt file
}, { timestamps: true });

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
