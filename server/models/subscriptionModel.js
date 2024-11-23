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
