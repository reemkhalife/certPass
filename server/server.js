import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/dbconnect.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGODB_URI;

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
