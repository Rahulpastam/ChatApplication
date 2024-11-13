import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  updateProfile: (data: any) => api.put('/auth/profile', data)
};

export const rooms = {
  create: (data: any) => api.post('/rooms', data),
  getAll: () => api.get('/rooms'),
  delete: (id: string) => api.delete(`/rooms/${id}`)
};

export const messages = {
  send: (data: any) => api.post('/messages', data),
  edit: (id: string, data: any) => api.put(`/messages/${id}`, data),
  delete: (id: string) => api.delete(`/messages/${id}`)
};