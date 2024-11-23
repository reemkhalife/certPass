import Student from '../models/studentModel.js';  // Assuming you have a Student model
import Certificate from '../models/certificateModel.js';  // Assuming you have a Certificate model

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalPendingCertificates = await Certificate.countDocuments({ status: 'Pending' });
    const totalVerifiedCertificates = await Certificate.countDocuments({ status: 'Verified' });

    res.json({
      totalStudents,
      totalPendingCertificates,
      totalVerifiedCertificates,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const reviewDocument = async (req, res) => {
  const { status, rejectionReason } = req.body;
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found" });

    document.status = status;
    document.reviewedAt = new Date();
    if (status === 'rejected') document.rejectionReason = rejectionReason;

    await document.save();
    res.status(200).json({ message: "Document reviewed successfully", document });
  } catch (error) {
    res.status(500).json({ message: "Error reviewing document", error });
  }
};