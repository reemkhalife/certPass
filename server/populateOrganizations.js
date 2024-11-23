import dbConnect from './config/dbconnect.js';
import Organization from './models/organizationModel.js';  // Adjust path if needed
import mongoose from 'mongoose';

const populateOrganizations = async () => {
  await dbConnect();
    
  try {
    // Sample organization data
    const organizations = [
        {
          name: 'Global Tech Solutions',
          tenant: new mongoose.Types.ObjectId(), // Replace with actual tenant ID if applicable
          address: '123 Tech Park, Silicon Valley, CA',
          website: 'https://www.globaltech.com',
          email: 'info@globaltech.com',
          phone: '+15555555555',
        },
        {
          name: 'EduCert Services',
          tenant: '6729695f72f5fd571b411ccb', // Replace with actual tenant ID if applicable
          address: '45 Education Blvd, New York, NY',
          website: 'https://www.educert.com',
          email: 'contact@educert.com',
          phone: '+14444444444',
        },
        {
          name: 'HealthCertify Org',
          tenant: '6729695f72f5fd571b411ccc', // Replace with actual tenant ID if applicable
          address: '78 Wellness Ave, Los Angeles, CA',
          website: 'https://www.healthcertify.org',
          email: 'support@healthcertify.org',
          phone: '+13333333333',
        },
        {
          name: 'CertifyMe Inc',
          tenant: '6729695f72f5fd571b411ccc', // Replace with actual tenant ID if applicable
          address: '92 Business Plaza, Chicago, IL',
          website: 'https://www.certifyme.com',
          email: 'help@certifyme.com',
          phone: '+12222222222',
        },
      ];
  
      // Insert sample data into the database
      const result = await Organization.insertMany(organizations);
      console.log('Organizations added successfully:', result);
  
    } catch (error) {
      console.error('Error populating organizations:', error);
    }
};

populateOrganizations();