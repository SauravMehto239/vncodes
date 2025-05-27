// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true }, // New field added
});

module.exports = mongoose.model('Category', categorySchema);
