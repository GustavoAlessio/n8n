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
import colaboradorRoutes from '../../adapters/routes/colaboradorRoutes';
import pontoRoutes from '../../adapters/routes/pontoRoutes';
import transacaoRoutes from '../../adapters/routes/transacaoRoutes';
import materialRoutes from '../../adapters/routes/materialRoutes';

// Test Route
app.get('/', (req, res) => {
  res.send('ObraFácil API is running!');
});

// API Routes
app.use('/api', obraRoutes);
app.use('/api', colaboradorRoutes);
app.use('/api', pontoRoutes);
app.use('/api', transacaoRoutes);
app.use('/api', materialRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
