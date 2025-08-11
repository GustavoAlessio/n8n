import { Router } from 'express';
import {
  createColaborador,
  getAllColaboradores,
  getColaboradorById,
  updateColaborador,
  deleteColaborador,
} from '../controllers/ColaboradorController';

const router = Router();

router.post('/colaboradores', createColaborador);
router.get('/colaboradores', getAllColaboradores);
router.get('/colaboradores/:id', getColaboradorById);
router.put('/colaboradores/:id', updateColaborador);
router.delete('/colaboradores/:id', deleteColaborador);

export default router;
