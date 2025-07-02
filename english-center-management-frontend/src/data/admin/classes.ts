import { ClassData } from '@/types';

export const mockClasses: ClassData[] = [
  {
    id: 'class_1',
    name: 'English Basics A1',
    level: 'beginner',
    teacher: {
      id: 'teacher_1',
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    students: 24,
    maxStudents: 25,
    schedule: {
      days: 'Mon, Wed, Fri',
      time: '9:00 AM - 10:30 AM',
    },
    room: 'Room A101',
    courseId: 'course_1',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_2',
    name: 'Grammar Fundamentals',
    level: 'beginner',
    teacher: {
      id: 'teacher_1',
      name: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    students: 18,
    maxStudents: 20,
    schedule: {
      days: 'Mon, Thu',
      time: '10:00 AM - 11:30 AM',
    },
    room: 'Room C303',
    courseId: 'course_1',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_3',
    name: 'Conversation Skills B1',
    level: 'intermediate',
    teacher: {
      id: 'teacher_2',
      name: 'Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    students: 18,
    maxStudents: 20,
    schedule: {
      days: 'Tue, Thu',
      time: '2:00 PM - 4:00 PM',
    },
    room: 'Room B205',
    courseId: 'course_4',
    status: 'active',
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
  },
  {
    id: 'class_4',
    name: 'English 201 - Intermediate',
    level: 'intermediate',
    teacher: {
      id: 'teacher_2',
      name: 'Michael Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    students: 15,
    maxStudents: 18,
    schedule: {
      days: 'Mon, Wed, Fri',
      time: '3:00 PM - 4:30 PM',
    },
    room: 'Room A101',
    courseId: 'course_4',
    status: 'active',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_5',
    name: 'Advanced Writing C1',
    level: 'advanced',
    teacher: {
      id: 'teacher_3',
      name: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    students: 12,
    maxStudents: 15,
    schedule: {
      days: 'Saturday',
      time: '10:00 AM - 1:00 PM',
    },
    room: 'Room B203',
    courseId: 'course_3',
    status: 'inactive',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_6',
    name: 'Business English B2',
    level: 'intermediate',
    teacher: {
      id: 'teacher_4',
      name: 'David Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    students: 14,
    maxStudents: 15,
    schedule: {
      days: 'Tue, Thu',
      time: '6:00 PM - 7:30 PM',
    },
    room: 'Room A201',
    courseId: 'course_2',
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'class_7',
    name: 'IELTS Preparation',
    level: 'upper-intermediate',
    teacher: {
      id: 'teacher_3',
      name: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    students: 16,
    maxStudents: 18,
    schedule: {
      days: 'Mon, Wed, Fri',
      time: '2:00 PM - 4:00 PM',
    },
    room: 'Room B105',
    courseId: 'course_5',
    status: 'active',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
];
