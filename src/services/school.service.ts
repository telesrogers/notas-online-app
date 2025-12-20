import { CreateSchoolData, School, UpdateSchoolData } from '../types/school.types';
import api, { publicApi } from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeSchool = (data: any): School => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as School;
};

export const schoolService = {
  /**
   * Criar escola (público - não requer autenticação)
   * POST /schools
   */
  async create(schoolData: CreateSchoolData): Promise<School> {
    const response = await api.post<any>('/schools', { school: schoolData });
    return normalizeSchool(response.data);
  },

  /**
   * Listar escolas (autenticado)
   * GET /schools
   */
  async getAll(): Promise<School[]> {
    const response = await api.get<any[]>('/schools');
    return response.data.map(normalizeSchool);
  },

  /**
   * Listar escolas (público - não requer autenticação)
   * GET /schools/public
   */
  async getPublic(): Promise<School[]> {
    const response = await publicApi.get<any[]>('/schools/public');
    return response.data.map(normalizeSchool);
  },

  /**
   * Obter escola específica
   * GET /schools/:id
   */
  async getById(id: string): Promise<School> {
    const response = await api.get<any>(`/schools/${id}`);
    return normalizeSchool(response.data);
  },

  /**
   * Atualizar escola
   * PUT /schools/:id
   */
  async update(id: string, schoolData: UpdateSchoolData): Promise<School> {
    const response = await api.put<any>(`/schools/${id}`, { school: schoolData });
    return normalizeSchool(response.data);
  },

  /**
   * Deletar escola (apenas admin)
   * DELETE /schools/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/schools/${id}`);
  }
};
