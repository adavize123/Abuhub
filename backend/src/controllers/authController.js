/**
 * Auth Controller
 * Authentication endpoints: signup, login, logout, verify, refresh
 */

import prisma from '../config/prismaClient.js';
import { generateTokens, verifyToken } from '../utils/jwtUtils.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// SIGNUP: Register new user
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password and create new user
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        firstName,
        lastName,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          bio: user.bio,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens: { accessToken, refreshToken },
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// LOGIN: Authenticate user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user with password
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to too many failed login attempts. Try again later.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // increment login attempts
      const attempts = (user.loginAttempts || 0) + 1;
      const updateData = { loginAttempts: attempts };
      if (attempts >= 5) {
        updateData.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      }
      await prisma.user.update({ where: { id: user.id }, data: updateData });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Reset login attempts and update last login
    await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockUntil: null, lastLogin: new Date() } });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          bio: user.bio,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        tokens: { accessToken, refreshToken },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// LOGOUT: Invalidate refresh token (if using blacklist)
export const logout = async (req, res) => {
  try {
    // In production, you'd add token to blacklist
    // For now, client handles deletion

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// REFRESH TOKEN: Generate new access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const { valid, decoded, error } = verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
        error,
      });
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account inactive',
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: { accessToken, refreshToken: newRefreshToken },
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: error.message,
    });
  }
};

// GET PROFILE: Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          bio: user.bio,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// UPDATE PROFILE: Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio } = req.body;
    const userId = req.userId;

    // Only allow certain fields to be updated
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;

    const user = await prisma.user.update({ where: { id: userId }, data: updateData });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
          bio: user.bio,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// CHANGE PASSWORD: Change user password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new passwords are required',
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

// VERIFY EMAIL: Send verification email (placeholder)
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({ where: { id: userId }, data: { emailVerificationToken: verificationToken, emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) } });

    // TODO: Send verification email
    // sendVerificationEmail(user.email, verificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification email',
      error: error.message,
    });
  }
};

// CONFIRM EMAIL: Confirm email verification
export const confirmEmailVerification = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required',
      });
    }

    const user = await prisma.user.findFirst({ where: { emailVerificationToken: token, emailVerificationExpires: { gt: new Date() } } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true, emailVerificationToken: null, emailVerificationExpires: null } });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Confirm email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message,
    });
  }
};

