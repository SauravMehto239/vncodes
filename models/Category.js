const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true }, // stores path like '/uploads/123456.jpg'
});

module.exports = mongoose.model('Category', categorySchema);
