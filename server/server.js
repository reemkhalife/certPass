import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbconnect.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import Organization from './models/organizationModel.js';

// Import Routes
import studentRoutes from './routes/studentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import certificateRouter from './routes/certificateRoutes.js';
import documentRoutes from './routes/documentRoutes.js'
import pubRouter from './routes/pubRoutes.js';  // Adjust path as needed
import authRouter from './routes/authRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import requestRouter from './routes/requestsRoutes.js';
import organizationRouter from './routes/organizationRoutes.js';
import customFieldRouter from './routes/customFieldRoutes.js';
import Request from './models/requestModel.js';
import uploadedCertificateRouter from './routes/uploadedCertificateRoutes.js'
import UploadedCertificate from './models/uploadedCertificate.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGODB_URI;

// Set up Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/requests'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Add a timestamp to avoid name collisions
  },
});

const upload = multer({ storage });

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(
    {
        origin: 'http://localhost:3000', // Your frontend URL
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allows cookies and other credentials
    }
));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Use Routes
app.use('/api/students', studentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', certificateRouter);
app.use('/documents', documentRoutes);
app.use('/api/auth', pubRouter);  // Base path for auth routes
app.use('/api', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', requestRouter);
app.use("/api", organizationRouter);
app.use("/api", customFieldRouter);
app.use("/api", uploadedCertificateRouter);

app.get('/api/user/profile', (req, res) => {
  // Fetch user profile data from the database
});

app.post('/api/user/profile', (req, res) => {
  // Update user profile data in the database
});

// Post route to handle both file and data
app.post('/api/requests', upload.single('file'), async (req, res) => {
  try {
    // Retrieve data and file from the request
    const { data } = req.body; // 'data' contains the JSON stringified object
    const { studentId, requestType, certificateData, customFields } = JSON.parse(data);
    const file = req.file; // 'file' will contain the uploaded file object

    // You can now access the file and save its information in the database
    if (file) {
      certificateData.fileUrl = file.path; // Add the file's path as fileUrl
      // Save file info (like file path or filename) to the database if needed
    }

    // Save the rest of the certificate request data
    const newRequest = await Request.create({
      studentId,
      requestType,
      certificateData,
      customFields,
    });

    res.status(201).json({
      message: "Certificate request created successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating certificate request:", error);
    res.status(500).json({ error: "An error occurred while creating the request" });
  }
});

// Set up storage engine
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/uploadedCertificates'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Initialize multer with storage configuration
const certificateUpload = multer({ certificateStorage });

// Controller to handle certificate upload
app.post('/api/uploadedCertificates', upload.single('file'), async (req, res) => {
  const { data } = req.body; // 'data' contains the JSON stringified object
  const { name, issueDate, uploader } = JSON.parse(data);
  console.log(name)
  console.log(req.file.path)
  try {
    const { data } = req.body; // 'data' contains the JSON stringified object
    const { name, issueDate, uploader } = JSON.parse(data);
    const filePath = req.file.path;

    const newCertificate = new UploadedCertificate({
      name,
      issueDate,
      filePath,
      uploader
    });
    console.log(newCertificate)

    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (error) {
    res.status(500).json({ error: 'Error uploading certificate' });
  }
});

app.post('/api/uploadedCertificates/:id', upload.single('file'),async (req, res) => {
  try {
    const { data } = req.body;
    const { name, issueDate, uploader } = JSON.parse(data);
    const filePath = req.file.path;

    const certificate = await UploadedCertificate.findById(req.params.id)
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    const oldFileFixedPath = certificate.filePath.replace(/\\/g, '/');
    // 1734303918454-1732572987060-Class Diagram.png
    console.log(certificate.filePath);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const oldFilePath = path.join(__dirname, oldFileFixedPath);
    console.log(oldFilePath);
    // Delete the old file from the filesystem if it exists
    console.log(fs.existsSync(oldFilePath));
    if (oldFilePath && fs.existsSync(oldFilePath)) {
      console.log('file found');
      // fs.unlinkSync(oldFilePath);
      fs.rm(oldFilePath, { force: true }, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${err.message}`);
        } else {
          console.log(`Deleted file: ${oldFilePath}`);
        }
      });
      
      console.log(`Deleted old file: ${oldFilePath}`);
    }

    // Validate and update the certificate
    const newCertificate = await UploadedCertificate.findByIdAndUpdate(
      req.params.id,
      { name, issueDate, filePath },
      { new: true }
    );

    
    res.json(newCertificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Connect to MongoDB
dbConnect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error);
    });

export default app;
