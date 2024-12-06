import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbconnect.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';

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
