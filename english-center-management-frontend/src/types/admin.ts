import {
  BaseEntity,
  CourseLevel,
  CourseStatus,
  UserRole,
  UserStatus,
  BaseFilters,
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
  name: string;
  description: string;
  level: CourseLevel;
  duration: string; // e.g., "8 weeks"
  startDate: string;
  endDate: string;
  status: CourseStatus;
  price?: number;
  maxStudents?: number;
  syllabus?: string[];
}

// Class/Classroom interfaces for admin
export interface ClassData extends BaseEntity {
  name: string;
  level: CourseLevel;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
  };
  students: number;
  maxStudents?: number;
  schedule: {
    days: string;
    time: string;
  };
  room?: string;
  courseId?: string;
  status: 'active' | 'inactive';
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

// Admin filter interfaces
export interface UserFilters extends BaseFilters {
  role?: UserRole;
  status?: UserStatus;
  level?: CourseLevel;
}

export interface CourseFilters extends BaseFilters {
  level?: CourseLevel;
  status?: CourseStatus;
}

export interface ClassFilters extends BaseFilters {
  level?: CourseLevel;
  teacher?: string;
  status?: 'active' | 'inactive';
}

export interface AdminTeacherFilters extends BaseFilters {
  specialization?: string;
  status?: UserStatus;
  assignedClass?: string;
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

// Role and permission management
export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}
