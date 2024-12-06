import React, {useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// import Dashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import RequestsPage from './components/admin/RequestsPage';
import StudentsPage from './components/admin/StudentsPage';
import Certificates from './components/admin/Certificates';
// import CertificateModel from './components/admin/CertificateModel';
import CustomFieldRequest from './components/admin/CustomFieldRequest';
import CustomFieldForm from './components/admin/CustomFieldForm';
import CertificateList from './components/admin/CertificateList.js';

import StudentForm from './pages/user/StudentForm';
import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import Dashboard from './pages/Dashboard.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or a loading spinner
  }

  // Only allow access if authToken exists
  if (!user) {
    return <Navigate to="/login" replace />;
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
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificate-model" element={<ProtectedRoute><CustomFieldForm /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificate-requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard/document-requests" element={<ProtectedRoute><CertificateList /></ProtectedRoute>} />
          <Route path="/admin/dashboard/students-registered" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
          <Route path="/admin/dashboard/certificates" element={<Certificates/>} />
          <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/dashboard/form" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard/>}/>

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;