import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('newsapp_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadUserPreferences(userData.username);
      } catch (e) {
        localStorage.removeItem('newsapp_user');
      }
    }
  }, []);

  const loadUserPreferences = async (username) => {
    try {
      const prefs = await ApiService.getUserPreferences(username);
      setPreferences(prefs);
    } catch (e) {
      console.error('Failed to load preferences:', e);
    }
  };

  const login = async (username, email) => {
    setLoading(true);
    setError('');
    
    try {
      // Try to get existing user first
      try {
        const existingUser = await ApiService.getUser(username);
        setUser(existingUser);
        await loadUserPreferences(username);
        localStorage.setItem('newsapp_user', JSON.stringify(existingUser));
        return existingUser;
      } catch (e) {
        // User doesn't exist, create new one
        const newUser = await ApiService.createUser(username, email);
        setUser(newUser);
        setPreferences({
          interests: [],
          preferred_sources: [],
          blocked_sources: [],
          bias_preference: 'all',
          language: 'en',
          country: 'us'
        });
        localStorage.setItem('newsapp_user', JSON.stringify(newUser));
        return newUser;
      }
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPreferences(null);
    localStorage.removeItem('newsapp_user');
  };

  const updatePreferences = async (newPreferences) => {
    if (!user) return;
    
    try {
      const updated = await ApiService.updateUserPreferences(user.username, newPreferences);
      setPreferences(updated);
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  const addToReadingHistory = async (article) => {
    if (!user) return;
    
    try {
      await ApiService.addToReadingHistory(user.username, article);
    } catch (e) {
      console.error('Failed to add to reading history:', e);
    }
  };

  const value = {
    user,
    preferences,
    loading,
    error,
    login,
    logout,
    updatePreferences,
    addToReadingHistory,
    isLoggedIn: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

