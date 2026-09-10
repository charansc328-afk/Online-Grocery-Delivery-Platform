import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import darkStoreRoutes from './routes/darkStoreRoutes.js';
import productRoutes from './routes/productRoutes.js';
import storeStockRoutes from './routes/storeStockRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import deliveryPartnerRoutes from './routes/deliveryPartnerRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS
app.use(cors({ origin: '*' }));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/darkstores', darkStoreRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', storeStockRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/reports', reportRoutes);
app.use('/api/delivery-partners', deliveryPartnerRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
