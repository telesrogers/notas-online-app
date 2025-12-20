import type { User } from './user.types';

export interface Teacher extends User {}

export interface CreateTeacherData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  school_id: string;
  address?: string;
  phone?: string;
}

export interface UpdateTeacherData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  address?: string;
  phone?: string;
}
