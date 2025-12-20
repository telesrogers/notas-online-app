export interface School {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolData {
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

export interface UpdateSchoolData extends Partial<CreateSchoolData> {}
