import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContexto.js';

const RutaProtegida = ({ path, elemento }) => {
  const { token } = useAuth();

  return token ? (
    <Route path={path} element={elemento} />
  ) : (
    <Navigate to="/login" />
  );
};

export default RutaProtegida;