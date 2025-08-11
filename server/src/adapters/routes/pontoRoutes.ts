import { Router } from 'express';
import { checkIn, checkOut, getActiveRegistros } from '../controllers/PontoController';

const router = Router();

// Route for checking in
router.post('/ponto/checkin', checkIn);

// Route for checking out
router.put('/ponto/checkout/:id', checkOut);

// Route to get all active check-ins
router.get('/ponto/active', getActiveRegistros);


export default router;
