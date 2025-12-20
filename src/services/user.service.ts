import { UpdateUserData, User } from '../types/user.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeUser = (data: any): User => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as User;
};

export const userService = {
  /**
   * Listar usuários (apenas admin)
   * GET /users
   */
  async getAll(): Promise<User[]> {
    const response = await api.get<any[]>('/users');
    return response.data.map(normalizeUser);
  },

  /**
   * Obter usuário específico
   * GET /users/:id
   */
  async getById(id: string): Promise<User> {
    const response = await api.get<any>(`/users/${id}`);
    return normalizeUser(response.data);
  },

  /**
   * Atualizar usuário
   * PUT /users/:id
   */
  async update(id: string, userData: UpdateUserData): Promise<User> {
    const response = await api.put<any>(`/users/${id}`, { user: userData });
    return normalizeUser(response.data);
  },

  /**
   * Deletar usuário (apenas admin)
   * DELETE /users/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
