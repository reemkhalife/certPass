import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const customFieldSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    enum: ['text', 'number', 'date', 'dropdown'], // Types of input
    required: true,
  },
  options: {
    type: [String], // Used for dropdowns
    default: [],
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
});

const CustomField = model('CustomField', customFieldSchema);
export default CustomField;
