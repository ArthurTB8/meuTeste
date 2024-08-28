import mongoose, { Schema, Document } from 'mongoose';

export interface IMeasure extends Document {
// Defina as propriedades da interface aqui
  customer_code: string;
measure_type: string;
measure_datetime: Date;
measure_value: number;
image_url: string;
measure_uuid: string;
}

const MeasureSchema: Schema = new Schema({
// Defina o schema aqui
  customer_code: { type: String, required: true },
measure_type: { type: String, required: true },
measure_datetime: { type: Date, required: true },
measure_value: { type: Number, required: true },
image_url: { type: String, required: true },
measure_uuid: { type: String, required: true, unique: true }
});

export const Measure = mongoose.model<IMeasure>('Measure', MeasureSchema);
