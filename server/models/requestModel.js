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
  },
  customOrganizationName: { 
    type: String, 
    default: null // Only set if 'Other' is selected
  },
  fileUrl: { 
    type: String, 
    // required: true 
  },
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
    // ref: 'Student', 
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
  customFields: [
    {
      field: {
        type: Types.ObjectId,
        ref: 'CustomField',
        required: true,
      },
      label: {
        type: String,
      },
      value: {
        type: Schema.Types.Mixed, // Store the actual value (e.g., string, number)
      },
    },
  ],
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

// Pre-save hook to ensure that at least one of the two fields is filled
requestSchema.pre('validate', function(next) {
  // Check if at least one of issuingOrganization or customOrganizationName is filled
  const { issuingOrganization, customOrganizationName } = this.certificateData;

  if (!issuingOrganization && !customOrganizationName) {
    return next(new Error('Either issuingOrganization or customOrganizationName must be provided.'));
  }

  // Continue validation process if the condition is met
  next();
});

// Pre-save hook for request validation
requestSchema.pre('save', function (next) {
  // Logic to validate based on requestType
  next();
});

const Request = model('Request', requestSchema);
export default Request;
