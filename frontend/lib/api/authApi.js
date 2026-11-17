/**
 * Auth API Client
 * Functions for authentication API calls
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const createAuthClient = () => {
  const client = axios.create({
    baseURL: `${API_URL}/api/auth`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  client.interceptors.request.use((config) => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      const { accessToken } = JSON.parse(tokens);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  return client;
};

const authClient = createAuthClient();

export const authApi = {
  // Sign up new user
  signup: async (email, password, firstName, lastName) => {
    try {
      const response = await authClient.post('/signup', {
        email,
        password,
        firstName,
        lastName,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await authClient.post('/login', {
        email,
        password,
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await authClient.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await authClient.post('/refresh-token', {
        refreshToken,
      });
      return response.data.data.tokens;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await authClient.get('/profile');
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (firstName, lastName, bio) => {
    try {
      const response = await authClient.put('/profile', {
        firstName,
        lastName,
        bio,
      });
      return response.data.data.user;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authClient.post('/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Send verification email
  verifyEmail: async () => {
    try {
      const response = await authClient.post('/verify-email');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Confirm email verification
  confirmEmailVerification: async (token) => {
    try {
      const response = await authClient.post('/confirm-email', {
        token,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authApi;
