export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  scores: number[];
  average: number;
  status: 'approved' | 'recovery' | 'failed' | 'incomplete';
  school_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGradeData {
  student_id: string;
  subject_id: string;
  scores: number[];
}

export interface AddScoreData {
  add_score: number;
}

export interface UpdateScoreData {
  score_index: number;
  update_score: number;
}

export interface UpdateAllScoresData {
  scores: number[];
}
