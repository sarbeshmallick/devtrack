import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api' });
api.interceptors.request.use(config => { const token = localStorage.getItem('devtrack_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export const getErrorMessage = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message ?? 'Something went wrong. Please try again.' : 'Something went wrong. Please try again.';
