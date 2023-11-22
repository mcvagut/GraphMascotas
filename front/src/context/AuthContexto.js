// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { jwtDecode as decode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const getOrganizationId = () => {
    if (token) {
      const decodedToken = decode(token);
      return decodedToken.organizationId;
    }
    return null;
  };

  const usuario = () => {
    if (token) {
      const decodedToken = decode(token);
      return decodedToken;
    }
    return null;
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, getOrganizationId, usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
