import { BaseEntity, CourseLevel, UserStatus } from './common';

// Student profile interface
export interface StudentProfile extends BaseEntity {
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  level: CourseLevel;
  currentClass?: string;
  enrollmentDate: string;
  enrollmentStatus: UserStatus;
  streak?: number;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Personal information form for students
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  currentClass: string;
  enrollmentStatus: UserStatus;
  avatar?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Test scores interface
export interface StudentScores {
  listening: number | string;
  speaking: number | string;
  reading: number | string;
  writing: number | string;
}

// Test result interface for students
export interface TestResult extends BaseEntity {
  studentId: string;
  courseId: string;
  courseName: string;
  testType: 'quiz' | 'midterm' | 'final' | 'practice';
  date: string;
  scores: StudentScores;
  overall: number;
  feedback?: string;
  teacherId: string;
  teacherName: string;
  maxScore?: number;
  gradeLevel?: string; // A, B, C, D, F
}

// Class information for student view
export interface StudentClass {
  id: string;
  name: string;
  level: CourseLevel;
  teacher: {
    id: string;
    name: string;
    avatar?: string;
    specialization?: string;
  };
  schedule: {
    days: string;
    time: string;
  };
  room: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  nextSession?: string;
  sessionsCompleted?: number;
  totalSessions?: number;
  color?: string;
  bgColor?: string;
}
