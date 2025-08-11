import { Router } from 'express';
import {
  createTransacao,
  getTransacoesByObra,
  updateTransacao,
  deleteTransacao,
  getFinancialReport,
} from '../controllers/TransacaoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// CRUD routes for transactions
router.post('/transacoes', protect, createTransacao);
router.get('/transacoes/obra/:obraId', protect, getTransacoesByObra);
router.put('/transacoes/:id', protect, updateTransacao);
router.delete('/transacoes/:id', protect, deleteTransacao);

// Financial report route
router.get('/financeiro/relatorio/:obraId', protect, getFinancialReport);

export default router;
