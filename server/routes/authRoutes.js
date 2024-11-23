// routes.js
import express from 'express';
import authenticateToken from '../middleware/authenticateToken.js';
import { auth } from '../middleware/auth.js';

const authRouter = express.Router();

// Route accessible to only 'user' role
authRouter.get('/user/dashboard', 
  authenticateToken, 
  auth('student'), 
  (req, res) => {
    res.send('User Dashboard');
});

// Route accessible to only 'admin' role
authRouter.get('/admin/dashboard', 
  authenticateToken, 
  auth('admin'), 
  (req, res) => {
    res.send('Admin Dashboard');
});

// Route accessible to only 'super admin' role
authRouter.get('/superadmin/dashboard', 
  authenticateToken, 
  auth('superAdmin'), 
  (req, res) => {
    res.send('Super Admin Dashboard');
});

export default authRouter;

// const express = require('express');
// const router = express.Router();
// const { authenticateUser } = require('../middleware/auth');
// const { checkPermission } = require('../middleware/permissions');

// // Apply authentication to all routes
// router.use(authenticateUser);

// // Route to manage users (only accessible by admins)
// router.get('/manage-users', checkPermission('canManageUsers'), (req, res) => {
//   res.json({ message: 'Access granted to manage users' });
// });

// // Route to verify documents
// router.get('/verify-documents', checkPermission('canVerifyDocuments'), (req, res) => {
//   res.json({ message: 'Access granted to verify documents' });
// });

// // Route to manage requests
// router.get('/manage-requests', checkPermission('canManageRequests'), (req, res) => {
//   res.json({ message: 'Access granted to manage requests' });
// });

// // Route to view reports
// router.get('/view-reports', checkPermission('canViewReports'), (req, res) => {
//   res.json({ message: 'Access granted to view reports' });
// });

// // Route to configure settings
// router.get('/configure-settings', checkPermission('canConfigureSettings'), (req, res) => {
//   res.json({ message: 'Access granted to configure settings' });
// });

// module.exports = router;
