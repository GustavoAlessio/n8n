import { Router } from 'express';
import {
  createTransacao,
  getTransacoesByObra,
  updateTransacao,
  deleteTransacao,
  getFinancialReport,
} from '../controllers/TransacaoController';

const router = Router();

// CRUD routes for transactions
router.post('/transacoes', createTransacao);
router.get('/transacoes/obra/:obraId', getTransacoesByObra);
router.put('/transacoes/:id', updateTransacao);
router.delete('/transacoes/:id', deleteTransacao);

// Financial report route
router.get('/financeiro/relatorio/:obraId', getFinancialReport);

export default router;
