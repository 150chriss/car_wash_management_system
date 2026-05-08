const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const ServicePackage = require('../models/ServicePackage');
const Car = require('../models/Car');
const Package = require('../models/Package');
const verifyToken = require('../middleware/auth');

// POST /api/payments  — Insert
router.post('/', verifyToken, async (req, res) => {
  try {
    const { PaymentNumber, AmountPaid, PaymentDate, PlateNumber, RecordNumber } = req.body;
    if (!PaymentNumber || !AmountPaid || !PlateNumber || !RecordNumber)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await Payment.findOne({ PaymentNumber });
    if (existing)
      return res.status(409).json({ message: 'Payment number already exists.' });

    const car = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car not found.' });

    const record = await ServicePackage.findOne({ RecordNumber });
    if (!record) return res.status(404).json({ message: 'Service record not found.' });

    const payment = new Payment({
      PaymentNumber,
      AmountPaid,
      PaymentDate: PaymentDate || Date.now(),
      PlateNumber: PlateNumber.toUpperCase(),
      RecordNumber,
    });
    await payment.save();
    res.status(201).json({ message: 'Payment recorded.', payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments  — Retrieve all
router.get('/', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/bill/:recordNumber  — Generate bill for a service record
router.get('/bill/:recordNumber', verifyToken, async (req, res) => {
  try {
    const record = await ServicePackage.findOne({ RecordNumber: req.params.recordNumber });
    if (!record) return res.status(404).json({ message: 'Service record not found.' });

    const car = await Car.findOne({ PlateNumber: record.PlateNumber });
    const pkg = await Package.findOne({ PackageNumber: record.PackageNumber });
    const payment = await Payment.findOne({ RecordNumber: req.params.recordNumber });

    res.json({
      bill: {
        RecordNumber: record.RecordNumber,
        ServiceDate: record.ServiceDate,
        PlateNumber: record.PlateNumber,
        DriverName: car?.DriverName,
        PhoneNumber: car?.PhoneNumber,
        CarType: car?.CarType,
        CarSize: car?.CarSize,
        PackageName: pkg?.PackageName,
        PackageDescription: pkg?.PackageDescription,
        PackagePrice: pkg?.PackagePrice,
        AmountPaid: payment?.AmountPaid,
        PaymentDate: payment?.PaymentDate,
        PaymentNumber: payment?.PaymentNumber,
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/report/daily  — Daily report
router.get('/report/daily', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    let start, end;

    if (date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(date);
      end.setHours(23, 59, 59, 999);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date();
      end.setHours(23, 59, 59, 999);
    }

    const payments = await Payment.find({
      PaymentDate: { $gte: start, $lte: end },
    }).sort({ PaymentDate: -1 });

    const report = await Promise.all(payments.map(async (p) => {
      const record = await ServicePackage.findOne({ RecordNumber: p.RecordNumber });
      const pkg = await Package.findOne({ PackageNumber: record?.PackageNumber });
      return {
        PlateNumber: p.PlateNumber,
        PackageName: pkg?.PackageName || '',
        PackageDescription: pkg?.PackageDescription || '',
        AmountPaid: p.AmountPaid,
        PaymentDate: p.PaymentDate,
      };
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
