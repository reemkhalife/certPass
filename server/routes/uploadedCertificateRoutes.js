import express from 'express';
import UploadedCertificate from '../models/uploadedCertificate.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

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

uploadedCertificateRouter.get('/uploadedCertificatesForStudent/:studentId', async (req, res) => {
  const {studentId} = req.params;
  console.log(studentId);
  try {
    const { status } = req.query;
    const certificates = await UploadedCertificate.find({ 
      $and: [
          {uploader: Object(studentId)}, 
          {status: status}
      ]
    });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching certificates' });
  }
});

uploadedCertificateRouter.delete('/uploadedCertificatesForStudent/delete/:id', async (req, res) => {
  const { id } = req.params; // Assuming the request ID is passed as a route parameter

  try {
    // Find and delete the request by ID
    const deletedRequest = await UploadedCertificate.findByIdAndDelete(id);

    // Check if the request was found and deleted
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Certificate deleted successfully', deletedRequest });
  } catch (error) {
    // Handle errors
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'An error occurred while deleting the certificate' });
  }
});

uploadedCertificateRouter.get('/uploadedCertificatesForStudent/:id/download', async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await UploadedCertificate.findById(id);
    console.log(certificate);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log(__dirname);
    const fixedPath = certificate.filePath.replace(/\\/g, '/');
    console.log(fixedPath);
    const filePath = path.join(__dirname, '..', fixedPath);
    res.download(filePath, `${certificate.name}-certificate.pdf`);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Error downloading certificate' });
  }
});

uploadedCertificateRouter.get('/uploadedCertificates/:id', async (req, res) => {
  try {
    const certificate = await UploadedCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }
    res.json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

export default uploadedCertificateRouter;
