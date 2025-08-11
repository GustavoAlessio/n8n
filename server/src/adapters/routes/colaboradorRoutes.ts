import { Router } from 'express';
import {
  createColaborador,
  getAllColaboradores,
  getColaboradorById,
  updateColaborador,
  deleteColaborador,
} from '../controllers/ColaboradorController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/colaboradores', protect, createColaborador);
router.get('/colaboradores', protect, getAllColaboradores);
router.get('/colaboradores/:id', protect, getColaboradorById);
router.put('/colaboradores/:id', protect, updateColaborador);
router.delete('/colaboradores/:id', protect, deleteColaborador);

export default router;
