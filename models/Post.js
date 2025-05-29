const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },  // Accept any string now
  description: { type: String, required: true },
  type: { type: String, enum: ['free', 'paid'], required: true },
  amount: { type: Number, default: 0 },
  image_url: { type: String },   // For uploaded image URL/path
  image_link: { type: String },  // For external image URL/link
}, { timestamps: true });


module.exports = mongoose.model('Post', postSchema);







