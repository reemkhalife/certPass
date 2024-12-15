import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const uploadedCertificateSchema = new Schema({
    _id: { 
        type: Types.ObjectId, 
        auto: true 
      },
    name: { type: String, required: true },
    issueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejeced'], default: 'Pending' },
    // fileHash: { type: String },
    filePath: { type: String }, // Path to the stored file
    uploader: { type: Types.ObjectId, ref: 'User' }, // Reference to the uploader
    uploadedAt: { type: Date, default: Date.now },
    // blockchainRegistered: { type: Boolean, default: false },
  // transactionHash: { type: String, default: null },
}, { timestamps: true });

const UploadedCertificate = model('UploadedCertificate', uploadedCertificateSchema);
export default UploadedCertificate;
