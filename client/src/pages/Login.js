import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginHandler, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const handleSubmit = async (e) => {
    console.log('logging in');
    e.preventDefault();
    const success = await loginHandler(email, password);
    if (success) {
      setIsLoggedIn(true);
    }
    if (!success) {
      alert('Invalid credentials. Please try again.');
      setEmail('');
      setPassword('');
    }
  };

  useEffect(() => {
    // Navigate when user state updates and isLoggedIn is true
    if (isLoggedIn && user) {
      if (user.role === 'student') {
        navigate('/user/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'superAdmin') {
        navigate('/superadmin/dashboard');
      }
      setIsLoggedIn(false); // Reset login state
    }
  }, [isLoggedIn, user, navigate]); // Add user and navigate as dependencies

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;