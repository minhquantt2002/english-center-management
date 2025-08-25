import { HomeworkStatus } from '../app/teacher/_hooks/use-homework';
import { CourseLevel } from './admin';

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
  course_level?: CourseLevel;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
  score: ScoreNested[];
  student_id: string;
}

export interface ScoreNested {
  id: string;

  listening: number | null;
  reading: number | null;
  speaking: number | null;
  writing: number | null;

  feedback: string | null;
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
    | 'A1' // TOEIC 0–250 (FOUNDATION) - Mất gốc
    | 'A2' // TOEIC 250–450 (BEGINNER) - Sơ cấp
    | 'B1' // TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp
    | 'B2' // TOEIC 600–850 (SUBMARINE) - Trung cấp cao
    | 'C1'; // TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết
  status: 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  course?: CourseNested;
  teacher?: TeacherNested;
  enrollments?: EnrollmentNested[];
  schedules?: ScheduleNested[];
}

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}

export interface HomeworkStudentResponse {
  id: string;
  session: {
    id: string;
    topic: string;
    class_id: string;
    schedule_id: string;
    created_at: string;
  };
  student_id: string;
  status: HomeworkStatus;
  feedback: string | null;
}

export interface AttendanceStudentResponse {
  id: string;
  session: {
    id: string;
    topic: string;
    class_id: string;
    schedule_id: string;
    created_at: string;
  };
  student_id: string;
  is_present: boolean;
}

export interface EnrollmentScoreResponse {
  id: string;
  classroom: ClassroomNested;
  score: ScoreNested;
}
