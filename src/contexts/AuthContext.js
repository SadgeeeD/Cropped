// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const parsed = saved ? JSON.parse(saved) : null;
    console.log('[AuthContext] Initial user from localStorage:', parsed);
    return parsed;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('[AuthContext] User logged in:', userData);
    console.log('[AuthContext] Saved to localStorage:', localStorage.getItem('user'));
    };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('[AuthContext] User logged out');
  };

  useEffect(() => {
    console.log('[AuthContext] User state changed:', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
