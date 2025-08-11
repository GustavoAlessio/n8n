import { Request, Response } from 'express';
import Tarefa from '../../domain/models/Tarefa';

// Create a new task for a project
export const createTarefa = async (req: Request, res: Response) => {
  try {
    const { obraId } = req.params;
    const tarefa = new Tarefa({
      ...req.body,
      obra: obraId,
    });
    await tarefa.save();
    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
};

// Get all tasks for a specific project
export const getTarefasByObra = async (req: Request, res: Response) => {
  try {
    const { obraId } = req.params;
    const tarefas = await Tarefa.find({ obra: obraId }).populate('colaborador', 'nome');
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update a task
export const updateTarefa = async (req: Request, res: Response) => {
  try {
    const { tarefaId } = req.params;
    const tarefa = await Tarefa.findByIdAndUpdate(tarefaId, req.body, { new: true, runValidators: true });
    if (!tarefa) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(tarefa);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
};

// Delete a task
export const deleteTarefa = async (req: Request, res: Response) => {
  try {
    const { tarefaId } = req.params;
    const tarefa = await Tarefa.findByIdAndDelete(tarefaId);
    if (!tarefa) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
