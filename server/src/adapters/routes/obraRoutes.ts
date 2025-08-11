import { Router } from 'express';
import {
  createObra,
  getAllObras,
  getObraById,
  updateObra,
  deleteObra,
  getObrasConcluidas,
} from '../controllers/ObraController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/obras', protect, createObra);
router.get('/obras', protect, getAllObras);
router.get('/obras/concluidas', protect, getObrasConcluidas);
router.get('/obras/:id', protect, getObraById);
router.put('/obras/:id', protect, updateObra);
router.delete('/obras/:id', protect, deleteObra);

export default router;
