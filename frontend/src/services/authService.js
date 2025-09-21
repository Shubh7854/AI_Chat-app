import api from './api';

const authService = {
  login: (username, password) => {
    return api.post('/auth/login', { username, password });
  },

  register: (username, password) => {
    return api.post('/auth/register', { username, password });
  },

  getProfile: () => {
    return api.get('/auth/profile');
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;

