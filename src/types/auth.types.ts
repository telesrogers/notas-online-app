export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: 'admin' | 'teacher';
  school_id: string;
  address?: string;
  phone?: string;
}

import type { User } from './user.types';

export interface AuthResponse {
  user: User;
  token: string;
}
