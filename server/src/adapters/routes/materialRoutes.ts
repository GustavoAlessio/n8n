import { Router } from 'express';
import {
  createMaterial,
  getMateriaisByObra,
  updateMaterial,
  deleteMaterial,
} from '../controllers/MaterialController';

const router = Router();

// Nested routes for materials within a project (obra)
router.post('/obras/:obraId/materiais', createMaterial);
router.get('/obras/:obraId/materiais', getMateriaisByObra);
router.put('/materiais/:materialId', updateMaterial);
router.delete('/materiais/:materialId', deleteMaterial);

export default router;
