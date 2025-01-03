import Certificate from "../models/certificateModel.js";
import Organization from "../models/organizationModel.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';

export const downloadCertificate = async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findById(id);
    console.log(certificate);
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', 'uploads', 'certificates', `${certificate._id}.pdf`);
    res.download(filePath, `${certificate.name}-certificate.pdf`);
  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Error downloading certificate' });
  }
};

export const getPendingCertificates = async (req, res) => {
  try {
    const pendingCertificates = await Certificate.find({ status: 'pending' });
    res.status(200).json(pendingCertificates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending certificates", error });
  }
};

export const updateCertificateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  try {
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    certificate.status = status;
    if (status === 'Rejected') {
      certificate.rejectionReason = rejectionReason || 'Not specified';
      certificate.rejectedAt = new Date();
    } else if (status === 'Verified') {
      certificate.verifiedAt = new Date();
    }

    await certificate.save();
    res.status(200).json({ message: "Certificate status updated successfully", certificate });
  } catch (error) {
    console.error("Error updating certificate status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Example usage in verification process
export async function verifyCertificate(certificateId) {
  try {
    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    certificate.status = "verified";
    certificate.verifiedAt = new Date();
    
    // Generate QR code for verified certificate
    await certificate.generateQRCode();
    return certificate;
    // res.status(200).json({ message: "Document reviewed successfully", document });

  }  catch (error) {
    res.status(500).json({ message: "Error fetching certificate", error });
  }
};

// Query a certificate with the full organization details
// const certificate = await Certificate.findById(req.params.id).populate('issuingOrganization');
// console.log(certificate.issuingOrganization.name); // Access organization name directly

export const getCertificates = async (req, res) => {
  try {
    const allCertificates = await Certificate.find().populate('studentId', 'name email').populate('issuingOrganization', 'name');;
    res.json(allCertificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getCertificate = async (req, res) => {
  const { id } = req.params;

  try {
    const certificate = await Certificate.findById(id).populate('studentId', 'name email').populate('issuingOrganization', 'name');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.status(200).json(certificate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching certificate' });
  }
};

export const getCertificatesForStudent = async (req, res) => {
  const {studentId} = req.params;
  try {
    const allCertificates = await Certificate.find({studentId: studentId}).populate('studentId', 'name email').populate('issuingOrganization', 'name');;
    res.json(allCertificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const deleteCertificate = async (req,res) => {
  const { id } = req.params; // Assuming the request ID is passed as a route parameter

  try {
    // Find and delete the request by ID
    const deletedRequest = await Certificate.findByIdAndDelete(id);

    // Check if the request was found and deleted
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Return a success response
    res.status(200).json({ message: 'Certificate deleted successfully', deletedRequest });
  } catch (error) {
    // Handle errors
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'An error occurred while deleting the certificate' });
  }
};