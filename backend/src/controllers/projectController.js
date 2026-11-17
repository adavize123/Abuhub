/**
 * Project Controller
 * Handles projects-portfolio CRUD operations
 * (see the architecture blueprint, docs/ARCHITECTURE.md)
 */

import prisma from '../config/prismaClient.js';

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-+/g, '-');

/**
 * Get all projects
 * Query parameters: publicationStatus, projectStatus, serviceId, featured, sort, page, limit
 * Default: only published projects (public-facing use). Admin UI passes
 * publicationStatus explicitly (reads are open, same convention as blog/services —
 * only writes are auth-gated in this codebase).
 */
export const getAllProjects = async (req, res) => {
  try {
    const {
      publicationStatus,
      projectStatus,
      serviceId,
      featured,
      sort = 'desc',
      page = 1,
      limit = 12,
    } = req.query;

    const where = {};
    if (!publicationStatus) {
      where.publicationStatus = 'published';
    } else if (publicationStatus !== 'all') {
      where.publicationStatus = publicationStatus;
    }
    if (projectStatus) where.projectStatus = projectStatus;
    if (featured !== undefined) where.isFeatured = featured === 'true';
    if (serviceId) where.services = { some: { serviceId } };

    const skip = (page - 1) * limit;

    const projects = await prisma.project.findMany({
      where,
      include: { services: { include: { service: true } } },
      orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.project.count({ where });

    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

/**
 * Get single project by ID or slug
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { services: { include: { service: true } } },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

/**
 * Create new project (admin only)
 * Body: title, summary (required), challenge, solution, deliverables, coverImageUrl,
 * projectStatus, publicationStatus, isFeatured, startDate, endDate, verifiedOutcomes,
 * seoTitle, seoDescription, serviceIds (array of existing Service ids)
 */
export const createProject = async (req, res) => {
  try {
    const {
      title,
      summary,
      challenge,
      solution,
      deliverables,
      coverImageUrl,
      projectStatus,
      publicationStatus,
      isFeatured,
      startDate,
      endDate,
      verifiedOutcomes,
      seoTitle,
      seoDescription,
      serviceIds,
    } = req.body;

    if (!title || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Title and summary are required',
      });
    }

    const slug = slugify(title);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        summary,
        challenge,
        solution,
        deliverables,
        coverImageUrl,
        projectStatus: projectStatus || 'concept',
        publicationStatus: publicationStatus || 'draft',
        isFeatured: isFeatured === true || isFeatured === 'true',
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        verifiedOutcomes,
        seoTitle,
        seoDescription,
        services: Array.isArray(serviceIds)
          ? { create: serviceIds.map((serviceId) => ({ serviceId })) }
          : undefined,
      },
      include: { services: { include: { service: true } } },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

/**
 * Update project (admin only)
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      challenge,
      solution,
      deliverables,
      coverImageUrl,
      projectStatus,
      publicationStatus,
      isFeatured,
      startDate,
      endDate,
      verifiedOutcomes,
      seoTitle,
      seoDescription,
      serviceIds,
    } = req.body;

    const existing = await prisma.project.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const updateData = {};
    if (title) {
      updateData.title = title;
      updateData.slug = slugify(title);
    }
    if (summary) updateData.summary = summary;
    if (challenge !== undefined) updateData.challenge = challenge;
    if (solution !== undefined) updateData.solution = solution;
    if (deliverables !== undefined) updateData.deliverables = deliverables;
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl;
    if (projectStatus) updateData.projectStatus = projectStatus;
    if (publicationStatus) updateData.publicationStatus = publicationStatus;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === 'true';
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (verifiedOutcomes !== undefined) updateData.verifiedOutcomes = verifiedOutcomes;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;

    if (Array.isArray(serviceIds)) {
      await prisma.projectService.deleteMany({ where: { projectId: existing.id } });
      updateData.services = { create: serviceIds.map((serviceId) => ({ serviceId })) };
    }

    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: updateData,
      include: { services: { include: { service: true } } },
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

/**
 * Delete project (admin only)
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.project.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await prisma.projectService.deleteMany({ where: { projectId: existing.id } });
    await prisma.project.delete({ where: { id: existing.id } });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
