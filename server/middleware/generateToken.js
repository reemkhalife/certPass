import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },  // Including the user ID in the token payload
    process.env.JWT_SECRET,
    { expiresIn: '1h' }  // Set token expiration as needed
  );
};
