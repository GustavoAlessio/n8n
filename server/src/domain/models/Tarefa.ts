import mongoose, { Schema, Document } from 'mongoose';

export interface ITarefa extends Document {
  titulo: string;
  descricao?: string;
  prazo: Date;
  status: 'pendente' | 'em andamento' | 'concluida';
  obra: mongoose.Types.ObjectId;
  colaborador?: mongoose.Types.ObjectId;
}

const TarefaSchema: Schema = new Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  prazo: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pendente', 'em andamento', 'concluida'],
    default: 'pendente',
    required: true,
  },
  obra: {
    type: Schema.Types.ObjectId,
    ref: 'Obra',
    required: true,
  },
  colaborador: {
    type: Schema.Types.ObjectId,
    ref: 'Colaborador',
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITarefa>('Tarefa', TarefaSchema);
