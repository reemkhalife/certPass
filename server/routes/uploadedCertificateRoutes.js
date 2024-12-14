import express from 'express';
import UploadedCertificate from '../models/uploadedCertificate.js';
import multer from 'multer';
import path from 'path';

const uploadedCertificateRouter = express.Router();

// // Set up storage engine
// const certificateStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, '../uploads/uploadedCertificates/'); // Directory to store uploaded files
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//     }
// });
  
// // Initialize multer with storage configuration
// const certificateUpload = multer({ certificateStorage });

// // Controller to handle certificate upload
// uploadedCertificateRouter.post('/uploadedCertificates', certificateUpload.single('certificate'), async (req, res) => {
//   try {
//     const { name, issueDate, uploader } = req.body;
//     const filePath = req.file.path;

//     const newCertificate = new UploadedCertificate({
//       name,
//       issueDate,
//       filePath,
//       uploader
//     });

//     await newCertificate.save();
//     res.status(201).json(newCertificate);
//   } catch (error) {
//     res.status(500).json({ error: 'Error uploading certificate' });
//   }
// });

// Controller to retrieve certificates based on status
uploadedCertificateRouter.get('/uploadedCertificates', async (req, res) => {
  try {
    const { status } = req.query;
    const certificates = await UploadedCertificate.find(status ? { status } : {});
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching certificates' });
  }
});

// Controller to verify a certificate
uploadedCertificateRouter.put('/uploadedCertificates/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await UploadedCertificate.findByIdAndUpdate(
      id,
      { status: 'Verified' },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ error: 'Error verifying certificate' });
  }
});

// Controller to delete a certificate
uploadedCertificateRouter.delete('/uploadedCertificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await UploadedCertificate.findByIdAndDelete(id);

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting certificate' });
  }
});

export default uploadedCertificateRouter;
