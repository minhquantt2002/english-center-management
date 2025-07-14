import { BaseEntity, CourseLevel, TimeSlot, DayOfWeek } from './common';

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

// Staff interface
export interface Staff extends BaseEntity {
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

// Staff statistics for dashboard
export interface StaffStats {
  newRegistrations: number;
  activeClasses: number;
  todaySchedule: number;
  pendingInvoices: number;
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

// Room management for Staff
export interface Room extends BaseEntity {
  name: string;
  capacity: number;
  location?: string;
  equipment?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  type: 'classroom' | 'lab' | 'auditorium' | 'online';
}

// Invoice for Staff fees
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
