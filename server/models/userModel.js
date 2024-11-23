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
