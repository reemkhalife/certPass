// server/routes/authRoutes.js
import express from 'express';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../controllers/pubController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const pubRouter = express.Router();

pubRouter.post('/login', loginUser);
pubRouter.post('/register', registerUser);
pubRouter.post('/logout', logoutUser);
pubRouter.get('/me', authenticateToken, getCurrentUser); 

export default pubRouter;
