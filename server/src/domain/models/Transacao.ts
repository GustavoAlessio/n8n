import mongoose, { Schema, Document } from 'mongoose';

export interface ITransacao extends Document {
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  obra: mongoose.Types.ObjectId;
  data: Date;
}

const TransacaoSchema: Schema = new Schema({
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  tipo: {
    type: String,
    enum: ['entrada', 'saida'],
    required: true,
  },
  obra: {
    type: Schema.Types.ObjectId,
    ref: 'Obra',
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITransacao>('Transacao', TransacaoSchema);
