import axios from 'axios';

const API = axios.create({
  baseURL: 'https://codejudgebackend.onrender.com', // Your backend API
  timeout: 1500000,
});

// 🧩 Problem Services
export const fetchProblems = () => API.get('/problems');
export const fetchProblemById = (id) => API.get(`/problems/${id}`);

// 🧠 Code Judging
export const runCode = (data) => API.post('/judge/run', data);
export const executeCode = (data) => API.post('/judge/execute', data);

// 📩 Submissions
export const fetchSubmissions = () => API.get('/submissions');
export const submitSolution = (data) => API.post('/submissions', data);

// 🤖 AI Assistance
export const getAISuggestion = (data) => API.post('/ai/suggest', data);