/**
 * Database Configuration
 * Handles MongoDB connection setup and error handling
 */

import mongoose from 'mongoose';
import prisma from './prismaClient.js';

/**
 * Connect to MongoDB database
 * @async
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // If DATABASE_URL is provided, assume Prisma + MySQL is intended
    if (process.env.DATABASE_URL) {
      await prisma.$connect();
      console.log('✓ Connected to SQL database via Prisma');
      return prisma;
    }

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/abuhub';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`✗ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for graceful shutdown and testing
 * @async
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    if (process.env.DATABASE_URL) {
      await prisma.$disconnect();
      console.log('✓ Prisma disconnected');
      return;
    }

    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');
  } catch (error) {
    console.error(`✗ Database Disconnection Error: ${error.message}`);
    process.exit(1);
  }
};

export default { connectDB, disconnectDB };
