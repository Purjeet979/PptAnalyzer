import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});


export const getAuthStatus = () => api.get('/api/auth/status');
export const saveComparison = (data) => api.post('/api/save_comparison', data);
export const getHistory = () => api.get('/api/history');
export const deleteHistoryItem = (id) => api.delete(`/api/history/${id}`);
export const logout = () => {
    window.location.href = 'http://localhost:5000/logout';
};

export default api;
