import { Router } from 'express';
import {
  createTarefa,
  getTarefasByObra,
  updateTarefa,
  deleteTarefa,
} from '../controllers/TarefaController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Nested routes for tasks within a project (obra)
router.post('/obras/:obraId/tarefas', protect, createTarefa);
router.get('/obras/:obraId/tarefas', protect, getTarefasByObra);

// Routes for specific tasks
router.put('/tarefas/:tarefaId', protect, updateTarefa);
router.delete('/tarefas/:tarefaId', protect, deleteTarefa);

export default router;
