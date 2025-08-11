import { Router } from 'express';
import {
  createObra,
  getAllObras,
  getObraById,
  updateObra,
  deleteObra,
} from '../controllers/ObraController';

const router = Router();

router.post('/obras', createObra);
router.get('/obras', getAllObras);
router.get('/obras/:id', getObraById);
router.put('/obras/:id', updateObra);
router.delete('/obras/:id', deleteObra);

export default router;
