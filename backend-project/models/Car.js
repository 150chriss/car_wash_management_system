const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  PlateNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  CarType:     { type: String, required: true },
  CarSize:     { type: String, required: true, enum: ['Small', 'Medium', 'Large'] },
  DriverName:  { type: String, required: true },
  PhoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
