import { CreateStudentData, Student, UpdateStudentData } from '../types/student.types';
import api from './api';

// Função auxiliar para normalizar o ID (MongoDB retorna _id)
const normalizeStudent = (data: any): Student => {
  if (data._id && !data.id) {
    data.id = data._id;
  }
  return data as Student;
};

export const studentService = {
  /**
   * Criar aluno
   * POST /students
   */
  async create(studentData: CreateStudentData): Promise<Student> {
    const response = await api.post<any>('/students', { student: studentData });
    return normalizeStudent(response.data);
  },

  /**
   * Listar alunos
   * GET /students
   */
  async getAll(): Promise<Student[]> {
    const response = await api.get<any[]>('/students');
    return response.data.map(normalizeStudent);
  },

  /**
   * Obter aluno específico
   * GET /students/:id
   */
  async getById(id: string): Promise<Student> {
    const response = await api.get<any>(`/students/${id}`);
    return normalizeStudent(response.data);
  },

  /**
   * Atualizar aluno
   * PUT /students/:id
   */
  async update(id: string, studentData: UpdateStudentData): Promise<Student> {
    const response = await api.put<any>(`/students/${id}`, { student: studentData });
    return normalizeStudent(response.data);
  },

  /**
   * Deletar aluno (apenas admin)
   * DELETE /students/:id
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/students/${id}`);
  }
};
