import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// import Dashboard from './pages/admin/Dashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import RequestsPage from './components/admin/RequestsPage';
import StudentsPage from './components/admin/StudentsPage';
import Certificates from './components/admin/Certificates';
import CustomFieldForm from './components/admin/CustomFieldForm';
import CertificateList from './components/admin/CertificateList.js';

import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import Dashboard from './pages/Dashboard.js';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or a loading spinner
  }

  // Only allow access if authToken exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

    // Check if user's role is included in allowedRoles
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />; // Redirect to home or a "not authorized" page
    }
  

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<SignIn />} />

          {/* Private Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificate-model" element={<ProtectedRoute allowedRoles={['admin']}><CustomFieldForm /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificate-requests" element={<ProtectedRoute allowedRoles={['admin']}><RequestsPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard/document-requests" element={<ProtectedRoute allowedRoles={['admin']}><CertificateList /></ProtectedRoute>} />
          <Route path="/admin/dashboard/students-registered" element={<ProtectedRoute allowedRoles={['admin']}><StudentsPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificates" element={<Certificates/>} />
          <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['student']}><Dashboard /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
         

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;