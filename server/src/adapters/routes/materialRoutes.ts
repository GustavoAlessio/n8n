import { Router } from 'express';
import {
  createMaterial,
  getMateriaisByObra,
  updateMaterial,
  deleteMaterial,
} from '../controllers/MaterialController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Nested routes for materials within a project (obra)
router.post('/obras/:obraId/materiais', protect, createMaterial);
router.get('/obras/:obraId/materiais', protect, getMateriaisByObra);
router.put('/materiais/:materialId', protect, updateMaterial);
router.delete('/materiais/:materialId', protect, deleteMaterial);

export default router;
