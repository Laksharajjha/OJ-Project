// src/services/auth.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://codejudgebackend.onrender.com/auth', // adjust if needed
  timeout: 5000,
});

export const register = (data) => API.post('/register', data);
export const login = (data) => API.post('/login', data);
