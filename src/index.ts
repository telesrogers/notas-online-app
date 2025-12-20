/**
 * ÍNDICE PRINCIPAL - EXPORTAÇÕES
 * 
 * Use este arquivo para importar serviços, tipos, hooks e contextos
 * de forma organizada e centralizada.
 */

// ============================================
// SERVIÇOS
// ============================================
export {
  api, authService, gradeService, schoolService,
  studentService,
  subjectService, userService
} from './services';

// ============================================
// TIPOS
// ============================================
export type {
  AddScoreData, AuthResponse, CreateGradeData, CreateSchoolData, CreateStudentData, CreateSubjectData,
  // Grade Types
  Grade,
  // Auth Types
  LoginCredentials,
  RegisterData,
  // School Types
  School,
  // Student Types
  Student,
  // Subject Types
  Subject, UpdateAllScoresData, UpdateSchoolData, UpdateScoreData, UpdateStudentData, UpdateSubjectData,
  // User Types
  UpdateUserData, User
} from './types';

// ============================================
// CONTEXTOS
// ============================================
export { AuthContext, AuthProvider } from './contexts/AuthContext';

// ============================================
// HOOKS
// ============================================
export { useAuth } from './hooks/useAuth';

// ============================================
// STORAGE
// ============================================
export { tokenStorage } from './storage/tokenStorage';
