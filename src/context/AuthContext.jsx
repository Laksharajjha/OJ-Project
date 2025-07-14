// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const isAdmin = parsedUser.username === 'laksh'; // Hardcoded admin
      setUser({ ...parsedUser, isAdmin });
    }
  }, []);

  const loginUser = (userData) => {
    const isAdmin = userData.username === 'laksh'; // Hardcoded admin check
    const updatedUser = { ...userData, isAdmin };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);