import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getThreats = () => api.get('/threats/getThreats');
export const getHighRiskThreats = () => api.get('/threats/highRisk');
export const getPredictions = () => api.get('/threats/predictions');
export const getRiskScore = () => api.get('/threats/risk-score');
export const getRecommendations = () => api.get('/threats/recommendations');
export const chatbot = (message) => api.post('/threats/chatbot', { message });
export const addThreat = (data) => api.post('/threats/addThreat', data);
export const deleteThreat = (id) => api.delete(`/threats/${id}`);
export const addLog = (data) => api.post('/logs/addLog', data);

// Vulnerabilities
export const getVulnerabilities = () => api.get('/vulnerabilities');
export const addVulnerability = (data) => api.post('/vulnerabilities', data);

// Detailed threat actions
export const resolveThreat = (id) => api.put(`/threats/${id}/resolve`);
export const blockIp = (ip) => api.post('/threats/block-ip', { ip });

export default api;
