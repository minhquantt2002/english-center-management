import { AttendanceNested, HomeworkNested } from './teacher';

// Admin types based on backend schemas
export type UserRole = 'admin' | 'staff' | 'teacher' | 'student';
export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';

// Base User interfaces
export interface UserBase {
  name: string;
  email: string;
  role_name: UserRole;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  input_level?: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  level?: string;
  parent_name?: string;
  parent_phone?: string;
  status?: StudentStatus;
}

export interface UserCreate extends UserBase {
  password?: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  role_name?: UserRole;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  input_level?: string;
  specialization?: string;
  password?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  parent_name?: string;
  parent_phone?: string;
  status?: StudentStatus;
}

// Nested schemas for relationships
export interface ClassroomNested {
  id: string;
  class_name: string;
  room?: string;
  course_level?: string;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
  score: ScoreNested[];
  classroom?: ClassroomNested;
}

export interface ScoreNested {
  id: string;
  listening: number | null;
  reading: number | null;
  speaking: number | null;
  writing: number | null;
  feedback: string | null;
}

// User with relationships
export interface UserResponse extends UserBase {
  id: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
  enrollments?: EnrollmentNested[];
}

// Query parameters
export interface GetUsersQuery {
  role?: UserRole;
  status?: StudentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateUserRoleRequest {
  role_name: UserRole;
}

// Query parameters
export interface GetClassroomsQuery {
  course_id?: string;
  teacher_id?: string;
  status?: ClassStatus;
}

// Course types
export interface CourseBase {
  course_name: string;
  description?: string;
  level?: string;
  total_weeks?: number;
  price?: number;
  status?: string;
}

export interface CourseCreate extends CourseBase {}

export interface CourseUpdate {
  course_name?: string;
  description?: string;
  level?: string;
  total_weeks?: number;
  price?: number;
  status?: string;
}

export interface CourseResponse extends CourseBase {
  id: string;
  created_at: string;
  classes?: ClassroomNested[];
}

// Classroom types
export type ClassStatus = 'active' | 'completed' | 'cancelled';
export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';
export type CourseLevel =
  | 'A1' // TOEIC 0–250 (FOUNDATION) - Mất gốc
  | 'A2' // TOEIC 250–450 (BEGINNER) - Sơ cấp
  | 'B1' // TOEIC 450–600 (CAMP BOMB) - Trung cấp thấp
  | 'B2' // TOEIC 600–850 (SUBMARINE) - Trung cấp cao
  | 'C1'; // TOEIC SW 250+ (MASTER) - Nâng cao kỹ năng Nói/Viết

export interface ClassroomBase {
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level: CourseLevel;
  status: ClassStatus;
  start_date?: string;
  end_date?: string;
}

export interface ClassroomCreate extends ClassroomBase {}

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

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}

export interface ClassroomResponse extends ClassroomBase {
  id: string;
  created_at: string;
  course?: CourseNested;
  teacher?: TeacherNested;
  enrollments?: EnrollmentNested[];
  schedules?: ScheduleNested[];
}

// Teacher specific types
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

export interface TeacherCreate extends TeacherBase {
  password?: string;
}

export interface TeacherUpdate {
  name?: string;
  email?: string;
  specialization?: string;
  address?: string;
  education?: string;
  password?: string;
  experience_years?: number;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
}

export interface TeacherResponse extends TeacherBase {
  id: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
  rate_passed?: number;
  rate_attendanced?: number;
  rate_passed_homework?: number;
}

// Student specific types
export interface StudentBase {
  name: string;
  email: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status: StudentStatus;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
}

export interface StudentCreate extends StudentBase {
  password: string;
}

export interface StudentUpdate {
  name?: string;
  email?: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status?: StudentStatus;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  address?: string;
}

export interface StudentResponse extends StudentBase {
  id: string;
  created_at: string;
  enrollments?: EnrollmentNested[];
  attendances?: AttendanceNested[];
  homeworks?: HomeworkNested[];
}

// Missing interfaces for hooks
export interface AssignStudentRequest {
  studentId: string;
}

export interface TeacherScheduleResponse {
  teacher_id: string;
  schedules: ScheduleNested[];
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  recentEnrollments: any[];
}

export interface DashboardStatCards {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
}
