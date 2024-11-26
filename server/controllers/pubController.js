// server/controllers/authController.js
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Registration
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('user not found');
      return res.status(200).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('passowrd not match');
      return res.status(200).json({ message: 'Invalid credentials' });
    }

    // Check if the user is a student and retrieve the studentID
    let studentId = null;
    let studentID = null;
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id }).select('_id, studentID'); // Query by userId and select the studentId (_id)
      if (student) {
        studentId = student._id; // Use the student's _id as the studentId
        studentID = student.studentID;
      }
    }

    // Generate token
    const tokenPayload = {
      userId: user._id,
      role: user.role,
      ...(studentId && { studentId: studentId.toString() }), // Include studentId in the payload if applicable
      ...(studentID && { studentID: studentID }), // Include studentId in the payload if applicable
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',      // Prevents CSRF attacks
      maxAge: 60 * 60 * 1000 
    }).status(200).json({
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        ...(studentId && { studentId }), // Include studentId in the response if applicable 
        ...(studentID && { studentID }), // Include studentId in the response if applicable 
      }
    })

  } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
};

export const getCurrentUser = (req, res) => {
  // console.log("Reached /me route, req.user:", req.user);  // Debug logging
  const token = req.cookies.token;  // Retrieve token from cookies
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
    req.user = decoded;  // Manually set req.user

    console.log("User decoded from token:", req.user); // Check decoded user
    res.json({ user: req.user });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};