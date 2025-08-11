import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistroPonto extends Document {
  colaborador: mongoose.Types.ObjectId;
  obra: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut?: Date;
}

const RegistroPontoSchema: Schema = new Schema({
  colaborador: {
    type: Schema.Types.ObjectId,
    ref: 'Colaborador',
    required: true,
  },
  obra: {
    type: Schema.Types.ObjectId,
    ref: 'Obra',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  checkOut: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IRegistroPonto>('RegistroPonto', RegistroPontoSchema);
