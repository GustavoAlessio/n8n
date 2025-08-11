import { Request, Response } from 'express';
import Colaborador from '../../domain/models/Colaborador';

export const createColaborador = async (req: Request, res: Response) => {
  try {
    const colaborador = new Colaborador(req.body);
    await colaborador.save();
    res.status(201).json(colaborador);
  } catch (error) {
    res.status(400).json({ message: 'Error creating colaborador', error });
  }
};

export const getAllColaboradores = async (req: Request, res: Response) => {
  try {
    const colaboradores = await Colaborador.find();
    res.status(200).json(colaboradores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colaboradores', error });
  }
};

export const getColaboradorById = async (req: Request, res: Response) => {
  try {
    const colaborador = await Colaborador.findById(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador not found' });
    }
    res.status(200).json(colaborador);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colaborador', error });
  }
};

export const updateColaborador = async (req: Request, res: Response) => {
  try {
    const colaborador = await Colaborador.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador not found' });
    }
    res.status(200).json(colaborador);
  } catch (error) {
    res.status(400).json({ message: 'Error updating colaborador', error });
  }
};

export const deleteColaborador = async (req: Request, res: Response) => {
  try {
    const colaborador = await Colaborador.findByIdAndDelete(req.params.id);
    if (!colaborador) {
      return res.status(404).json({ message: 'Colaborador not found' });
    }
    res.status(200).json({ message: 'Colaborador deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting colaborador', error });
  }
};
