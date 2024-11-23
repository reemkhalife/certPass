import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbconnect.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGODB_URI;

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
