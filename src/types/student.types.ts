export interface Student {
  id: string;
  name: string;
  email: string;
  registration_number: string;
  phone?: string;
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  registration_number: string;
  phone?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {}
