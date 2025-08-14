// Student specific types based on backend schemas
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Student specific interfaces
export interface StudentUpdate {
  name?: string;
  email?: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status?: 'active' | 'inactive' | 'suspended' | 'graduated';
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
}

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  created_at: string;
  enrollments?: EnrollmentNested[];
  scores?: ScoreNested[];
  received_feedbacks?: FeedbackNested[];
}

// Schedule types
export interface ScheduleResponse {
  id: string;
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  classroom?: ClassroomNested;
}

// Score types
export interface ScoreResponse {
  id: string;
  student_id: string;
  exam_id: string;
  listening?: number;
  reading?: number;
  speaking?: number;
  writing?: number;
  total_score?: number;
  grade?: string;
  comments?: string;
  created_at: string;
  student?: StudentNested;
  exam?: ExamNested;
}

// Dashboard types
export interface StudentDashboard {
  student_id: string;
  student_name: string;
  total_enrollments: number;
  total_scores: number;
  average_score: number;
  today_schedules: ScheduleResponse[];
  upcoming_classes: ClassroomResponse[];
  recent_scores: ScoreResponse[];
}

// Query parameters
export interface GetStudentClassesParams {
  status?: 'active' | 'completed' | 'cancelled';
}

export interface GetStudentScheduleParams {
  classroom_id?: string;
  weekday?: Weekday;
}

export interface GetStudentScoresParams {
  exam_id?: string;
  classroom_id?: string;
}

// Nested schemas for student
export interface StudentNested {
  id: string;
  name: string;
  email: string;
}

export interface ClassroomNested {
  id: string;
  class_name: string;
  room?: string;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
}

export interface ScoreNested {
  id: string;
  total_score?: number;
  grade?: string;
}

export interface FeedbackNested {
  id: string;
  content?: string;
  rating?: number;
}

export interface ExamNested {
  id: string;
  exam_name: string;
  exam_date?: string;
}

export interface CourseNested {
  id: string;
  course_name: string;
  level?: string;
}

export interface TeacherNested {
  id: string;
  name: string;
  email: string;
}

export interface ClassroomResponse {
  id: string;
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level:
    | 'A1'  // TOEIC 0–250 (FOUNDATION) - Mất gốc
    | 'A2'  // TOEIC 250–450 (BEGINNER) - Sơ cấp
    | 'B1'  // TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp
    | 'B2'  // TOEIC 600–850 (SUBMARINE) - Trung cấp cao
    | 'C1'; // TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết
  status: 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  course?: CourseNested;
  teacher?: TeacherNested;
  enrollments?: EnrollmentNested[];
  exams?: ExamNested[];
  feedbacks?: FeedbackNested[];
  schedules?: ScheduleNested[];
}

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}
