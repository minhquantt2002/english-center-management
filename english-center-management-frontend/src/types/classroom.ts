import { CourseLevel } from './common';
import { UserResponse } from './user';

export enum ClassStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const courseLevels: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Cơ bản (Beginner)' },
  { value: 'elementary', label: 'Sơ cấp (Elementary)' },
  { value: 'intermediate', label: 'Trung cấp (Intermediate)' },
  {
    value: 'upper-intermediate',
    label: 'Trung cao cấp (Upper-Intermediate)',
  },
  { value: 'advanced', label: 'Cao cấp (Advanced)' },
  { value: 'proficiency', label: 'Thành thạo (Proficiency)' },
];

export const weekdayOptions = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' },
];

export interface ClassroomCreate {
  class_name: string;
  course_id: string;
  teacher_id: string;
  status?: ClassStatus;
  start_date?: string;
  end_date?: string;
  description?: string;
  room?: string;
}

export interface ClassroomUpdate extends Partial<ClassroomCreate> {}

interface ScheduleResponseInClassroom {
  id: string;
  created_at: string;
  weekday: string;
  start_time: string;
  end_time: string;
}

interface CourseResponse {
  id: string;
  created_at: string;
  course_name: string;
  description: string | null;
  level: string | null;
  price: number | null;
}

interface TeacherResponse extends UserResponse {}

export interface ClassroomResponse {
  id: string;
  created_at: string;
  course: CourseResponse;
  teacher: TeacherResponse;
  schedules: ScheduleResponseInClassroom[];

  class_name: string;
  course_id: string;
  teacher_id: string;
  room: string | null;

  status: ClassStatus;
  course_level: CourseLevel;

  start_date: string | null;
  end_date: string | null;
}
