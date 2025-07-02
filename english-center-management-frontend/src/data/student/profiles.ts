import { StudentProfile, PersonalInfo } from '@/types';

export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'student_1',
    studentId: 'ST001',
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@email.com',
    phone: '+84 987 654 321',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    dateOfBirth: '1998-03-15',
    level: 'beginner',
    currentClass: 'English Basics A1',
    enrollmentDate: '2024-01-15',
    enrollmentStatus: 'active',
    streak: 15,
    address: '123 Main Street, District 1, Ho Chi Minh City',
    emergencyContact: {
      name: 'Nguyễn Văn Nam',
      phone: '+84 123 456 789',
      relationship: 'Father',
    },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
];

export const mockPersonalInfo: PersonalInfo = {
  fullName: 'Nguyễn Thị Mai',
  dateOfBirth: '1998-03-15',
  email: 'mai.nguyen@email.com',
  phoneNumber: '+84 987 654 321',
  currentClass: 'English Basics A1',
  enrollmentStatus: 'active',
  avatar:
    'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  address: '123 Main Street, District 1, Ho Chi Minh City',
  emergencyContact: {
    name: 'Nguyễn Văn Nam',
    phone: '+84 123 456 789',
    relationship: 'Father',
  },
};
