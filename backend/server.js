const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adBannerRoutes = require('./routes/adBannerRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Simple CORS for debugging and production
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('JOYA API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/adbanners', adBannerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
