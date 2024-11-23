import bcrypt from 'bcryptjs';
import dbConnect from './config/dbconnect.js';
import Student from './models/studentModel.js';  // Adjust path if needed

const createStudents = async () => {
  await dbConnect();
    
  try {
    const salt = await bcrypt.genSalt(10);

    // Student 1 
    const student1 = new Student({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
        role: 'student',
        studentID: 'S1234',
        profilePicture: 'http://example.com/alice.jpg',
        bio: 'Biology major with a passion for genetics',
        location: 'Boston',
        certificates: [], // Add certificate ObjectIds if available
      });

    // Student 2
    const student2 = new Student({
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password456',
        role: 'student',
        studentID: 'S5678',
        profilePicture: 'http://example.com/bob.jpg',
        bio: 'Engineering student focused on mechanical systems',
        location: 'New York',
        certificates: [],
      });

    await student1.save();
    await student2.save();
    console.log('Students added successfully');
  } catch (error) {
    console.error('Error creating students:', error);
  } 
};

createStudents();