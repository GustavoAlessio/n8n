import mongoose, { Schema, Document } from 'mongoose';

export interface IColaborador extends Document {
  nome: string;
  funcao: string;
  tipoPagamento: 'hora' | 'diaria';
  valor: number;
}

const ColaboradorSchema: Schema = new Schema({
  nome: { type: String, required: true },
  funcao: { type: String, required: true },
  tipoPagamento: {
    type: String,
    enum: ['hora', 'diaria'],
    required: true,
  },
  valor: { type: Number, required: true },
}, {
  timestamps: true,
});

export default mongoose.model<IColaborador>('Colaborador', ColaboradorSchema);
