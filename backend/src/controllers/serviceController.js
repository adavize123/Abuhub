/**
 * Service Controller
 * Handles service management
 */

import prisma from '../config/prismaClient.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Get all services
 */
export const getAllServices = async (req, res) => {
  try {
    // req.query values are strings when provided via query string.
    // Default to the string 'true' so the comparison below works as intended.
    const { isActive = 'true', sort = 'asc' } = req.query;

    const where = {};
    if (isActive !== 'all') {
      where.isActive = isActive === 'true';
    }

    const services = await prisma.service.findMany({ where, orderBy: { displayOrder: sort === 'asc' ? 'asc' : 'desc' } });

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    });
  }
};

/**
 * Get single service
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching service:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message,
    });
  }
};

/**
 * Create new service
 */
export const createService = async (req, res) => {
  try {
    const { serviceName, description, shortDescription, icon, pricing } = req.body;

    if (!serviceName || !description) {
      return res.status(400).json({
        success: false,
        message: 'Service name and description are required',
      });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.path, 'abuhub/services');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError.message);
      }
    }

    const newService = await prisma.service.create({ data: { serviceName, description, shortDescription, icon: icon || '⚙️', pricing: pricing || 'Contact for pricing', imageUrl, imagePublicId } });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService,
    });
  } catch (error) {
    console.error('Error creating service:', error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    });
  }
};

/**
 * Update service
 */
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, description, shortDescription, icon, pricing, isActive, displayOrder } = req.body;

    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (serviceName) service.serviceName = serviceName;
    if (description) service.description = description;
    if (shortDescription) service.shortDescription = shortDescription;
    if (icon) service.icon = icon;
    if (pricing) service.pricing = pricing;
    if (isActive !== undefined) service.isActive = isActive;
    if (displayOrder !== undefined) service.displayOrder = displayOrder;

    if (req.file) {
      try {
        if (service.imagePublicId) {
          await deleteImage(service.imagePublicId);
        }

        const uploadResult = await uploadImage(req.file.path, 'abuhub/services');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError.message);
      }
    }
    const updateData = {};
    if (serviceName) updateData.serviceName = serviceName;
    if (description) updateData.description = description;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (icon) updateData.icon = icon;
    if (pricing) updateData.pricing = pricing;
    if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imagePublicId !== undefined) updateData.imagePublicId = imagePublicId;

    const updated = await prisma.service.update({ where: { id: service.id }, data: updateData });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating service:', error.message);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    });
  }
};

/**
 * Delete service
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (service.imagePublicId) {
      try {
        await deleteImage(service.imagePublicId);
      } catch (deleteError) {
        console.error('Image deletion error:', deleteError.message);
      }
    }

    await prisma.service.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    });
  }
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
