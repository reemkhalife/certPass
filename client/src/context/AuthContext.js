import React, { createContext, useState, useEffect  } from 'react';
import { login, getToken } from '../services/authService';

const API_URL = 'http://localhost:7000/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:7000/api/auth/me`, { 
          method: 'GET',
          credentials: 'include' 
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null); // Clear user if not authenticated
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false); // Stop loading once fetch completes
      }
    };
  
    fetchCurrentUser();
  }, []);

  const loginHandler = async ({ email, password }) => { // Destructure the object
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Pass the email and password correctly
        credentials: 'include', // Include credentials if needed
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      if (data.user) {
        setUser (data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logoutHandler = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginHandler, logoutHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
