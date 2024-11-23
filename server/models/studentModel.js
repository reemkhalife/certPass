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
