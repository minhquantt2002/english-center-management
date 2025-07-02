// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Common types
export type UserRole = 'admin' | 'teacher' | 'student' | 'enrollment';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'graduated';
export type CourseLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'proficiency';
export type CourseStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common UI interfaces
export interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconBg: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  href?: string;
  onClick?: () => void;
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

// Contact information
export interface ContactInfo {
  name: string;
  phone: string;
  relationship: string;
}

// Address interface
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
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
