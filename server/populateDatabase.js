import dbConnect from './config/dbconnect.js';
import User from './models/userModel.js';
import Student from './models/studentModel.js';
import Certificate from './models/certificateModel.js';
import Document from './models/documentModel.js';
import Request from './models/requestModel.js';
import Tenant from './models/tenantModel.js';
import mongoose from 'mongoose';
// Function to populate the database
const populateDatabase = async () => {
  await dbConnect();
  try {
    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Certificate.deleteMany({});
    await Document.deleteMany({});
    await Request.deleteMany({});
    await Tenant.deleteMany({});

    // Create and save users
    const users = await User.create([
      { name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'student'},
      { name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'admin' },
      { name: 'Charlie', email: 'charlie@example.com', password: 'password123', role: 'superAdmin' },
    ]);

    // Create and save tenants
    const tenants = await Tenant.create([
      { 
        name: 'Tenant 1', 
        tenantEmail: 'tenant1@example.com', 
        tenantAdminId: users[1]._id,  // Assuming 'Bob' is the admin for Tenant 1
        location: 'New York',  // Replace with actual location data
        contactNumber: '123-456-7890'  // Replace with actual contact number
      },
      { 
        name: 'Tenant 2', 
        tenantEmail: 'tenant2@example.com', 
        tenantAdminId: users[1]._id,  // Assign a valid user ID for tenantAdminId
        location: 'Los Angeles',  // Replace with actual location data
        contactNumber: '987-654-3210'  // Replace with actual contact number
      },
    ]);

    

    // Create and save students
    const students = await Student.create([
      { userId: users[0]._id, studentID: 'S1001' },
      { userId: users[0]._id, studentID: 'S1002' },
    ]);

    // Create and save documents
    const documents = await Document.create([
      { userId: users[0]._id, requestId: new mongoose.Types.ObjectId(), documentType: 'ID', fileUrl: 'http://example.com/id.jpg' },
      { userId: users[1]._id, requestId: new mongoose.Types.ObjectId(), documentType: 'Passport', fileUrl: 'http://example.com/passport.jpg' },
    ]);

    // Create and save certificates
    const certificates = await Certificate.create([
      { studentId: students[0]._id, requestId: new mongoose.Types.ObjectId(), name: 'Certificate 1', issueDate: new Date(), issuingOrganization: tenants[0]._id, fileUrl: 'http://example.com/certificate1.pdf' },
      { studentId: students[1]._id, requestId: new mongoose.Types.ObjectId(), name: 'Certificate 2', issueDate: new Date(), issuingOrganization: tenants[1]._id, fileUrl: 'http://example.com/certificate2.pdf' },
    ]);

    // Create and save requests
    const requests = await Request.create([
      { studentId: students[0]._id, requestType: 'certificate', certificateData: { name: 'Certificate 1', issueDate: new Date() } },
      { studentId: students[1]._id, requestType: 'transcript', documentData: { documentType: 'Transcript', fileUrl: 'http://example.com/transcript.pdf' } },
    ]);

    console.log('Database populated successfully');
  } catch (error) {
    console.error('Error populating the database:', error);
  } 
};

// Run the population script
populateDatabase();
