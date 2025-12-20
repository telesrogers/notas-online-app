import { CreateSubjectData, Subject, UpdateSubjectData } from '../types/subject.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeSubject = (data: any): Subject => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as Subject;
};

export const subjectService = {
  /**
   * Criar disciplina
   * POST /subjects
   */
  async create(subjectData: CreateSubjectData): Promise<Subject> {
    const response = await api.post<any>('/subjects', { subject: subjectData });
    return normalizeSubject(response.data);
  },

  /**
   * Listar disciplinas
   * Admin vê todas, professor vê apenas as suas
   * GET /subjects
   */
  async getAll(): Promise<Subject[]> {
    const response = await api.get<any[]>('/subjects');
    return response.data.map(normalizeSubject);
  },

  /**
   * Obter disciplina específica
   * GET /subjects/:id
   */
  async getById(id: string): Promise<Subject> {
    const response = await api.get<any>(`/subjects/${id}`);
    return normalizeSubject(response.data);
  },

  /**
   * Atualizar disciplina
   * PUT /subjects/:id
   */
  async update(id: string, subjectData: UpdateSubjectData): Promise<Subject> {
    const response = await api.put<any>(`/subjects/${id}`, { subject: subjectData });
    return normalizeSubject(response.data);
  },

  /**
   * Deletar disciplina
   * DELETE /subjects/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/subjects/${id}`);
  }
};
