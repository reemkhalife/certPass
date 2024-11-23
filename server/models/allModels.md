userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model, Types } = mongoose;

const ROLE_ENUMS = {
  STUDENT: 'student',
  TENANT: 'tenant',
  ADMIN: 'admin',
  TENANT_ADMIN: 'tenantAdmin',
  SUPER_ADMIN: 'superAdmin'
};

const userSchema = new mongoose.Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: Object.values(ROLE_ENUMS), 
    required: true 
  },
  profilePicture: { 
    type: String, 
    default: null 
  },
  bio: { 
    type: String, 
    default: null 
  },
  location: { 
    type: String, 
    default: null 
  },
  tenantId: {
    type: Types.ObjectId,
    ref: 'Tenant',
    required: function () {
      return this.role === 'tenant' || this.role === 'tenantAdmin';
    }
  },
  managedDocuments: [{
    type: Types.ObjectId,
    ref: 'Document'
  }],
  verifiedCertificates: [{
    type: Types.ObjectId,
    ref: 'Certificate'
  }]
  // documents: [{ type: Types.ObjectId, ref: 'Document' }] // Refers to uploaded ID/Passport and academic transcripts
}, { timestamps: true });

// Virtual field to get only one 'ID' or 'Passport' document
userSchema.virtual('identification', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'owner',
  justOne: true, // Restricts to a single document
  options: { match: { documentType: { $in: ['ID', 'Passport'] } } }
});

// Hash password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
  } catch (error) {
      next(error);
  }
});

// Middleware to populate tenantId on find queries
userSchema.pre(['find', 'findOne', 'findById'], function () {
  this.populate('tenantId');
});

// Middleware to check role-specific requirements before saving
userSchema.pre('save', function (next) {
  if (this.role === ROLE_ENUMS.TENANT_ADMIN && !this.tenantId) {
    return next(new Error('tenantId is required for tenantAdmin role'));
  }
  next();
});

// Role-based access method
userSchema.methods.hasAccessTo = function(resource, action) {
  switch (this.role) {
    case ROLE_ENUMS.SUPER_ADMIN:
      return true; // Full access to everything
    case ROLE_ENUMS.ADMIN:
      return action !== 'manageTenant'; // Admin can access everything except tenant management
    case ROLE_ENUMS.TENANT_ADMIN:
      return resource.tenantId.equals(this.tenantId); // Tenant admin can access their own tenant's resources
    case ROLE_ENUMS.STUDENT:
    case ROLE_ENUMS.TENANT:
      return false; // General users don't have admin-level access
    default:
      return false;
  }
};

const User = mongoose.model('User', userSchema);
export default User;

studentModel.js

// server/models/studentModel.js
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const studentSchema = new mongoose.Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Link to user model
  studentID: { 
    type: String,
    unique: true,
    required: true 
  }, // Required only for students
  certificates: [{ 
    type: Types.ObjectId, 
    ref: 'Certificate' // References the Certificate model
  }]
});

// Virtual field to get only 'Transcript' documents
studentSchema.virtual('transcripts', {
  ref: 'Document',
  localField: 'userId',
  foreignField: 'owner',
  justOne: false, // Allows multiple transcripts
  options: { match: { documentType: 'Transcript' } }
}, { timestamps: true });

// Indexing relationships for performance
studentSchema.index({ certificates: 1 });

const Student = mongoose.model('Student', studentSchema);
export default Student;

requestModel.js

import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const certificateDataSchema = new Schema({
  name: { 
    type: String 
  },
  description: { 
    type: String 
  },
  issueDate: { 
    type: Date 
  },
  expiryDate: { 
    type: Date, 
    default: null 
  },
  issuingOrganization: { 
    type: Types.ObjectId, 
    ref: 'Organization' 
  }
}, { _id: false }); // Disable _id for sub-schema

