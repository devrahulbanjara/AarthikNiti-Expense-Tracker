import { fetchProtectedData } from "./api";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const API_URL = `${BACKEND_URL}/auth`;

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const fetchProtectedData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
