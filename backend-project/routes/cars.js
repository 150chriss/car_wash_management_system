const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const verifyToken = require('../middleware/auth');

// POST /api/cars  — Insert a car
router.post('/', verifyToken, async (req, res) => {
  try {
    const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;
    if (!PlateNumber || !CarType || !CarSize || !DriverName || !PhoneNumber)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await Car.findOne({ PlateNumber: PlateNumber.toUpperCase() });
    if (existing)
      return res.status(409).json({ message: 'Car with this plate number already exists.' });

    const car = new Car({ PlateNumber, CarType, CarSize, DriverName, PhoneNumber });
    await car.save();
    res.status(201).json({ message: 'Car registered successfully.', car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cars  — Retrieve all cars
router.get('/', verifyToken, async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cars/:plateNumber
router.get('/:plateNumber', verifyToken, async (req, res) => {
  try {
    const car = await Car.findOne({ PlateNumber: req.params.plateNumber.toUpperCase() });
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
