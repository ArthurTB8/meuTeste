import { Request, Response, NextFunction } from 'express';

// Validação básica para checar o tipo de dado da imagem (base64)
export const validateBase64 = (base64String: string): boolean => {
const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
return base64Regex.test(base64String);
};

// Middleware para validação de dados
export const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
const { image, customer_code, measure_datetime, measure_type } = req.body;

if (!image || !customer_code || !measure_datetime || !measure_type) {
return res.status(400).json({
error_code: 'INVALID_DATA',
error_description: 'Todos os campos são obrigatórios',
});
}

if (!validateBase64(image)) {
return res.status(400).json({
error_code: 'INVALID_DATA',
error_description: 'O formato da imagem base64 é inválido',
});
}

if (!['WATER', 'GAS'].includes(measure_type)) {
return res.status(400).json({
error_code: 'INVALID_DATA',
error_description: 'Tipo de medição inválido',
});
}

next();
};
