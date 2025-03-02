import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', productRoutes);

export default app;
