// server/routes/certificateRoutes.js

import express from 'express';
// import { getPendingCertificates, updateCertificateStatus, verifyCertificate  } from '../controllers/certificatesController.js';
import { getCertificates, getCertificate } from '../controllers/certificatesController.js';
import { checkSubscription } from '../middleware/checkSubscription.js'

const certificateRouter = express.Router();

certificateRouter.get('/certificates', getCertificates);
certificateRouter.get('/certificates/:id', getCertificate);
// Route to get pending certificates
// certificateRouter.get('/pending', getPendingCertificates);
// certificateRouter.put('/:id', updateCertificateStatus);
// certificateRouter.get('/verify/:certificateId',checkSubscription , verifyCertificate);

export default certificateRouter;
