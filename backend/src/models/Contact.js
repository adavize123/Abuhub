/**
 * Contact Message Model
 * Stores contact form submissions from users
 */

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const contactSchema = new mongoose.Schema(
  {
    // Unique identifier
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      primaryKey: true,
    },
    
    // Sender's name
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    
    // Sender's email
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    
    // Sender's phone number
    phone: {
      type: String,
      default: null,
    },
    
    // Service interested in
    serviceInterested: {
      type: String,
      enum: [
        'Web Development',
        'App Development',
        'Data Analysis',
        'AI Training',
        'Business Support',
        'UI/UX Design',
        'Digital Marketing',
        'General Inquiry',
      ],
      default: 'General Inquiry',
    },
    
    // Main message content
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
    
    // Mark if message has been read
    isRead: {
      type: Boolean,
      default: false,
    },
    
    // Mark if reply has been sent
    isReplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for faster queries
 */
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isRead: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
