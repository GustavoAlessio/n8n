import { Router } from 'express';
import {
  createTarefa,
  getTarefasByObra,
  updateTarefa,
  deleteTarefa,
} from '../controllers/TarefaController';

const router = Router();

// Nested routes for tasks within a project (obra)
router.post('/obras/:obraId/tarefas', createTarefa);
router.get('/obras/:obraId/tarefas', getTarefasByObra);

// Routes for specific tasks
router.put('/tarefas/:tarefaId', updateTarefa);
router.delete('/tarefas/:tarefaId', deleteTarefa);

export default router;
