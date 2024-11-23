// routes/documentRoutes.js
import express from 'express';
import { uploadDocument, reviewDocument } from '../controllers/documentController.js';
import upload from '../middleware/fileUpload.js';

const documentRouter = express.Router();

documentRouter.post('/upload', upload.single('file'), uploadDocument);
documentRouter.put('/review/:id', reviewDocument);

export default documentRouter;
