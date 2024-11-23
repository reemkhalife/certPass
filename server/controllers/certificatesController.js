import Certificate from "../models/certificateModel.js";
import Organization from "../models/organizationModel.js";

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