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
