import { BaseEntity, CourseLevel, UserStatus, TimeSlot } from './common';
import { StudentScores } from './student';

// Teacher profile interface
export interface TeacherProfile extends BaseEntity {
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  status: UserStatus;
  joinDate: string;
  bio?: string;
  languages?: string[];
  certifications?: string[];
}

// Class session interface for teachers
export interface ClassSession {
  id: string;
  title: string;
  level?: CourseLevel;
  room: string;
  studentCount: number;
  time: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  color?: string;
  bgColor?: string;
  date?: string;
  duration?: string;
  topic?: string;
  students?: StudentInClass[];
}

// Student in class view for teachers
export interface StudentInClass {
  id: string;
  name: string;
  avatar?: string;
  status: 'Present' | 'Upcoming' | 'Absent' | 'Late';
  email?: string;
  phone?: string;
  level?: CourseLevel;
  attendanceRate?: number;
  lastScore?: number;
}

// Score entry interface for teachers
export interface StudentScore extends BaseEntity {
  studentId: string;
  studentName: string;
  email: string;
  avatar?: string;
  scores: StudentScores;
  comments: string;
  testDate: string;
  classId: string;
  testType?: 'quiz' | 'midterm' | 'final' | 'assignment';
  maxScores?: StudentScores;
  gradeLevel?: string;
}

// Teaching schedule interface
export interface TeachingSchedule extends BaseEntity {
  classId: string;
  className: string;
  level: CourseLevel;
  room: string;
  timeSlot: TimeSlot;
  day: string;
  date?: string;
  studentCount: number;
  maxStudents?: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  topic?: string;
  color?: string;
  bgColor?: string;
  notes?: string;
}

// Teacher dashboard data
export interface TeacherDashboard {
  upcomingClasses: ClassSession[];
  todaysClasses: ClassSession[];
  weeklyStats: {
    totalHours: number;
    totalClasses: number;
    roomsUsed: number;
    studentsTotal: number;
  };
  recentScores?: StudentScore[];
  pendingTasks?: TeacherTask[];
  classesToday: number;
  studentsToday: number;
}

// Teacher tasks (grading, feedback, etc.)
export interface TeacherTask extends BaseEntity {
  title: string;
  description: string;
  type: 'grading' | 'feedback' | 'preparation' | 'meeting' | 'report';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  classId?: string;
  className?: string;
  studentId?: string;
  assignmentId?: string;
  estimatedTime?: number; // minutes
}

// Attendance management by teachers
export interface AttendanceEntry extends BaseEntity {
  studentId: string;
  studentName: string;
  classId: string;
  sessionId: string;
  sessionDate: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  arrivalTime?: string;
  notes?: string;
  markedBy: string; // teacher id
  markedAt: string;
}

// Assignment/Homework management
export interface TeacherAssignment extends BaseEntity {
  title: string;
  description: string;
  classId: string;
  className: string;
  teacherId: string;
  assignedDate: string;
  dueDate: string;
  maxScore: number;
  type: 'homework' | 'project' | 'essay' | 'presentation' | 'quiz';
  instructions?: string;
  attachments?: string[];
  submissions?: AssignmentSubmission[];
  status: 'draft' | 'assigned' | 'grading' | 'completed';
}

// Assignment submission
export interface AssignmentSubmission extends BaseEntity {
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  score?: number;
  feedback?: string;
  attachments?: string[];
  gradedAt?: string;
  gradedBy?: string;
}

// Lesson plan for teachers
export interface LessonPlan extends BaseEntity {
  title: string;
  classId: string;
  className: string;
  date: string;
  duration: number; // minutes
  objectives: string[];

  activities: LessonActivity[];
  homework?: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed';
}

// Lesson activity
export interface LessonActivity {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'warmup' | 'presentation' | 'practice' | 'production' | 'assessment';

  instructions?: string;
}

// Grade book for teachers
export interface GradeBook {
  classId: string;
  className: string;
  students: GradeBookStudent[];
  assignments: TeacherAssignment[];
  gradingPeriod?: {
    start: string;
    end: string;
    name: string;
  };
}

// Student in gradebook
export interface GradeBookStudent {
  studentId: string;
  studentName: string;
  scores: { [assignmentId: string]: number };
  averageScore: number;
  attendanceRate: number;
  status: UserStatus;
}
