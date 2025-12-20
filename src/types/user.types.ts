export interface User {
  id: string;
  name: string;
  email: string;
  user_type: 'admin' | 'teacher';
  school_id: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  address?: string;
  phone?: string;
}
