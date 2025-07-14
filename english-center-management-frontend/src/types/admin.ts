import {
  BaseEntity,
  CourseLevel,
  CourseStatus,
  UserRole,
  UserStatus,
} from './common';

// User base interface
export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
}

// Course interface for admin management
export interface Course extends BaseEntity {
  name?: string; // Frontend compatibility
  course_name?: string; // API response field
  description: string;
  level: CourseLevel;
  duration?: string | null; // e.g., "8 weeks"
  startDate?: string;
  endDate?: string;
  start_date?: string; // API response field
  end_date?: string; // API response field
  status?: CourseStatus;
  price?: number | null;
  maxStudents?: number;
  max_students?: number; // API response field
  syllabus?: string[];
}

// Class/Classroom interfaces for admin
export interface ClassData extends BaseEntity {
  class_name: string; // Match backend field name
  name?: string; // For frontend compatibility
  level?: CourseLevel; // From course
  teacher: {
    id: string;
    name: string;
    email: string;
    role_name: string;
    avatar?: string;
  };
  students?: number;
  maxStudents?: number;
  max_students?: number;
  current_students?: number;
  schedule?: {
    days: string;
    time: string;
  };
  room?: string;
  courseId?: string;
  course_id?: string;
  course?: {
    id: string;
    course_name: string;
    level: CourseLevel;
    description?: string;
  };
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  duration?: number;
  start_date?: string;
  end_date?: string;
  description?: string;
}

// Category management interfaces
export interface CategoryItem extends BaseEntity {
  name: string;
  description?: string;
}

export interface Category extends BaseEntity {
  name: string;
  icon: string;
  color: string;
  items: CategoryItem[];
  type: 'classroom' | 'course-level' | 'study-program' | 'time-slot' | 'other';
}

// Teacher interface for admin management
export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  specialization: string;
  assignedClasses: string[];
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
}

// Student interface for admin management
export interface Student extends User {
  role: 'student';
  studentId: string;
  dateOfBirth?: string;
  level: CourseLevel;
  enrollmentDate: string;
  parentContact?: string;
  notes?: string;
  currentClass?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Admin dashboard specific interfaces
export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  ongoingCourses: number;
  recentEnrollments: Array<{
    name: string;
    course: string;
    time: string;
    avatar: string;
  }>;
  systemStatus: Array<{
    service: string;
    status: string;
    statusColor: string;
  }>;
}
