// routes/requestRoutes.js
import express from 'express';
import { getAllRequests, verifyRequest, rejectRequest, createRequest, getAllRequestsForStudent, deleteRequest, downloadPDF } from '../controllers/requestsController.js';
import { auth } from '../middleware/auth.js';
import authenticateToken from '../middleware/authenticateToken.js'
import { isAdmin } from '../middleware/isAdmin .js';

const requestRouter = express.Router();

requestRouter.get('/requests', authenticateToken, auth('admin'), getAllRequests); // Fetch all requests
requestRouter.get('/studentsRequests/:id', getAllRequestsForStudent); // Fetch all requests
requestRouter.patch('/requests/:id/verify', authenticateToken, auth('admin'), verifyRequest); // Verify request
requestRouter.patch('/requests/:id/reject', authenticateToken, auth('admin'), rejectRequest); // Reject request with reason
requestRouter.delete('/requests/delete/:id', deleteRequest);
requestRouter.get('/requests/:id/download', downloadPDF);
// requestRouter.post('/requests', createRequest);

export default requestRouter;
