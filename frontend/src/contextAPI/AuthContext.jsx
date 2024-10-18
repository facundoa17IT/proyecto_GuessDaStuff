import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'ROLE_GUESS');

  // Sync role with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  // Listen for changes to localStorage (for other tabs)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'role') {
        setRole(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useRole = () => useContext(AuthContext);
