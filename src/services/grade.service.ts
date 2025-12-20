import {
  AddScoreData,
  CreateGradeData,
  Grade,
  UpdateAllScoresData,
  UpdateScoreData
} from '../types/grade.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeGrade = (data: any): Grade => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as Grade;
};

export const gradeService = {
  /**
   * Criar registro de notas
   * POST /grades
   */
  async create(gradeData: CreateGradeData): Promise<Grade> {
    const response = await api.post<any>('/grades', { grade: gradeData });
    return normalizeGrade(response.data);
  },

  /**
   * Listar notas
   * GET /grades
   * GET /grades?student_id=xxx
   * GET /grades?subject_id=xxx
   */
  async getAll(filters?: { student_id?: string; subject_id?: string }): Promise<Grade[]> {
    const params = new URLSearchParams();
    if (filters?.student_id) params.append('student_id', filters.student_id);
    if (filters?.subject_id) params.append('subject_id', filters.subject_id);
    
    const queryString = params.toString();
    const url = queryString ? `/grades?${queryString}` : '/grades';
    
    const response = await api.get<any[]>(url);
    return response.data.map(normalizeGrade);
  },

  /**
   * Obter nota específica
   * GET /grades/:id
   */
  async getById(id: string): Promise<Grade> {
    const response = await api.get<any>(`/grades/${id}`);
    return normalizeGrade(response.data);
  },

  /**
   * Adicionar uma nota
   * PUT /grades/:id
   */
  async addScore(id: string, scoreData: AddScoreData): Promise<Grade> {
    const response = await api.put<any>(`/grades/${id}`, { grade: scoreData });
    return normalizeGrade(response.data);
  },

  /**
   * Atualizar uma nota específica
   * PUT /grades/:id
   */
  async updateScore(id: string, scoreData: UpdateScoreData): Promise<Grade> {
    const response = await api.put<any>(`/grades/${id}`, { grade: scoreData });
    return normalizeGrade(response.data);
  },

  /**
   * Atualizar todas as notas
   * PUT /grades/:id
   */
  async updateAllScores(id: string, scoresData: UpdateAllScoresData): Promise<Grade> {
    const response = await api.put<any>(`/grades/${id}`, { grade: scoresData });
    return normalizeGrade(response.data);
  },

  /**
   * Deletar registro de notas
   * DELETE /grades/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/grades/${id}`);
  }
};
