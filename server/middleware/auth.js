import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization denied, no token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId); // Assuming `id` is in the token payload
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;

      // Log the user's role and the allowed roles for debugging
      console.log('User role:', req.user.role);
      console.log('Allowed roles:', roles);

      // Check if the user role is allowed
      if (roles.length && !roles.includes(req.user.role)) {
        console.log(`Access denied: User role ${req.user.role} not in allowed roles`);
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error('Token verification failed:', err);
      res.status(401).json({ message: 'Invalid Token' });
    }
  };
};

// export const auth = () => {
//   console.log('authenticating....');
//   // if (typeof roles === 'string') {
//   //   roles = [roles];
//   // }
//   const roles = ['admin'];

//   return async (req, res, next) => {
//     const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Authorization denied, no token provided' });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.userId); // Assuming `id` is in the token payload
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       req.user = user;

//       // Log the user's role and the allowed roles for debugging
//       console.log('User role:', req.user.role);
//       console.log('Allowed roles:', roles);

//       // Check if the user role is allowed
//       if (roles.length && !roles.includes(req.user.role)) {
//         console.log(`Access denied: User role ${req.user.role} not in allowed roles`);
//         return res.status(403).json({ message: 'Access denied' });
//       }

//       next();
//     } catch (err) {
//       console.error('Token verification failed:', err);
//       res.status(401).json({ message: 'Invalid Token' });
//     }
//   };
// };
