const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema(
  {
    trackerId: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    buildingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true
    },
    address: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    appointmentTime: {
      type: String,
      required: true
    },
    serviceType: {
      type: String,
      enum: ['ACTIVATION', 'MODIFICATION', 'ASSURANCE'],
      required: true
    },
    serviceSubType: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    materialsAssigned: {
      type: Boolean,
      default: false
    },
    materials: [
      {
        materialId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Material'
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    notes: {
      type: String
    },
    completedAt: {
      type: Date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Generate tracker ID before saving
TrackerSchema.pre('save', async function(next) {
  if (!this.isNew) {
    return next();
  }
  
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Find the last tracker record and increment its number
  const lastTracker = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
  
  let sequenceNumber = 1;
  if (lastTracker && lastTracker.trackerId) {
    const lastId = lastTracker.trackerId;
    const lastSequence = parseInt(lastId.slice(-4), 10);
    
    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }
  
  this.trackerId = `TR${year}${month}${sequenceNumber.toString().padStart(4, '0')}`;
  next();
});

const Tracker = mongoose.model('Tracker', TrackerSchema);

module.exports = Tracker;