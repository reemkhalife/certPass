import dbConnect from './config/dbconnect.js';
import Certificate from './models/certificateModel.js';

const seedCertificates = async () => {
    await dbConnect();

  // Define sample certificates
  const certificates = [
    {
      studentId: "613a1c2f1f2c6a234b6c7f1a", // Replace with an actual User ObjectId
      name: "JavaScript Fundamentals",
      description: "Basic certificate covering JavaScript programming essentials.",
      issueDate: new Date("2022-01-15"),
      issuingOrganization: "CodeAcademy",
      fileUrl: "http://example.com/js_certificate.pdf",
      verificationMethod: "manual",
      status: "pending",
    },
    {
      studentId: "613a1c2f1f2c6a234b6c7f1a", // Replace with an actual User ObjectId
      name: "React Development",
      description: "Intermediate certificate covering React framework basics.",
      issueDate: new Date("2023-03-21"),
      issuingOrganization: "CodeAcademy",
      fileUrl: "http://example.com/react_certificate.pdf",
      verificationMethod: "manual",
      status: "pending",
    },
    // Add more certificate objects as needed
  ];

  try {
    // Clear existing entries (optional)
    await Certificate.deleteMany({});
    console.log("Cleared existing certificates");

    // Insert new certificates
    await Certificate.insertMany(certificates);
    console.log("Sample certificates inserted successfully.");
  } catch (error) {
    console.error("Error seeding certificates:", error);
  }
};

seedCertificates();
