// client/src/services/authService.js
const API_URL = 'http://localhost:7000/api';

// Store JWT token in localStorage
export const setToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

// Get JWT token from localStorage
export const getToken = () => {
  return localStorage.getItem('jwtToken');
};

// Remove JWT token from localStorage
export const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

// Simulate user login by saving the token
export const login = async (credentials) => {
  // Replace with actual API call for login
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include' // Important for sending cookies
  });
  
  const data = await response.json();

  if (response.ok) {
    // Store the JWT token in localStorage
    setToken(data.token);
    return data;
  } else {
    throw new Error(data.message || 'Login failed');
  }
};

// Simulate user logout by removing the token
export const logout = () => {
  removeToken();
};

// Check if the user is logged in by checking if the token exists
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Returns true if token exists, otherwise false
};
