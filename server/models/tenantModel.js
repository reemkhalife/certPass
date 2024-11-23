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
