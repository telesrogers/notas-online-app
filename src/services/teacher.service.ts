import { CreateTeacherData, Teacher, UpdateTeacherData } from '../types/teacher.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeTeacher = (data: any): Teacher => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as Teacher;
};

export const teacherService = {
  /**
   * Criar professor (apenas admin)
   * POST /users
   */
  async create(teacherData: CreateTeacherData): Promise<Teacher> {
    const response = await api.post<any>('/users', {
      user: {
        ...teacherData,
        user_type: 'teacher',
      },
    });
    return normalizeTeacher(response.data);
  },

  /**
   * Listar professores (apenas admin)
   * GET /users?user_type=teacher
   */
  async getAll(): Promise<Teacher[]> {
    const response = await api.get<any[]>('/users?user_type=teacher');
    return response.data.map(normalizeTeacher);
  },

  /**
   * Obter professor específico
   * GET /users/:id
   */
  async getById(id: string): Promise<Teacher> {
    const response = await api.get<any>(`/users/${id}`);
    return normalizeTeacher(response.data);
  },

  /**
   * Atualizar professor
   * PUT /users/:id
   */
  async update(id: string, teacherData: UpdateTeacherData): Promise<Teacher> {
    const response = await api.put<any>(`/users/${id}`, { user: teacherData });
    return normalizeTeacher(response.data);
  },

  /**
   * Deletar professor (apenas admin)
   * DELETE /users/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};
