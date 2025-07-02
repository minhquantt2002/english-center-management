import { BaseEntity, CourseLevel, UserStatus, BaseFilters } from './common';

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

// Student dashboard data
export interface StudentDashboard {
  welcomeMessage: string;
  level: CourseLevel;
  streak: number;
  upcomingClasses: StudentClass[];
  recentTestResults: TestResult[];
  overallProgress: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    overall: number;
  };
  achievements?: Achievement[];
  announcements?: Announcement[];
}

// Achievement system for students
export interface Achievement extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'score' | 'completion' | 'participation';
  earnedDate: string;
  points?: number;
}

// Announcements for students
export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  type: 'general' | 'class' | 'exam' | 'event';
  priority: 'low' | 'medium' | 'high';
  publishDate: string;
  expiryDate?: string;
  targetAudience: 'all' | 'class' | 'level';
  classId?: string;
  level?: CourseLevel;
  createdBy: string;
  isRead?: boolean;
}

// Student attendance record
export interface AttendanceRecord extends BaseEntity {
  classId: string;
  className: string;
  sessionDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedAt: string;
  sessionTopic?: string;
}

// Student homework/assignment
export interface Assignment extends BaseEntity {
  title: string;
  description: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  status: 'assigned' | 'submitted' | 'graded' | 'overdue';
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  attachments?: string[];
  maxScore?: number;
}

// Student schedule view
export interface StudentSchedule {
  classId: string;
  className: string;
  teacher: string;
  room: string;
  time: string;
  day: string;
  date?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  topic?: string;
  color?: string;
  bgColor?: string;
}

// Student progress tracking
export interface ProgressTracker {
  subject:
    | 'listening'
    | 'speaking'
    | 'reading'
    | 'writing'
    | 'grammar'
    | 'vocabulary';
  currentLevel: CourseLevel;
  currentScore: number;
  targetScore: number;
  improvement: number;
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
  recommendations?: string[];
}

// Student feedback on classes/teachers
export interface StudentFeedback extends BaseEntity {
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  rating: number; // 1-5 scale
  comment?: string;
  feedbackDate: string;
  categories: {
    teaching_quality: number;
    communication: number;
    class_organization: number;
    helpfulness: number;
  };
  isAnonymous: boolean;
}

// Study materials for students
export interface StudyMaterial extends BaseEntity {
  title: string;
  description: string;
  type: 'video' | 'audio' | 'document' | 'quiz' | 'exercise';
  level: CourseLevel;
  subject: string;
  url?: string;
  downloadUrl?: string;
  duration?: string; // for video/audio
  fileSize?: string;
  uploadedBy: string;
  uploadDate: string;
  isPublic: boolean;
  classIds?: string[]; // if specific to certain classes
}

// Student filters
export interface StudentFilters extends BaseFilters {
  level?: CourseLevel;
  class?: string;
  status?: UserStatus;
  dateFrom?: string;
  dateTo?: string;
}
