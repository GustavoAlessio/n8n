import { Request, Response } from 'express';
import Material from '../../domain/models/Material';

// Add a material to a project
export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { obraId } = req.params;
    const material = new Material({
      ...req.body,
      obra: obraId,
    });
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: 'Error creating material', error });
  }
};

// Get all materials for a specific project
export const getMateriaisByObra = async (req: Request, res: Response) => {
  try {
    const { obraId } = req.params;
    const materiais = await Material.find({ obra: obraId });
    res.status(200).json(materiais);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error });
  }
};

// Update a material
export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findByIdAndUpdate(materialId, req.body, { new: true, runValidators: true });
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json(material);
  } catch (error) {
    res.status(400).json({ message: 'Error updating material', error });
  }
};

// Delete a material
export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const { materialId } = req.params;
    const material = await Material.findByIdAndDelete(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting material', error });
  }
};
