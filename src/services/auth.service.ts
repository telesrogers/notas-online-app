import { tokenStorage } from '../storage/tokenStorage';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';
import type { User } from '../types/user.types';
import api from './api';

export const authService = {
  /**
   * Fazer login
   * POST /users/login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users/login', credentials);
      
      // Salvar token e dados do usuário
      await tokenStorage.saveToken(response.data.token);
      await tokenStorage.saveUser(response.data.user);
      
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  /**
   * Registrar novo usuário
   * POST /users
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/users', { user: userData });
      // Alterei para NÃO autenticar automaticamente após cadastro. O app deve voltar para a tela de login.
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    try {
      await tokenStorage.removeToken();
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  /**
   * Obter perfil do usuário atual
   * GET /users/me
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/me');
      await tokenStorage.saveUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  /**
   * Verificar se está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return await tokenStorage.isAuthenticated();
  },

  /**
   * Obter usuário do storage
   */
  async getCurrentUser(): Promise<User | null> {
    return await tokenStorage.getUser();
  }
};
