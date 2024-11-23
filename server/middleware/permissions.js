// Middleware for role-based access control
export function requireRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
}

// const checkPermission = (permission) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.hasPermission(permission)) {
//       return res.status(403).json({ error: 'Access denied: insufficient permissions' });
//     }
//     next();
//   };
// };

// export default checkPermission;
