/**
 * Testimonial Controller
 * Provides CRUD endpoints for testimonials using raw SQL to be resilient
 * to prisma client generation state. Creates table if missing.
 */

import prisma from '../config/prismaClient.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwtUtils.js';
import { sendNewTestimonialNotification } from '../utils/mailer.js';

const ensureTable = async () => {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "Testimonial" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "role" TEXT,
      "quote" TEXT NOT NULL,
      "avatarUrl" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Testimonial_isPublished_idx" ON "Testimonial"("isPublished");`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");`;
};

export const getAllTestimonials = async (req, res) => {
  try {
    await ensureTable();
    const rows = await prisma.$queryRaw`SELECT * FROM "Testimonial" WHERE "isPublished" = true ORDER BY "createdAt" DESC`;
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
};

// Admin: get all testimonials (including unpublished)
export const getAllTestimonialsAdmin = async (req, res) => {
  try {
    await ensureTable();
    const rows = await prisma.$queryRaw`SELECT * FROM "Testimonial" ORDER BY "createdAt" DESC`;
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Get admin testimonials error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials', error: error.message });
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    await ensureTable();
    const rows = await prisma.$queryRaw`SELECT * FROM "Testimonial" WHERE "id" = ${id} LIMIT 1`;
    const item = rows && rows[0];
    if (!item) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Get testimonial by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonial', error: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { name, role, quote, avatarUrl, isPublished } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ success: false, message: 'Name and quote are required' });
    }

    await ensureTable();
    const id = crypto.randomUUID();
    const published = isPublished === undefined ? false : !!isPublished;

    await prisma.$executeRaw`
      INSERT INTO "Testimonial" ("id","name","role","quote","avatarUrl","isPublished","createdAt","updatedAt")
      VALUES (${id}, ${name}, ${role}, ${quote}, ${avatarUrl}, ${published}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const rows = await prisma.$queryRaw`SELECT * FROM "Testimonial" WHERE "id" = ${id} LIMIT 1`;
    // Notify admins if the submission is unpublished (moderation required)
    try {
      if (!published) await sendNewTestimonialNotification(rows[0]);
    } catch (err) {
      console.error('Notification error (ignored):', err.message || err);
    }

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to create testimonial', error: error.message });
  }
};

// Handle email action link: token contains { testimonialId, action }
export const handleAction = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('Missing token');

    const actionSecret = process.env.EMAIL_ACTION_SECRET || process.env.JWT_SECRET || 'dev-secret';
    let payload;
    try {
      payload = await new Promise((resolve, reject) => {
        jwt.verify(token, actionSecret, (err, decoded) => (err ? reject(err) : resolve(decoded)));
      });
    } catch (err) {
      return res.status(400).send('Invalid or expired token');
    }

    const { testimonialId, action } = payload;
    if (!testimonialId || !action) return res.status(400).send('Invalid token payload');

    // Optional: require admin auth in addition to the action token
    // Set EMAIL_ACTION_REQUIRE_ADMIN=true to enforce that a valid access token belonging to an admin/moderator is present
    if (String(process.env.EMAIL_ACTION_REQUIRE_ADMIN || '').toLowerCase() === 'true') {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('Admin authorization required');
      const accessToken = authHeader.split(' ')[1];
      const { valid, decoded, error } = verifyToken(accessToken);
      if (!valid) return res.status(401).send('Invalid admin token');
      const adminUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!adminUser || !['admin', 'moderator'].includes(String(adminUser.role || '').toLowerCase())) return res.status(403).send('Insufficient permissions');
    }

    await ensureTable();
    if (action === 'publish') {
      await prisma.$executeRaw`UPDATE "Testimonial" SET "isPublished" = true, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${testimonialId}`;
    } else if (action === 'unpublish') {
      await prisma.$executeRaw`UPDATE "Testimonial" SET "isPublished" = false, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ${testimonialId}`;
    } else if (action === 'delete') {
      await prisma.$executeRaw`DELETE FROM "Testimonial" WHERE "id" = ${testimonialId}`;
    } else {
      return res.status(400).send('Unknown action');
    }

    const wantsJson = String(req.query?.format || '').toLowerCase() === 'json' || String(req.headers.accept || '').includes('application/json');
    if (wantsJson) {
      return res.status(200).json({ success: true, message: `Action '${action}' completed successfully` });
    }

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontend}/admin/testimonials?notif=action_success`);
  } catch (err) {
    console.error('Handle action error:', err);
    const wantsJson = String(req.query?.format || '').toLowerCase() === 'json' || String(req.headers.accept || '').includes('application/json');
    if (wantsJson) {
      return res.status(500).json({ success: false, message: 'Action failed' });
    }
    return res.status(500).send('Action failed');
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, quote, avatarUrl, isPublished } = req.body;
    await ensureTable();

    const existing = await prisma.$queryRaw`SELECT * FROM "Testimonial" WHERE "id" = ${id} LIMIT 1`;
    if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    await prisma.$executeRaw`
      UPDATE "Testimonial" SET
        "name" = COALESCE(${name}, "name"),
        "role" = COALESCE(${role}, "role"),
        "quote" = COALESCE(${quote}, "quote"),
        "avatarUrl" = COALESCE(${avatarUrl}, "avatarUrl"),
        "isPublished" = COALESCE(${isPublished}, "isPublished"),
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
    `;

    const rows = await prisma.$queryRaw`SELECT * FROM "Testimonial" WHERE "id" = ${id} LIMIT 1`;
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to update testimonial', error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await ensureTable();
    await prisma.$executeRaw`DELETE FROM "Testimonial" WHERE "id" = ${id}`;
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete testimonial', error: error.message });
  }
};
