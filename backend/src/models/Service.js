/**
 * Service Model
 * Defines the schema for services offered by Abuhub
 */

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const serviceSchema = new mongoose.Schema(
  {
    // Unique identifier
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      primaryKey: true,
    },
    
    // Service name
    serviceName: {
      type: String,
      required: [true, 'Please provide a service name'],
      trim: true,
      unique: true,
    },
    
    // Service description
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    
    // Short description for cards
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    
    // Service icon/image URL
    imageUrl: {
      type: String,
      default: null,
    },
    
    // Cloudinary public ID
    imagePublicId: {
      type: String,
      default: null,
    },
    
    // Service icon (emoji or icon name)
    icon: {
      type: String,
      default: '⚙️',
    },
    
    // Pricing information
    pricing: {
      type: String,
      default: 'Contact for pricing',
    },
    
    // Is service active
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Display order
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster queries
 */
serviceSchema.index({ serviceName: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ displayOrder: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
