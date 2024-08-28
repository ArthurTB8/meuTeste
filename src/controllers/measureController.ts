import { Request, Response } from 'express';
import { Measure } from '../models/measureModel';
import { processImage } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (req: Request, res: Response) => {
	const { image, customer_code, measure_datetime, measure_type } = req.body;

	try {
		const existingMeasure = await Measure.findOne({
			customer_code,
			measure_type,
			measure_datetime: {
				$gte: new Date(new Date(measure_datetime).setDate(1)),
				$lt: new Date(new Date(measure_datetime).setMonth(new Date(measure_datetime).getMonth() + 1, 1)),
			},
		});

		if (existingMeasure) {
			return res.status(409).json({
				error_code: 'DOUBLE_REPORT',
				error_description: 'Leitura do mês já realizada',
			});
		}

		const processedImage = await processImage(image);
		const measure_uuid = uuidv4();
		const newMeasure = new Measure({
			customer_code,
			measure_datetime: new Date(measure_datetime),
			measure_type,
			measure_value: processedImage.measure_value,
			image_url: processedImage.image_url,
			measure_uuid,
		});

		await newMeasure.save();

		return res.status(200).json({
			image_url: processedImage.image_url,
			measure_value: processedImage.measure_value,
			measure_uuid,
		});
	} catch (error) {
		console.error('Erro ao processar a imagem:', error);
		return res.status(500).json({
			error_code: 'INTERNAL_ERROR',
			error_description: 'Erro interno do servidor',
		});
	}
};

export const getMeasures = async (req: Request, res: Response) => {
	try {
		const measures = await Measure.find();
		res.status(200).json(measures);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao buscar medições' });
	}
};

export const updateMeasure = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updatedMeasure = await Measure.findByIdAndUpdate(id, req.body, { new: true });
		if (!updatedMeasure) {
			return res.status(404).json({ error: 'Medição não encontrada' });
		}
		res.status(200).json(updatedMeasure);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao atualizar medição' });
	}
};
