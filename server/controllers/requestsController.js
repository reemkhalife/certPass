import Request from "../models/requestModel.js";
import Certificate from "../models/certificateModel.js";
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCertificatePDF, rejectionReasonPDF } from '../utils/pdfGenerator.js';

// Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const { requestType, status } = req.query; // Extract filters from query params
    const filter = {};

    if (requestType) filter.requestType = requestType;
    if (status) filter.status = status;
    const requests = await Request.find(filter)
      .populate({
        path: 'studentId', // Populate the studentId field in Request model
        select: 'userId studentID', // Select userId from Student model to populate user details
        populate: {
          path: 'userId', // Now populate the userId field in Student model
          select: 'name email', // Select the name and email from User model
        }
      });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

// Verify a request
export const verifyRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { status: 'verified', verifiedAt: new Date() },
      { new: true }
    ).populate({
      path: 'studentId',
      select: 'studentID userId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
   });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    // If the request is for a certificate, create a new certificate document
    if (request.requestType === 'certificate') {
      const {
        name,
        description,
        issueDate,
        issuingOrganization,
        // fileUrl = 'http://example.com/default-certificate.pdf', // Default value
      } = request.certificateData || {};
      // if (!name || !fileUrl) {
        if (!name) {
        return res.status(400).json({ message: 'Missing required certificate data' });
      }

      console.log('request verified and creating certificate');

      const certificate = new Certificate({
        studentId: request.studentId, // Link to the student
        requestId: request._id, // Link to the request
        name,
        description,
        issueDate,
        issuingOrganization,
        // fileUrl,
      });  

      console.log('certificate created');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      console.log(__dirname);
      // Create the directory if it doesn't exist
      const uploadDir = path.join(__dirname, '..', 'uploads', 'certificates');
      console.log(uploadDir);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, `${certificate._id}.pdf`);
      console.log(filePath);
      try {
        // Update the fileUrl field with the saved PDF path
        certificate.fileUrl = `/uploads/certificates/${certificate._id}.pdf`;
        console.log(certificate.fileUrl);
        const savedCertificate = await certificate.save();
        console.log(savedCertificate);
         // Generate the QR code for the certificate
        await certificate.generateQRCode();
        await generateCertificatePDF(
          {
            name,
            description,
            issueDate,
            issuingOrganization,
            qrCodeData: certificate.qrCode
          },
          filePath
        );

        const populatedCertificate = await Certificate.findById(
          savedCertificate._id
        ).populate({
          path: 'studentId',
          select: 'studentID userId',
          populate: {
            path: 'userId',
            select: 'name email',
          },
        });
        // Send back the certificate as part of the response
        return res.status(200).json({
          message: 'Request verified and certificate created',
          certificate: populatedCertificate,
        });
      } catch (error) {
        console.error('Error saving certificate:', error);
        return res.status(500).json({ message: 'Error saving certificate' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying request' });
  }
};

// Reject a request
export const rejectRequest = async (req, res) => {
  const { id } = req.params;
  const { rejectionReason } = req.body;
  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { status: 'rejected', rejectionReason, rejectedAt: new Date() },
      { new: true }
    ).populate({
      path: 'studentId',
      select: 'studentID userId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
   });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    console.log(__dirname);
    // Create the directory if it doesn't exist
    const uploadDir = path.join(__dirname, '..', 'uploads', 'rejections');
    console.log(uploadDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, `${request._id}.pdf`);

    const studentName = request?.studentId?.userId?.name
    console.log(studentName);

    await rejectionReasonPDF(
      {
        studentName,
        rejectionReason,
      },
      filePath
    );

    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { $set: { "certificateData.fileUrl": `/uploads/rejections/${id}.pdf` } },
      { new: true }
    ).populate({
      path: 'studentId',
      select: 'studentID userId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
   });

   console.log(updatedRequest.certificateData.fileUrl);

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request' });
  }
};

// Create a new request
export const createRequest = async (req, res) => {
  try {
    // Parse request data
    console.log(req.body);
    const { studentId, requestType, certificateData, customFields } = req.body; // 'data' is the stringified JSON object

    // Validate request type
    if (requestType !== "certificate") {
      return res.status(400).json({ error: "Invalid request type" });
    }

    // Validate issuing organization within certificateData
    if (
      !certificateData.issuingOrganization &&
      !certificateData.customOrganizationName
    ) {
      return res.status(400).json({
        error:
          "Either issuingOrganization or customOrganizationName must be provided.",
      });
    }

    // Prepare request data for database
    const requestData = {
      studentId,
      requestType,
      certificateData,
      customFields,
    };
    
    // Save request to the database
    const newRequest = await Request.create(requestData);

    res.status(201).json({
      message: 'Request submitted successfully!',
      data: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating request.',
      error: error.message,
    });
  }
};

export const getAllRequestsForStudent = async (req, res) => {
  try {
    const {id} = req.params;
    const { status } = req.query;

    // status === 'verified' ? 'rejected' : 'pending';
    let statusRequested;
    if (status === 'verified')
    {
      statusRequested = 'rejected';
    } else {
      statusRequested = 'pending';
    }

    console.log(statusRequested);
    const requestType = 'certificate'
    const filter = {}

    filter.requestType = requestType;
    filter.status = statusRequested;
    filter.studentId = Object(id)
    // console.log(filter);
    const requests = await Request.find(filter)
      .populate({
        path: 'studentId', // Populate the studentId field in Request model
        select: 'userId studentID', // Select userId from Student model to populate user details
        populate: {
          path: 'userId', // Now populate the userId field in Student model
          select: 'name email', // Select the name and email from User model
        }
      });
      // console.log(requests);
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

export const deleteRequest = async(req, res) => {
  const { id } = req.params; // Assuming the request ID is passed as a route parameter

  try {
    // Find and delete the request by ID
    const deletedRequest = await Request.findByIdAndDelete(id);

    // Check if the request was found and deleted
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Request deleted successfully', deletedRequest });
  } catch (error) {
    // Handle errors
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'An error occurred while deleting the request' });
  }
};

export const downloadPDF = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findById(id);
    console.log(request);
    if (!request) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', 'uploads', 'rejections', `${request._id}.pdf`);
    res.download(filePath, `${request.certificateData.name}-rejection-reason.pdf`);
  } catch (error) {
    console.error('Error downloading pdf:', error);
    res.status(500).json({ message: 'Error downloading pdf' });
  }
}