import express from 'express';
import { uploadImage, getMeasures, updateMeasure } from '../controllers/measureController';
import { validateUploadRequest } from '../utils/validationUtils';

const router = express.Router();

router.post('/upload', validateUploadRequest, uploadImage);
router.get('/measures', getMeasures);
router.put('/measures/:id', updateMeasure);

export default router;
