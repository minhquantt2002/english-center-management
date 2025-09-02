import { SessionAttendanceResponse } from '../app/teacher/_hooks/use-attendance';
import { SessionHomeworkResponse } from '../app/teacher/_hooks/use-homework';
import { AttendanceStudentResponse, HomeworkStudentResponse } from './student';
import { SessionNested } from './teacher';

// Staff specific types based on backend schemas
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type AchievementType =
  | 'academic'
  | 'participation'
  | 'leadership'
  | 'other';

export type UserRole = 'admin' | 'staff' | 'teacher' | 'student';
export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';
export type ClassStatus = 'active' | 'completed' | 'cancelled';
export type CourseLevel =
  | 'A1' // TOEIC 0–250 (FOUNDATION) - Mất gốc
  | 'A2' // TOEIC 250–450 (BEGINNER) - Sơ cấp
  | 'B1' // TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp
  | 'B2' // TOEIC 600–850 (SUBMARINE) - Trung cấp cao
  | 'C1'; // TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết

// ==================== STUDENT MANAGEMENT ====================
export interface StudentCreate {
  name: string;
  email: string;
  password: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  role_name: UserRole;
  address?: string;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  status?: StudentStatus;
}

export interface StudentUpdate {
  name?: string;
  email?: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  status?: StudentStatus;
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
  status: StudentStatus;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  created_at: string;
  enrollments?: EnrollmentNested[];
  attendances?: AttendanceStudentResponse[];
  homeworks?: HomeworkStudentResponse[];
}

// ==================== TEACHER MANAGEMENT ====================
export interface TeacherResponse {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
  rate_passed?: number;
  rate_attendanced?: number;
  rate_passed_homework?: number;
}

// ==================== COURSE MANAGEMENT ====================
export interface CourseResponse {
  id: string;
  course_name: string;
  description?: string;
  level?: CourseLevel;
  total_weeks?: number;
  price?: number;
  created_at: string;
  classes?: ClassroomNested[];
}

// ==================== CLASSROOM MANAGEMENT ====================
export interface ClassroomCreate {
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level?: CourseLevel;
  status?: ClassStatus;
  start_date?: string;
  end_date?: string;
}

export interface ClassroomUpdate {
  class_name?: string;
  course_id?: string;
  teacher_id?: string;
  room?: string;
  course_level?: CourseLevel;
  status?: ClassStatus;
  start_date?: string;
  end_date?: string;
}

export interface ClassroomResponse {
  id: string;
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level: CourseLevel;
  status: ClassStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  course?: CourseNested;
  teacher?: TeacherNested;
  enrollments?: EnrollmentNested[];
  schedules?: ScheduleNested[];
  sessions?: SessionNested[];
}

// ==================== SCHEDULE MANAGEMENT ====================
export interface ScheduleCreate {
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
}

export interface ScheduleUpdate {
  class_id?: string;
  weekday?: Weekday;
  start_time?: string;
  end_time?: string;
}

export interface ScheduleResponse {
  id: string;
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  classroom?: ClassroomNested;
}

// ==================== STATS MANAGEMENT ====================
export interface StaffStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
}

export interface RecentEnrollment {
  id: string;
  student_name: string;
  class_name: string;
  enrollment_date: string;
}

// ==================== API RESPONSE TYPES ====================

export interface TeacherScheduleResponse {
  schedule: ScheduleResponse[];
}

export interface ClassroomStudentsResponse {
  students: StudentResponse[];
}

export interface ClassroomSchedulesResponse {
  schedules: ScheduleResponse[];
}

export interface RoomsResponse {
  rooms: string[];
}

export interface InvoiceCreateResponse {
  message: string;
}

export interface AssignStudentResponse {
  message: string;
}

export interface AssignMultipleStudentsResponse {
  message: string;
}

export interface DeleteScheduleResponse {
  message: string;
}

// ==================== QUERY PARAMETERS ====================
export interface GetStudentsQuery {
  status?: StudentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetClassroomsQuery {
  course_id?: string;
  teacher_id?: string;
  status?: ClassStatus;
}

export interface GetSchedulesQuery {
  classroom_id?: string;
  teacher_id?: string;
  weekday?: Weekday;
  date?: string; // Format: YYYY-MM-DD
}

// ==================== NESTED SCHEMAS ====================
export interface StudentNested {
  id: string;
  name: string;
  email: string;
}

export interface TeacherNested {
  id: string;
  name: string;
  email: string;
}

export interface CourseNested {
  id: string;
  course_name: string;
  level?: string;
}

export interface ClassroomNested {
  id: string;
  class_name: string;
  room?: string;
  course_level: CourseLevel;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
  class_id?: string;
  classroom: ClassroomNested;
  student: StudentResponse;
  score: ScoreNested[];
}

export interface ScoreNested {
  id: string;

  listening: number | null;
  reading: number | null;
  speaking: number | null;
  writing: number | null;

  feedback: string | null;
}

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}
