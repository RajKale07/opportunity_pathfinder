import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  login: (data) => api.post('/auth/login', data),
};

export const profileService = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  getSkills: () => api.get('/profile/skills'),
  addSkill: (name) => api.post('/profile/skills', { name }),
  deleteSkill: (id) => api.delete(`/profile/skills/${id}`),
};

export const ocrService = {
  upload: (formData) => api.post('/ocr/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadWithMeta: (formData, docType, label) => {
    formData.append('docType', docType);
    formData.append('label', label);
    return api.post('/ocr/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  saveManual: (docType, label, data) => api.post('/ocr/manual', { docType, label, data }),
  getDocuments: () => api.get('/ocr/documents'),
  deleteDocument: (id) => api.delete(`/ocr/documents/${id}`),
};

export const jobService = {
  search: (params) => api.get('/jobs/search', { params }),
};

export const scholarshipService = {
  getRecommendations: (filter = 'all') => api.get('/scholarships', { params: { filter } }),
};

export const schemeService = {
  getSchemes: (category = 'ALL', filter = 'all') => api.get('/schemes', { params: { category, filter } }),
};

export const careerService = {
  getRoadmap: (role) => api.get('/career/roadmap', { params: role ? { role } : {} }),
};

export const skillGapService = {
  getGap: (role) => api.get('/skills/gap', { params: role ? { role } : {} }),
};

export const resumeService = {
  get: () => api.get('/resume'),
  downloadPdf: () => api.get('/resume/pdf', { responseType: 'blob' }),
};

export const aiService = {
  chat: (messages) => api.post('/ai/chat', { messages }),
};

export const simulationService = {
  simulate: (role) => api.get('/career/simulate', { params: role ? { role } : {} }),
};

export default api;
