// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Common types
export type UserRole = 'admin' | 'teacher' | 'student' | 'staff';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'graduated';
export type CourseLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'proficiency';
export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

// Common UI interfaces
export interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconBg: string;
}

// Time and Schedule common types
export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DayOfWeek {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

// System status interface
export interface SystemStatus {
  service: string;
  status: string;
  statusColor: string;
  lastChecked?: string;
}

// Common filter interfaces
export interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
}
