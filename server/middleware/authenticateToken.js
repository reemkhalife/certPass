import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Access Denied: Invalid Token' });
    
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };
    next();
  });
};

export default authenticateToken;
