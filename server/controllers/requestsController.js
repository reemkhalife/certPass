import Request from "../models/requestModel.js";
import Certificate from "../models/certificateModel.js";
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

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
      console.log(requests);
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
    console.log(request);
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
        fileUrl = 'http://example.com/default-certificate.pdf', // Default value
      } = request.certificateData || {};
      if (!name || !fileUrl) {
        return res.status(400).json({ message: 'Missing required certificate data' });
      }

      const certificate = new Certificate({
        studentId: request.studentId, // Link to the student
        requestId: request._id, // Link to the request
        name,
        description,
        issueDate,
        issuingOrganization,
        fileUrl,
      });  
      try {
        // Save the certificate
        const savedCertificate = await certificate.save();
        // Generate the QR code for the certificate
        await certificate.generateQRCode();
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