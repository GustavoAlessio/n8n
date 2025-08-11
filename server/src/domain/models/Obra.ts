import mongoose, { Schema, Document } from 'mongoose';

export interface IObra extends Document {
  nome: string;
  endereco: string;
  cliente: string;
  orcamentoEstimado: number;
  prazoEntrega: Date;
  status: 'planejamento' | 'em execução' | 'concluída';
}

const ObraSchema: Schema = new Schema({
  nome: { type: String, required: true },
  endereco: { type: String, required: true },
  cliente: { type: String, required: true },
  orcamentoEstimado: { type: Number, required: true },
  prazoEntrega: { type: Date, required: true },
  status: {
    type: String,
    enum: ['planejamento', 'em execução', 'concluída'],
    default: 'planejamento',
  },
}, {
  timestamps: true,
});

export default mongoose.model<IObra>('Obra', ObraSchema);
