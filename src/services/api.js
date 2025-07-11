import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9090/', // Your backend API
  timeout: 5000,
});

// 🧩 Problem Services
export const fetchProblems = () => API.get('/problems');
export const fetchProblemById = (id) => API.get(`/problems/${id}`);

// 🧠 Code Judging
export const runCode = (data) => API.post('/judge/run', data);

// 📩 Submissions
export const fetchSubmissions = () => API.get('/submissions');
export const submitSolution = (data) => API.post('/submissions', data);


