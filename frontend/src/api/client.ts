import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pathfinder_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pathfinder_token');
      localStorage.removeItem('pathfinder_user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;

// Typed API Services
export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const profileApi = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),
  addProject: (data: any) => api.post('/profile/projects', data),
  addCareerGoal: (data: any) => api.post('/profile/career-goals', data),
};

export const digitalTwinApi = {
  getCurrentState: () => api.get('/digital-twin/current'),
  getTimeline: () => api.get('/digital-twin/timeline'),
};

export const skillsApi = {
  getAll: () => api.get('/skills'),
  getMySkills: () => api.get('/skills/my'),
  updateSkill: (data: any) => api.put('/skills/my', data),
  checkPrerequisites: (skillId: number) => api.get(`/skills/prerequisites/${skillId}`),
  getGraph: () => api.get('/skills/graph'),
};

export const careersApi = {
  getAll: () => api.get('/careers'),
  getRecommendations: () => api.get('/careers/recommendations'),
};

export const skillGapsApi = {
  getReport: (pathId: number) => api.get(`/skill-gaps/path/${pathId}`),
};

export const learningApi = {
  getActivePlan: () => api.get('/learning/active'),
  generateRoadmap: (pathId: number) => api.post(`/learning/generate/${pathId}`),
  getTodayTasks: () => api.get('/learning/today'),
};

export const tasksApi = {
  updateStatus: (taskId: number, status: string) => api.patch(`/tasks/${taskId}/status`, { status }),
  submitEvidence: (taskId: number, data: any) => api.post(`/tasks/${taskId}/evidence`, data),
};

export const executionApi = {
  getSummary: () => api.get('/execution/summary'),
};

export const intelligenceApi = {
  getFailures: () => api.get('/failures'),
  recordFailure: (data: any) => api.post('/failures', data),
  getSuccesses: () => api.get('/successes'),
};

export const adaptiveApi = {
  getHistory: () => api.get('/adaptation/history'),
  triggerAdaptation: (data: any) => api.post('/adaptation/trigger', data),
};

export const opportunityApi = {
  getMatches: () => api.get('/opportunities/matches'),
  apply: (id: number, data: any) => api.post(`/opportunities/${id}/apply`, data),
};

export const readinessApi = {
  getProfile: () => api.get('/readiness/profile'),
};

export const interviewApi = {
  getQuestions: () => api.get('/interviews/questions'),
  submitAnswer: (data: any) => api.post('/interviews/submit', data),
  getHistory: () => api.get('/interviews/history'),
};

export const resumeApi = {
  analyze: (data: any) => api.post('/resume/analyze', data),
};

export const evaluationApi = {
  getOverview: () => api.get('/evaluation/overview'),
  getExportUrl: (datasetName: string) => `/api/evaluation/export/${datasetName}`,
};

export const demoApi = {
  runScenario: () => api.post('/demo/run-scenario'),
};
