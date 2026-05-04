// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ roles = [], children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    // pas connecté → renvoyer vers login avec le 1er rôle attendu si possible
    const fallback = roles[0] || 'admin';
    return <Navigate to={`/login?role=${fallback}`} replace />;
  }

  if (roles.length && !roles.includes(role)) {
    // connecté mais rôle non autorisé → renvoyer vers son espace
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
}
