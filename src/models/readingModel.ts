import mongoose, { Document, Schema } from 'mongoose';

interface IReading extends Document {
customer_code: string;
measure_datetime: Date;
measure_type: 'WATER' | 'GAS';
measure_value: number;
}

const ReadingSchema: Schema = new Schema({
customer_code: { type: String, required: true },
measure_datetime: { type: Date, required: true },
measure_type: { type: String, enum: ['WATER', 'GAS'], required: true },
measure_value: { type: Number, required: true },
});

export default mongoose.model<IReading>('Reading', ReadingSchema);
