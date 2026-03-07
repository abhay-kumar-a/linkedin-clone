import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data)
};

export const userAPI = {
  getAllUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  getCurrentUser: () => api.get('/api/users/profile'),
  updateUser: (data) => api.put('/api/users', data),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  getUserProfile: (id) => api.get(`/api/users/profile/${id}`),
  getFriends: () => api.get('/api/users/friends'),
  uploadFile: (formData) => api.post('/api/users/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFiles: () => api.get('/api/users/files'),
  getFilesByType: (type) => api.get(`/api/users/files/${type}`),
  getResumes: () => api.get('/api/users/resumes'),
  addExperience: (data) => api.post('/api/users/experiences', data),
  getExperiences: () => api.get('/api/users/experiences'),
  getExperienceById: (id) => api.get(`/api/users/experiences/${id}`),
  updateExperience: (id, data) => api.put(`/api/users/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/api/users/experiences/${id}`)
};

export const postAPI = {
  createPost: (data) => api.post('/api/posts', data),
  uploadPostFile: (formData) => api.post('/api/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllPosts: () => api.get('/api/posts'),
  getPostById: (id) => api.get(`/api/posts/${id}`),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  addComment: (data) => api.post('/api/posts/comments', data),
  getComment: (id) => api.get(`/api/posts/comments/${id}`),
  getReplies: (id) => api.get(`/api/posts/comments/replies/${id}`),
  getPostComments: (postId) => api.get(`/api/posts/comments/post/${postId}`),
  deleteComment: (id) => api.delete(`/api/posts/comments/${id}`),
  likePost: (data) => api.post('/api/posts/likes', data)
};

export const companyAPI = {
  createCompany: (data) => api.post('/api/company', data),
  uploadCompanyFile: (formData) => api.post('/api/company/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllCompanies: () => api.get('/api/company'),
  getCompanyById: (id) => api.get(`/api/company/${id}`),
  getCompanyDetailed: (id) => api.get(`/api/company/detailed/${id}`),
  updateCompany: (id, data) => api.put(`/api/company/${id}`, data),
  deleteCompany: (id) => api.delete(`/api/company/${id}`),
  addLocation: (companyId, data) => api.post('/api/company/locations', { ...data, companyId }),
  updateLocation: (id, data) => api.put(`/api/company/locations/${id}`, data),
  deleteLocation: (id) => api.delete(`/api/company/locations/${id}`)
};

export const jobAPI = {
  createJob: (data) => api.post('/api/jobs', data),
  getAllJobs: () => api.get('/api/jobs'),
  getJobById: (id) => api.get(`/api/jobs/${id}`),
  getJobDetailed: (id) => api.get(`/api/jobs/detailed/${id}`),
  getJobsByCompany: (companyId) => api.get(`/api/jobs/company/${companyId}`),
  getJobsByCategory: (categoryId) => api.get(`/api/jobs/category/${categoryId}`),
  getJobsSorted: (sortType) => api.get(`/api/jobs/sorted/${sortType}`),
  updateJob: (id, data) => api.put(`/api/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),
  applyJob: (data) => api.post('/api/jobs/applied', data),
  getApplications: (jobId) => api.get(`/api/jobs/applied/${jobId}`)
};

export const categoryAPI = {
  createCategory: (data) => api.post('/api/category', data),
  getAllCategories: () => api.get('/api/category'),
  getCategoryById: (id) => api.get(`/api/category/${id}`),
  updateCategory: (id, data) => api.put(`/api/category/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/category/${id}`)
};

export const chatAPI = {
  createChat: (data) => api.post('/api/chats', data),
  getAllChats: () => api.get('/api/chats'),
  getChatById: (id) => api.get(`/api/chats/${id}`),
  deleteChat: (id) => api.delete(`/api/chats/${id}`),
  sendMessage: (data) => api.post('/api/chats/messages', data),
  updateMessage: (id, data) => api.put(`/api/chats/messages/${id}`, data),
  deleteMessage: (id) => api.delete(`/api/chats/messages/${id}`)
};

export const fileAPI = {
  uploadFile: (formData) => api.post('/api/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (id) => api.delete(`/api/files/${id}`),
  batchDelete: (ids) => api.post('/api/files/batch-delete', ids)
};

export default api;
