import {
  BaseEntity,
  CourseLevel,
  TimeSlot,
  DayOfWeek,
  BaseFilters,
} from './common';

// Student form data for enrollment
export interface StudentFormData {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  level: string;
  notes: string;
  address?: string;
  parentContact?: string;
}

// Schedule form data for creating class schedules
export interface ScheduleFormData {
  className: string;
  startDate: string;
  sessionsPerWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  selectedDays: {
    [key: string]: boolean;
  };
}

// Schedule interfaces
export interface Schedule extends BaseEntity {
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  room: string;
  timeSlot: TimeSlot;
  daysOfWeek: DayOfWeek;
  startDate: string;
  endDate?: string;
  sessionsPerWeek: number;
  color?: string;
  bgColor?: string;
}

// Enrollment interface
export interface Enrollment extends BaseEntity {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  classId?: string;
  enrollmentDate: string;
  status: 'pending' | 'active' | 'completed' | 'dropped';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  fees: {
    total: number;
    paid: number;
    remaining: number;
  };
  level: CourseLevel;
  startDate?: string;
  endDate?: string;
}

// Enrollment statistics for dashboard
export interface EnrollmentStats {
  newRegistrations: number;
  activeClasses: number;
  todaySchedule: number;
  weeklyRegistrations: Array<{
    day: string;
    value: number;
  }>;
  recentRegistrations: Array<{
    name: string;
    level: string;
    status: string;
    statusColor: string;
    avatar: string;
  }>;
  todayScheduleDetails: Array<{
    time: string;
    class: string;
    teacher: string;
    room: string;
    status: string;
    statusColor: string;
  }>;
}

// Class assignment for enrollment
export interface ClassAssignment extends BaseEntity {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  assignmentDate: string;
  status: 'active' | 'completed' | 'transferred' | 'dropped';
  assignedBy: string; // user id who made the assignment
}

// Room management for enrollment
export interface Room extends BaseEntity {
  name: string;
  capacity: number;
  location?: string;
  equipment?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  type: 'classroom' | 'lab' | 'auditorium' | 'online';
}

// Invoice for enrollment fees
export interface Invoice extends BaseEntity {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'online';
  paidAt?: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  notes?: string;
  invoiceNumber: string;
  createdBy: string;
}

// Payment record
export interface Payment extends BaseEntity {
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'online';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  processedBy: string; // user id who processed the payment
}

// Enrollment filters
export interface EnrollmentFilters extends BaseFilters {
  status?: Enrollment['status'];
  paymentStatus?: Enrollment['paymentStatus'];
  level?: CourseLevel;
  dateFrom?: string;
  dateTo?: string;
  course?: string;
}

export interface ScheduleFilters extends BaseFilters {
  teacher?: string;
  room?: string;
  day?: string;
  timeSlot?: string;
  status?: 'active' | 'inactive';
}

// Waitlist management
export interface Waitlist extends BaseEntity {
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  requestedLevel: CourseLevel;
  priority: number;
  requestDate: string;
  status: 'waiting' | 'offered' | 'enrolled' | 'expired';
  notes?: string;
}

// Class capacity and availability
export interface ClassCapacity {
  classId: string;
  className: string;
  maxCapacity: number;
  currentEnrollment: number;
  availableSpots: number;
  waitlistCount: number;
  status: 'available' | 'full' | 'closed';
}
