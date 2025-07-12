import { ClassData } from '@/types';

export const mockClasses: ClassData[] = [
  {
    id: 'class_1',
    name: 'Tiếng Anh Cơ Bản A1',
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
    room: 'Phòng A101',
    courseId: 'course_1',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_2',
    name: 'Ngữ Pháp Cơ Bản',
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
    room: 'Phòng C303',
    courseId: 'course_1',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_3',
    name: 'Kỹ Năng Giao Tiếp B1',
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
    room: 'Phòng B205',
    courseId: 'course_4',
    status: 'active',
    createdAt: '2024-01-22T08:00:00Z',
    updatedAt: '2024-01-22T08:00:00Z',
  },
  {
    id: 'class_4',
    name: 'Tiếng Anh 201 - Trung Cấp',
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
    room: 'Phòng A101',
    courseId: 'course_4',
    status: 'active',
    createdAt: '2024-01-12T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_5',
    name: 'Viết Nâng Cao C1',
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
    room: 'Phòng B203',
    courseId: 'course_3',
    status: 'inactive',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'class_6',
    name: 'Tiếng Anh Thương Mại B2',
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
    room: 'Phòng A201',
    courseId: 'course_2',
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'class_7',
    name: 'Luyện Thi IELTS',
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
    room: 'Phòng B105',
    courseId: 'course_5',
    status: 'active',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-01T08:00:00Z',
  },
];
