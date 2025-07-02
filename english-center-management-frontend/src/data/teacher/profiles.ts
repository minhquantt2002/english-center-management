import { TeacherProfile } from '@/types';

export const mockTeacherProfiles: TeacherProfile[] = [
  {
    id: 'teacher_1',
    teacherId: 'T001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@zenlish.com',
    phone: '+1 (555) 123-4567',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    specialization: 'English Grammar Specialist',
    qualification: 'TESOL Certificate',
    experience: 5,
    hourlyRate: 25,
    status: 'active',
    joinDate: '2023-01-15',
    bio: 'Experienced English teacher specializing in grammar and foundational skills.',
    languages: ['English', 'Vietnamese'],
    certifications: ['TESOL Certificate', 'ESL Teaching Certificate'],
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'teacher_2',
    teacherId: 'T002',
    name: 'Michael Chen',
    email: 'michael.chen@zenlish.com',
    phone: '+1 (555) 234-5678',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    specialization: 'Conversation Expert',
    qualification: 'CELTA Certificate',
    experience: 8,
    hourlyRate: 30,
    status: 'active',
    joinDate: '2023-02-01',
    bio: 'Native English speaker with expertise in conversation and business English.',
    languages: ['English', 'Mandarin'],
    certifications: ['CELTA Certificate', 'Business English Certificate'],
    createdAt: '2023-02-01T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
];
