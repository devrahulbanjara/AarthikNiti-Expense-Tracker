import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  return token ? children : <Navigate to="/" />;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  return token ? <Navigate to="/dashboard" /> : children;
};
