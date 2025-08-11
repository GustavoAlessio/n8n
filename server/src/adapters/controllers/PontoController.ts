import { Request, Response } from 'express';
import RegistroPonto from '../../domain/models/RegistroPonto';

// Handles the check-in action for a collaborator on a specific project
export const checkIn = async (req: Request, res: Response) => {
  try {
    const { colaboradorId, obraId } = req.body;

    // Optional: Check if there is already an open check-in for this collaborator
    const existingCheckIn = await RegistroPonto.findOne({
      colaborador: colaboradorId,
      checkOut: { $exists: false },
    });

    if (existingCheckIn) {
      return res.status(409).json({ message: 'Colaborador já possui um check-in ativo.' });
    }

    const newRegistro = new RegistroPonto({
      colaborador: colaboradorId,
      obra: obraId,
      checkIn: new Date(),
    });

    await newRegistro.save();
    res.status(201).json(newRegistro);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao realizar check-in', error });
  }
};

// Handles the check-out action for a collaborator
export const checkOut = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // The ID of the RegistroPonto document

    const registro = await RegistroPonto.findById(id);

    if (!registro) {
      return res.status(404).json({ message: 'Registro de ponto não encontrado.' });
    }

    if (registro.checkOut) {
      return res.status(409).json({ message: 'Este registro de ponto já possui um check-out.' });
    }

    registro.checkOut = new Date();
    await registro.save();

    res.status(200).json(registro);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao realizar check-out', error });
  }
};

// Gets all active (not checked out) time records
export const getActiveRegistros = async (req: Request, res: Response) => {
    try {
        const activeRegistros = await RegistroPonto.find({ checkOut: { $exists: false } })
            .populate('colaborador', 'nome')
            .populate('obra', 'nome');
        res.status(200).json(activeRegistros);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar registros ativos', error });
    }
}
