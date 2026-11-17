/**
 * API Service Utility
 * Centralized API communication layer using Axios
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Create Axios instance with default configuration
 */
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the access token (when present) so admin-only write/delete routes
// on blog, contact, and services succeed — mirrors lib/api/authApi.js.
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      try {
        const { accessToken } = JSON.parse(tokens);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        // malformed localStorage value — proceed without auth header
      }
    }
  }
  return config;
});

// ==========================================
// BLOG API CALLS
// ==========================================

/**
 * Get all blog posts
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array of blog posts
 */
export const fetchBlogPosts = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/blog', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    throw error;
  }
};

/**
 * Get single blog post by ID or slug
 * @param {string} id - Post ID or slug
 * @returns {Promise<Object>} - Blog post data
 */
export const fetchBlogPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blog/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    throw error;
  }
};

/**
 * Create new blog post
 * @param {FormData} formData - Form data with post details and image
 * @returns {Promise<Object>} - Created post data
 */
export const createBlogPost = async (formData) => {
  try {
    const response = await axiosInstance.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating blog post:', error.message);
    throw error;
  }
};

/**
 * Update blog post
 * @param {string} id - Post ID
 * @param {FormData} formData - Updated post data
 * @returns {Promise<Object>} - Updated post data
 */
export const updateBlogPost = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating blog post:', error.message);
    throw error;
  }
};

/**
 * Delete blog post
 * @param {string} id - Post ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteBlogPost = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog post:', error.message);
    throw error;
  }
};

/**
 * Get blog statistics
 * @returns {Promise<Object>} - Blog statistics
 */
export const fetchBlogStats = async () => {
  try {
    const response = await axiosInstance.get('/blog/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching blog stats:', error.message);
    throw error;
  }
};

// ==========================================
// CONTACT API CALLS
// ==========================================

/**
 * Submit contact form
 * @param {Object} data - Contact form data
 * @returns {Promise<Object>} - Submission confirmation
 */
export const submitContactForm = async (data) => {
  try {
    const response = await axiosInstance.post('/contact', data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    throw error;
  }
};

/**
 * Get all contact messages (admin)
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array of contact messages
 */
export const fetchContactMessages = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/contact', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching contact messages:', error.message);
    throw error;
  }
};

// ==========================================
// SERVICES API CALLS
// ==========================================

/**
 * Get all services
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - Array of services
 */
export const fetchServices = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/services', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching services:', error.message);
    throw error;
  }
};

/**
 * Get all testimonials
 * @returns {Promise<Array>} - Array of testimonials
 */
export const fetchTestimonials = async () => {
  try {
    const response = await axiosInstance.get('/testimonials');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error.message);
    throw error;
  }
};

/**
 * Get single service
 * @param {string} id - Service ID
 * @returns {Promise<Object>} - Service data
 */
export const fetchServiceById = async (id) => {
  try {
    const response = await axiosInstance.get(`/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching service:', error.message);
    throw error;
  }
};

/**
 * Create new service (admin)
 * @param {FormData} formData - Service data
 * @returns {Promise<Object>} - Created service data
 */
export const createService = async (formData) => {
  try {
    const response = await axiosInstance.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error creating service:', error.message);
    throw error;
  }
};

// ==========================================
// PROJECTS API CALLS
// ==========================================

/**
 * Get all projects
 * @param {Object} params - Query parameters (publicationStatus, projectStatus, featured, etc.)
 * @returns {Promise<Array>} - Array of projects
 */
export const fetchProjects = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/projects', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    throw error;
  }
};

/**
 * Get single project by ID or slug
 * @param {string} id - Project ID or slug
 * @returns {Promise<Object>} - Project data
 */
export const fetchProjectById = async (id) => {
  try {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching project:', error.message);
    throw error;
  }
};

/**
 * Create new project (admin)
 * @param {Object} data - Project data
 * @returns {Promise<Object>} - Created project
 */
export const createProject = async (data) => {
  try {
    const response = await axiosInstance.post('/projects', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating project:', error.message);
    throw error;
  }
};

/**
 * Update project (admin)
 * @param {string} id - Project ID
 * @param {Object} data - Updated project data
 * @returns {Promise<Object>} - Updated project
 */
export const updateProject = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/projects/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating project:', error.message);
    throw error;
  }
};

/**
 * Delete project (admin)
 * @param {string} id - Project ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteProject = async (id) => {
  try {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error.message);
    throw error;
  }
};

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Format error message for display
 * @param {Error} error - Axios error object
 * @returns {string} - Formatted error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An error occurred. Please try again.';
};

export default axiosInstance;
