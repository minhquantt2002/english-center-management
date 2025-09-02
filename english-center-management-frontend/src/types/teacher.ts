import { HomeworkStatus } from '../app/teacher/_hooks/use-homework';

// Teacher specific types based on backend schemas
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Teacher specific interfaces
export interface TeacherBase {
  name: string;
  email: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
}

export interface TeacherResponse extends TeacherBase {
  id: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
}

// Student in class
export interface StudentInClass {
  id: string;
  name: string;
  email: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  enrollment_date: string;
}

// Schedule types
export interface ScheduleData {
  id: string;
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  classroom?: ClassroomNested;
}

export interface ScoreUpdate {
  listening: number | null;
  reading: number | null;
  speaking: number | null;
  writing: number | null;
  feedback: string | null;
}

export interface TeachingSchedule {
  teacher_id: string;
  teacher_name: string;
  schedules: ScheduleData[];
}

export interface ClassDetails {
  id: string;
  class_name: string;
  course: CourseNested;
  teacher: TeacherNested;
  room?: string;
  course_level:
    | 'beginner'
    | 'elementary'
    | 'intermediate'
    | 'upper-intermediate'
    | 'advanced'
    | 'proficiency';
  status: 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  enrollments: EnrollmentNested[];
  schedules: ScheduleNested[];
  sessions: SessionNested[];
}

export interface SessionNested {
  id: string;
  attendances: AttendanceNested[];
  homeworks: HomeworkNested[];
}

export interface AttendanceNested {
  id: string;
  session_id: string;
  student_id: string;
  is_present: boolean;
}

export interface HomeworkNested {
  id: string;
  session_id: string;
  student_id: string;
  status: HomeworkStatus;
  feedback: string;
}

// Dashboard types
export interface TeacherDashboard {
  teacher_id: string;
  teacher_name: string;
  total_classes: number;
  total_students: number;
  today_schedules: ScheduleData[];
  upcoming_classes: ClassDetails[];
  recent_activities: any[];
}

export interface TeacherClassroomResponse extends ClassDetails {}

// Nested schemas for teacher
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

export interface ClassroomNested {
  id: string;
  class_name: string;
  room?: string;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
  student: StudentInClass;
  score: ScoreNested[];
}

export interface ScoreNested extends ScoreUpdate {
  id: string;
}

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}
