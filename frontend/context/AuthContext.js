/**
 * Auth Context
 * Global authentication state management
 */

'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedTokens = localStorage.getItem('tokens');
      const storedUser = localStorage.getItem('user');

      if (storedTokens && storedUser) {
        try {
          setTokens(JSON.parse(storedTokens));
          const parsedUser = JSON.parse(storedUser);
          // ensure display name exists for older user shapes
          const displayName =
            parsedUser.name ||
            [parsedUser.firstName, parsedUser.lastName].filter(Boolean).join(' ').trim() ||
            parsedUser.email ||
            null;
          setUser({ ...parsedUser, name: displayName });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore auth:', error);
          logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (user, tokens) => {
    // normalize user shape and ensure `name` exists for display
    const displayName = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || null;
    const userWithName = { ...user, name: displayName };
    setUser(userWithName);
    setTokens(tokens);
    setIsAuthenticated(true);

    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(userWithName));
    localStorage.setItem('tokens', JSON.stringify(tokens));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    const displayName = merged.name || [merged.firstName, merged.lastName].filter(Boolean).join(' ').trim() || merged.email || null;
    const mergedWithName = { ...merged, name: displayName };
    setUser(mergedWithName);
    localStorage.setItem('user', JSON.stringify(mergedWithName));
  };

  const updateTokens = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem('tokens', JSON.stringify(newTokens));
  };

  const getAccessToken = () => tokens?.accessToken;

  const isAdmin = () => String(user?.role || '').toLowerCase() === 'admin';

  const isModerator = () => ['admin', 'moderator'].includes(String(user?.role || '').toLowerCase());

  const value = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    updateTokens,
    getAccessToken,
    isAdmin,
    isModerator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export default AuthContext;
