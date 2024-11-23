import bcrypt from 'bcryptjs';
import dbConnect from './config/dbconnect.js';
import User from './models/userModel.js';  // Adjust path if needed

const createUsers = async () => {
  await dbConnect();
    
  try {
    const salt = await bcrypt.genSalt(10);

    // Admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', salt),
      role: 'admin',
    });

    // Regular user
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: await bcrypt.hash('userpassword', salt),
      role: 'user',
    });

    await admin.save();
    await regularUser.save();
    console.log('Users added successfully');
  } catch (error) {
    console.error('Error creating users:', error);
  } 
};

createUsers();