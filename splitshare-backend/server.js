// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import route files
const userRoutes = require('./routes/userRouter');
const groupRoutes = require('./routes/groupRouter');
const billRoutes = require('./routes/billRouter');
const receiptRoutes = require('./routes/receiptRouter');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/receipts', receiptRoutes);


// Test route
app.get('/', (req, res) => res.send('Backend is running!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
