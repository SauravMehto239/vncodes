const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // stores path or URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema); 
