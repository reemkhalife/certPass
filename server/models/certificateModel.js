import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;
import QRCode from 'qrcode';

const certificateSchema = new mongoose.Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  }, // Links the certificate to the student
  requestId: { 
    type: Types.ObjectId, 
    ref: 'Request', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  }, // Certificate name/title
  description: { 
    type: String, 
    default: null 
  }, // Brief description of the certificate
  issueDate: { 
    type: Date, 
    required: true 
  }, // Certificate issue date
  expiryDate: { 
    type: Date, 
    default: null 
  }, // Expiry date, if applicable
  issuingOrganization: { 
    type: Types.ObjectId, 
    ref: 'Organization', 
    // required: true 
  }, // Organization that issued the certificate
  customOrganizationName: { 
    type: String, 
    default: null // Only set if 'Other' is selected
  },
  fileUrl: { 
    type: String, 
    required: true 
  }, // URL to the uploaded certificate file (PDF/image)
  verificationMethod: { 
    type: String, 
    enum: ['manual', 'blockchain'], 
    default: 'manual' 
  }, // Method of verification
  qrCode: { 
    type: String, 
    default: null 
  }, // QR code for verified certificates
}, { timestamps: true });

// Custom validator to ensure at least one of issuingOrganization or customOrganizationName is filled
certificateSchema.path('issuingOrganization').validate(function(value) {
  // If issuingOrganization is not provided, ensure customOrganizationName is provided
  return value || this.customOrganizationName;
}, 'Either issuingOrganization or customOrganizationName must be provided.');

// Custom validator to ensure at least one of issuingOrganization or customOrganizationName is filled
certificateSchema.path('customOrganizationName').validate(function(value) {
  // If customOrganizationName is not provided, ensure issuingOrganization is provided
  return value || this.issuingOrganization;
}, 'Either issuingOrganization or customOrganizationName must be provided.');

// Populate issuingOrganization
certificateSchema.pre('find', function () {
  this.populate('issuingOrganization');
});

// Method to check if the certificate is still valid
certificateSchema.methods.isValid = function() {
  return !this.expiryDate || this.expiryDate > new Date();
};

// Update Certificate Schema
certificateSchema.methods.generateQRCode = async function() {
  try {
    const verificationUrl = `https://yourdomain.com/verify/${this._id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
    this.qrCode = qrCodeDataUrl;
    await this.save();
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Could not generate QR code");
  }
};

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;