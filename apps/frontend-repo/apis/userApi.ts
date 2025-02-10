import axios from 'axios';
import { User, UserUpdateData } from './user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: User;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(request => {
    console.log('API Request:', request.method?.toUpperCase(), request.url);
    return request;
  });
}

export const userApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/fetch-user-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUser: async (userData: UserUpdateData): Promise<User> => {
    try {
      const response = await api.put(`/update-user-data`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};