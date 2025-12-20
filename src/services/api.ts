import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env';
import { tokenStorage } from '../storage/tokenStorage';

// Criar instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de REQUEST - adiciona token automaticamente
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Recuperar token do AsyncStorage
    const token = await tokenStorage.getToken();
    
    // Se existe token, adicionar ao header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de RESPONSE - trata erros 401
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas retorna
    return response;
  },
  async (error: AxiosError) => {
    // Se for erro 401 (não autorizado)
    if (error.response?.status === 401) {
      // Token inválido ou expirado - limpar storage
      await tokenStorage.removeToken();
      
      // Você pode emitir um evento ou usar navegação aqui
      // Por exemplo: NavigationService.navigate('Login');
      // Ou usar um EventEmitter para notificar o AuthContext
      
      console.log('Token expirado ou inválido. Redirecionando para login...');
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Instância pública (sem token) para endpoints que não exigem autenticação
export const publicApi: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
