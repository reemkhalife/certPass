import Document from "../models/documentModel.js";

export const uploadDocument = async (req, res) => {
  try {
    const { userId, documentType } = req.body;
    const document = new Document({
      owner: userId,
      documentType: documentType,
      fileUrl: `/uploads/${req.file.filename}`,
      submittedAt: new Date(),
      status: 'pending'
    });
    await document.save();
    res.status(200).json({ message: "Document uploaded successfully", document });
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error });
  }
};

export const reviewDocument = async (req, res) => {};
