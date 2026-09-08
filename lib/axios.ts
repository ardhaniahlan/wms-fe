import axios from 'axios';

const api = axios.create({
  baseURL: process.env.FRONTEND_URL as string | 'http://localhost:5000/api', 
  withCredentials: true,
});

export default api;