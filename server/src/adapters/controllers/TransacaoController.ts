import { Request, Response } from 'express';
import Transacao from '../../domain/models/Transacao';
import Obra from '../../domain/models/Obra';

// Create a new transaction
export const createTransacao = async (req: Request, res: Response) => {
  try {
    const transacao = new Transacao(req.body);
    await transacao.save();
    res.status(201).json(transacao);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error });
  }
};

// Get all transactions for a specific project (obra)
export const getTransacoesByObra = async (req: Request, res: Response) => {
  try {
    const { obraId } = req.params;
    const transacoes = await Transacao.find({ obra: obraId }).sort({ data: -1 });
    res.status(200).json(transacoes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

// Update a transaction
export const updateTransacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transacao = await Transacao.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!transacao) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transacao);
    } catch (error) {
        res.status(400).json({ message: 'Error updating transaction', error });
    }
}

// Delete a transaction
export const deleteTransacao = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const transacao = await Transacao.findByIdAndDelete(id);
        if (!transacao) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
}

// Generate a financial report for a project
export const getFinancialReport = async (req: Request, res: Response) => {
    try {
        const { obraId } = req.params;
        const obra = await Obra.findById(obraId);
        if (!obra) {
            return res.status(404).json({ message: 'Obra not found' });
        }

        const transacoes = await Transacao.find({ obra: obraId });

        const totalEntradas = transacoes
            .filter(t => t.tipo === 'entrada')
            .reduce((sum, t) => sum + t.valor, 0);

        const totalSaidas = transacoes
            .filter(t => t.tipo === 'saida')
            .reduce((sum, t) => sum + t.valor, 0);

        const saldo = totalEntradas - totalSaidas;

        res.status(200).json({
            orcamentoEstimado: obra.orcamentoEstimado,
            gastoReal: totalSaidas,
            totalEntradas,
            saldo,
            transacoes,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating financial report', error });
    }
};
