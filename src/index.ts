import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import measureRoutes from './routes/measureRoutes';
import { Measure, IMeasure } from './models/measureModel'; // Adicione esta linha

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', measureRoutes);

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/image-reading-service';

mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const imageSchema = new mongoose.Schema({
imageUrl: String,
description: String
});

const Image = mongoose.model('Image', imageSchema);

// POST route to add an image
app.post('/images', async (req, res) => {
const { imageUrl, description } = req.body;
const image = new Image({ imageUrl, description });
await image.save();
res.status(201).send(image);
});

// GET route to fetch all images
app.get('/images', async (req, res) => {
const images = await Image.find();
res.status(200).send(images);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});

export { app };

function validarTipoMedicao(tipo: string): boolean {
return ['WATER', 'GAS'].includes(tipo);
}

async function verificarMedicaoExistente(customer_code: string, measure_type: string, measure_datetime: Date): Promise<boolean> {
const firstDayOfMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
const firstDayOfNextMonth = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 1);

const existingMeasure = await Measure.findOne({
customer_code,
measure_type,
measure_datetime: {
$gte: firstDayOfMonth,
$lt: firstDayOfNextMonth,
},
});

return !!existingMeasure;
}

async function salvarMeasure(dados: IMeasure): Promise<IMeasure> {
const newMeasure = new Measure(dados);
return await newMeasure.save();
}
