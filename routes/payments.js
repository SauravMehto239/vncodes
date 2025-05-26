const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Save a payment
router.post('/', async (req, res) => {
  try {
    const { name, email, paymentId } = req.body;
    if (!name || !email || !paymentId) {
      return res.status(400).json({ message: 'Name, email, and paymentId are required.' });
    }

    const exists = await Payment.findOne({ paymentId });
    if (exists) {
      return res.status(409).json({ message: 'Payment ID already exists.' });
    }

    const payment = new Payment({ name, email, paymentId });
    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
