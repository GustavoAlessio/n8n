import mongoose, { Schema, Document } from 'mongoose';

export interface IObra extends Document {
  nome: string;
  endereco: string;
  cliente: string;
  orcamentoEstimado: number;
  prazoEntrega: Date;
  status: 'planejamento' | 'em execução' | 'concluída';
  fotos: string[];
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
  fotos: { type: [String], default: [] },
}, {
  timestamps: true,
});

export default mongoose.model<IObra>('Obra', ObraSchema);
