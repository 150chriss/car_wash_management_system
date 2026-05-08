const express = require('express');
const router = express.Router();
const ServicePackage = require('../models/ServicePackage');
const Car = require('../models/Car');
const Package = require('../models/Package');
const verifyToken = require('../middleware/auth');

// POST /api/servicepackages  — Insert
router.post('/', verifyToken, async (req, res) => {
  try {
    const { RecordNumber, ServiceDate, PlateNumber, PackageNumber } = req.body;
    if (!RecordNumber || !PlateNumber || !PackageNumber)
      return res.status(400).json({ message: 'RecordNumber, PlateNumber and PackageNumber are required.' });

    const existing = await ServicePackage.findOne({ RecordNumber });
    if (existing)
      return res.status(409).json({ message: 'Record number already exists.' });

    const car = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car not found.' });

    const pkg = await Package.findOne({ PackageNumber });
    if (!pkg) return res.status(404).json({ message: 'Package not found.' });

    const record = new ServicePackage({
      RecordNumber,
      ServiceDate: ServiceDate || Date.now(),
      PlateNumber: PlateNumber.toUpperCase(),
      PackageNumber,
    });
    await record.save();
    res.status(201).json({ message: 'Service record created.', record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/servicepackages  — Retrieve all (with car & package details)
router.get('/', verifyToken, async (req, res) => {
  try {
    const records = await ServicePackage.find().sort({ createdAt: -1 });

    // Manually populate from Car and Package collections
    const populated = await Promise.all(records.map(async (r) => {
      const car = await Car.findOne({ PlateNumber: r.PlateNumber });
      const pkg = await Package.findOne({ PackageNumber: r.PackageNumber });
      return {
        ...r.toObject(),
        car: car || null,
        package: pkg || null,
      };
    }));

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/servicepackages/:recordNumber
router.get('/:recordNumber', verifyToken, async (req, res) => {
  try {
    const record = await ServicePackage.findOne({ RecordNumber: req.params.recordNumber });
    if (!record) return res.status(404).json({ message: 'Record not found.' });

    const car = await Car.findOne({ PlateNumber: record.PlateNumber });
    const pkg = await Package.findOne({ PackageNumber: record.PackageNumber });

    res.json({ ...record.toObject(), car, package: pkg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/servicepackages/:recordNumber  — Update
router.put('/:recordNumber', verifyToken, async (req, res) => {
  try {
    const { ServiceDate, PlateNumber, PackageNumber } = req.body;

    if (PlateNumber) {
      const car = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
      if (!car) return res.status(404).json({ message: 'Car not found.' });
    }
    if (PackageNumber) {
      const pkg = await Package.findOne({ PackageNumber });
      if (!pkg) return res.status(404).json({ message: 'Package not found.' });
    }

    const updated = await ServicePackage.findOneAndUpdate(
      { RecordNumber: req.params.recordNumber },
      {
        ...(ServiceDate && { ServiceDate }),
        ...(PlateNumber && { PlateNumber: PlateNumber.toUpperCase() }),
        ...(PackageNumber && { PackageNumber }),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Record updated.', record: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/servicepackages/:recordNumber  — Delete
router.delete('/:recordNumber', verifyToken, async (req, res) => {
  try {
    const deleted = await ServicePackage.findOneAndDelete({ RecordNumber: req.params.recordNumber });
    if (!deleted) return res.status(404).json({ message: 'Record not found.' });
    res.json({ message: 'Record deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
