// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // declare once at the top

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payments');
const productRoutes = require('./routes/product'); // new product route
const loginUsersRoutes = require('./routes/login-users'); // login users route

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder as static to access images/videos via URL

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes); // new product route
app.use('/api/auth', loginUsersRoutes); // login users route

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
