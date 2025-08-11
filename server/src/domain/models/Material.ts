import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  nome: string;
  unidade: string;
  quantidade: number;
  precoUnitario: number;
  fornecedor?: string;
  obra: mongoose.Types.ObjectId;
}

const MaterialSchema: Schema = new Schema({
  nome: { type: String, required: true },
  unidade: { type: String, required: true },
  quantidade: { type: Number, required: true, default: 0 },
  precoUnitario: { type: Number, required: true },
  fornecedor: { type: String },
  obra: {
    type: Schema.Types.ObjectId,
    ref: 'Obra',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IMaterial>('Material', MaterialSchema);
