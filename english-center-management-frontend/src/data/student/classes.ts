import { StudentClass } from '../../types';

export const mockStudentClasses: StudentClass[] = [
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
    schedule: {
      days: 'Monday, Wednesday, Friday',
      time: '9:00 AM - 10:30 AM',
    },
    room: 'Room A101',
    status: 'In Progress',
    nextSession: '2024-01-22',
    sessionsCompleted: 24,
    totalSessions: 36,
    color: 'blue',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'class_2',
    name: 'Advanced Writing C1',
    level: 'advanced',
    teacher: {
      id: 'teacher_3',
      name: 'Emma Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    schedule: {
      days: 'Saturday',
      time: '10:00 AM - 1:00 PM',
    },
    room: 'Room B203',
    status: 'Completed',
    sessionsCompleted: 12,
    totalSessions: 12,
    color: 'green',
    bgColor: 'bg-green-50',
  },
];
