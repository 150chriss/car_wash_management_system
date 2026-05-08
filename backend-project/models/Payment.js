const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  PaymentNumber: { type: String, required: true, unique: true, trim: true },
  AmountPaid:    { type: Number, required: true },
  PaymentDate:   { type: Date, required: true, default: Date.now },
  PlateNumber:   { type: String, required: true, ref: 'Car' },
  RecordNumber:  { type: String, required: true, ref: 'ServicePackage' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
