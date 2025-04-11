const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema(
  {
    sapCode: {
      type: String,
      required: [true, 'SAP code is required'],
      trim: true,
      unique: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    stockKeepingUnit: {
      type: Number,
      default: 0
    },
    minimumStock: {
      type: Number,
      default: 10
    },
    unitPrice: {
      type: Number,
      default: 0
    },
    materialType: {
      type: String,
      enum: ['EQUIPMENT', 'CONSUMABLE', 'ACCESSORY', 'TOOL', 'OTHER'],
      default: 'EQUIPMENT'
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

const Material = mongoose.model('Material', MaterialSchema);

module.exports = Material;