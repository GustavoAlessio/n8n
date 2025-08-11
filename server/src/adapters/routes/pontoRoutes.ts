import { Router } from 'express';
import { checkIn, checkOut, getActiveRegistros } from '../controllers/PontoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Route for checking in
router.post('/ponto/checkin', protect, checkIn);

// Route for checking out
router.put('/ponto/checkout/:id', protect, checkOut);

// Route to get all active check-ins
router.get('/ponto/active', protect, getActiveRegistros);


export default router;
