const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Building name is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['Prelaid', 'Non Prelaid', 'Both'],
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    contactPerson: {
      type: String,
      required: true,
      trim: true
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    notes: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
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

const Building = mongoose.model('Building', BuildingSchema);

module.exports = Building;