import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', userRoutes);

export default app;
