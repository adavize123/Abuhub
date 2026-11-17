/**
 * Contact Controller
 * Handles contact form submissions
 */

import prisma from '../config/prismaClient.js';

/**
 * Submit contact form
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, serviceInterested, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const newContact = await prisma.contact.create({ data: { name, email, phone, serviceInterested: serviceInterested || 'General Inquiry', message } });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. We will get back to you soon.',
      data: newContact,
    });
  } catch (error) {
    console.error('Error submitting contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message,
    });
  }
};

/**
 * Get all contact messages (admin only - currently public)
 */
export const getAllContacts = async (req, res) => {
  try {
    const { isRead = 'all', sort = 'desc', page = 1, limit = 20 } = req.query;

    let where = {};
    if (isRead !== 'all') {
      where.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;

    const contacts = await prisma.contact.findMany({ where, orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' }, skip: parseInt(skip), take: parseInt(limit) });

    const total = await prisma.contact.count({ where });

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

/**
 * Get single contact message
 */
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }
    // Mark as read
    const updated = await prisma.contact.update({ where: { id }, data: { isRead: true } });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Error fetching contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message,
    });
  }
};

/**
 * Mark contact as replied
 */
export const markAsReplied = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }
    const updated = await prisma.contact.update({ where: { id }, data: { isReplied: true } });

    res.status(200).json({
      success: true,
      message: 'Contact marked as replied',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message,
    });
  }
};

/**
 * Delete contact message
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }
    await prisma.contact.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message,
    });
  }
};

export default {
  submitContact,
  getAllContacts,
  getContactById,
  markAsReplied,
  deleteContact,
};
