export interface Subject {
  id: string;
  name: string;
  code: string;
  number_of_grades: number;
  passing_average: number;
  recovery_average: number;
  teacher_id: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  number_of_grades: number;
  passing_average: number;
  recovery_average: number;
  teacher_id: string;
}

export interface UpdateSubjectData extends Partial<CreateSubjectData> {}
