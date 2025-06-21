import api from './api';

const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

const register = async (username, email, password) => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password,
  });
  
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const refreshToken = async () => {
  const response = await api.post('/auth/refresh-token');
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    return true;
  }
  
  return false;
};

const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

const changePassword = async (oldPassword, newPassword) => {
  const response = await api.put('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

const authService = {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
};

export default authService;
