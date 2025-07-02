import { GradeBook, GradeBookStudent } from '@/types';

export const mockGradeBookStudents: GradeBookStudent[] = [
  {
    id: 'student_1',
    name: 'Nguyễn Thị Mai',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    scores: {
      listening: 85,
      speaking: 78,
      reading: 90,
      writing: 82,
    },
    attendance: 95,
    participation: 4,
    overall: 84,
  },
  {
    id: 'student_2',
    name: 'Trần Văn Hùng',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    scores: {
      listening: 78,
      speaking: 82,
      reading: 75,
      writing: 79,
    },
    attendance: 88,
    participation: 5,
    overall: 79,
  },
  {
    id: 'student_3',
    name: 'Lê Thị Hoa',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    scores: {
      listening: 92,
      speaking: 88,
      reading: 95,
      writing: 90,
    },
    attendance: 100,
    participation: 5,
    overall: 91,
  },
];

export const mockGradeBook: GradeBook = {
  classId: 'class_1',
  className: 'English Basics A1',
  teacherId: 'teacher_1',
  students: mockGradeBookStudents,
  assignments: [],
  gradingPeriod: {
    startDate: '2024-01-15',
    endDate: '2024-03-10',
    name: 'Semester 1',
  },
  lastUpdated: '2024-01-21T15:30:00Z',
};
