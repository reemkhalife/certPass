import express from 'express';
const adminRouter = express.Router();
import { auth } from '../middleware/auth.js';
import {getDashboardStats, reviewDocument} from '../controllers/adminController.js';

adminRouter.get('/dashboard', auth('admin'), getDashboardStats); // Example protected route
adminRouter.put('/reviewDocument/:id', reviewDocument);

export default adminRouter;
