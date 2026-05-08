const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const verifyToken = require('../middleware/auth');

// POST /api/packages
router.post('/', verifyToken, async (req, res) => {
  try {
    const { PackageNumber, PackageName, PackageDescription, PackagePrice } = req.body;
    if (!PackageNumber || !PackageName || !PackageDescription || !PackagePrice)
      return res.status(400).json({ message: 'All fields are required.' });

    const existing = await Package.findOne({ PackageNumber });
    if (existing)
      return res.status(409).json({ message: 'Package number already exists.' });

    const pkg = new Package({ PackageNumber, PackageName, PackageDescription, PackagePrice });
    await pkg.save();
    res.status(201).json({ message: 'Package created successfully.', package: pkg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/packages
router.get('/', verifyToken, async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
