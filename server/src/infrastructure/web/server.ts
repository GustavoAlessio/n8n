import express from 'express';
import cors from 'cors';
import connectDB from '../database/mongodb';

const app = express();
const port = process.env.PORT || 3001;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

import obraRoutes from '../../adapters/routes/obraRoutes';

// Test Route
app.get('/', (req, res) => {
  res.send('ObraFácil API is running!');
});

// API Routes
app.use('/api', obraRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
