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

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