// Define documentData sub-schema
const documentDataSchema = new Schema({
  documentType: { 
    type: String, 
    enum: ['ID', 'Passport', 'Transcript', 'Other'], 
    required: true 
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
}, { _id: false });

const requestSchema = new Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  studentId: { 
    type: Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  requestType: { 
    type: String, 
    enum: ['certificate', 'transcript'], 
    required: true 
  },
  certificateData: {
    type: certificateDataSchema,
    required: function() { return this.requestType === 'certificate'; }
  },
  documentData: {
    type: documentDataSchema,
    required: function() { return this.requestType === 'transcript'; }
  },
  status: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  },
  rejectionReason: { 
    type: String, 
    default: null 
  },  // Reason if rejected
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  verifiedAt: { 
    type: Date, 
    default: null 
  },
  rejectedAt: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

// Pre-save hook to enforce field validation based on requestType
requestSchema.pre('validate', function(next) {
  try {
    if (this.requestType === 'certificate' && this.documentData) {
      return next(new Error('documentData should not be provided when requestType is certificate.'));
    }
    if (this.requestType === 'transcript' && this.certificateData) {
      return next(new Error('certificateData should not be provided when requestType is transcript.'));
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save hook for request validation
requestSchema.pre('save', function (next) {
  // Logic to validate based on requestType
  next();
});

const Request = model('Request', requestSchema);
export default Request;

certificateModel.js

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
    required: true 
  }, // Organization that issued the certificate
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

documentModel.js

import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const documentSchema = new Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  userId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requestId: { 
    type: Types.ObjectId, 
    ref: 'Request', 
    required: true 
  },
  documentType: { 
    type: String, 
    enum: ['ID', 'Passport', 'Transcript', 'Other'], 
    required: true 
  },
  fileUrl: {
    type: String,
    unique: true,
    required: true,
  }
}, { timestamps: true });

// Pre-save validation to ensure only one identification document (ID or Passport) per user
documentSchema.pre('save', async function(next) {
  if (this.documentType === 'ID' || this.documentType === 'Passport') {
    const existingDocument = await mongoose.models.Document.findOne({
      userId: this.userId,
      documentType: { $in: ['ID', 'Passport'] }
    });

    if (existingDocument && existingDocument._id.toString() !== this._id.toString()) {
      return next(new Error('Each user can only have one identification document (either ID or Passport).'));
    }
  }
  next();
});

// Index for userId and documentType to improve performance
documentSchema.index({ userId: 1, documentType: 1 }, { unique: true });

// Pre-save hook for unique identification document
documentSchema.pre('save', async function (next) {
  if (this.documentType === 'ID' || this.documentType === 'Passport') {
    const existingDocument = await mongoose.models.Document.findOne({
      userId: this.userId,
      documentType: { $in: ['ID', 'Passport'] }
    });
    if (existingDocument) {
      return next(new Error('User already has an identification document'));
    }
  }
  next();
});

const Document = model('Document', documentSchema);
export default Document;

tenantModel.js

import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const tenantSchema = new Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  tenantEmail: { 
    type: String, 
    required: true, 
    unique: true,
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  tenantAdminId: { 
    type: Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userIds: [{ 
    type: Types.ObjectId, 
    ref: 'User' 
  }],
  organizations: [{ 
    type: Types.ObjectId, 
    ref: 'Organization' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  certificatesIssued: [{ 
    type: Types.ObjectId, 
    ref: 'Certificate' 
  }],
}, { timestamps: true });

// Populate settings for Admin and Organization
tenantSchema.pre('find', function () {
  this.populate('tenantAdminId').populate('organizations').populate('certificatesIssued');
});

const Tenant = model('Tenant', tenantSchema);
export default Tenant;

organizationModel.js

// Organization Model (Organization.js)
import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const organizationSchema = new Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  tenant: { 
    type: Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  address: { 
    type: String, 
    default: null 
  },
  website: {
    type: String,
    validate: {
        validator: (v) => /https?:\/\/[^\s]+/.test(v),
        message: props => `${props.value} is not a valid URL!`
    },
},
  email: { 
    type: String, 
    required: true 
  },
  phone: {
    type: String,
    validate: {
        validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
        message: props => `${props.value} is not a valid phone number!`
    },
},
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

const Organization = model('Organization', organizationSchema);
export default Organization;

subscriptionModel.js

import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const subscriptionSchema = new Schema({
  _id: { 
    type: Types.ObjectId, 
    auto: true 
  },
  tenantId: { 
    type: Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  }, // Reference to Tenant model
  expiryDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired'], 
    default: 'active' 
  }
});

// Update status based on expiryDate periodically
subscriptionSchema.pre('save', function (next) {
  if (this.expiryDate < new Date()) {
      this.status = 'expired';
  }
  next();
}, { timestamps: true });

const Subscription = model('Subscription', subscriptionSchema);
export default Subscription;
