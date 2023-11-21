import React, { createContext, useContext, useState } from 'react';

const AuthContexto = createContext();

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

  return (
    <AuthContexto.Provider value={{ token, login, logout }}>
      {children}
    </AuthContexto.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContexto);
};
