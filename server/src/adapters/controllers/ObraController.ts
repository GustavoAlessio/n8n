import { Request, Response } from 'express';
import Obra from '../../domain/models/Obra';

export const createObra = async (req: Request, res: Response) => {
  try {
    const obra = new Obra(req.body);
    await obra.save();
    res.status(201).json(obra);
  } catch (error) {
    res.status(400).json({ message: 'Error creating obra', error });
  }
};

export const getAllObras = async (req: Request, res: Response) => {
  try {
    const obras = await Obra.find();
    res.status(200).json(obras);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching obras', error });
  }
};

export const getObraById = async (req: Request, res: Response) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) {
      return res.status(404).json({ message: 'Obra not found' });
    }
    res.status(200).json(obra);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching obra', error });
  }
};

export const updateObra = async (req: Request, res: Response) => {
  try {
    const obra = await Obra.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!obra) {
      return res.status(404).json({ message: 'Obra not found' });
    }
    res.status(200).json(obra);
  } catch (error) {
    res.status(400).json({ message: 'Error updating obra', error });
  }
};

export const deleteObra = async (req: Request, res: Response) => {
  try {
    const obra = await Obra.findByIdAndDelete(req.params.id);
    if (!obra) {
      return res.status(404).json({ message: 'Obra not found' });
    }
    res.status(200).json({ message: 'Obra deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting obra', error });
  }
};

// Get all completed obras
export const getObrasConcluidas = async (req: Request, res: Response) => {
    try {
        const obras = await Obra.find({ status: 'concluída' });
        res.status(200).json(obras);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed obras', error });
    }
};
