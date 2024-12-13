// server/controllers/authController.js
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration
export const registerUser  = async (req, res) => {
  const { name, email, password, role, studentID } = req.body;

  try {
    const existingUser  = await User.findOne({ email });
    if (existingUser ) {
      return res.status(400).json({ message: 'User  already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password during registration:', hashedPassword);

    const newUser  = new User({ name, email, password: hashedPassword, role });
    await newUser .save();

    console.log('User  registered:', newUser ); // Log the new user

    if (role === 'student') {
      const newStudent = new Student({ userId: newUser ._id, studentID });
      await newStudent.save();
    }

    res.status(201).json({ message: 'User  registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// User Login
export const loginUser  = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('User  found:', user); // Log the user found

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Entered Password:', password);
    console.log('Stored Hashed Password:', user.password);

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const tokenPayload = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    }).status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

export const getCurrentUser = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


