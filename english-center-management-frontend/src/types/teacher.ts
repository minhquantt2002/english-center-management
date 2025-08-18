// Teacher specific types based on backend schemas
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Teacher specific interfaces
export interface TeacherBase {
  name: string;
  email: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
}

export interface TeacherResponse extends TeacherBase {
  id: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
  given_feedbacks?: FeedbackNested[];
}

// Student in class
export interface StudentInClass {
  id: string;
  name: string;
  email: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
  enrollment_date: string;
  attendance_records?: AttendanceEntry[];
  scores?: ScoreData[];
}

// Attendance types
export interface AttendanceData {
  date: string;
  attendance_records: AttendanceEntry[];
}

export interface AttendanceEntry {
  student_id: string;
  student_name: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

// Grade types
export interface GradeBook {
  class_id: string;
  class_name: string;
  students: StudentScore[];
  exams: ExamNested[];
}

export interface ScoreData {
  student_id: string;
  exam_id: string;
  listening?: number;
  reading?: number;
  speaking?: number;
  writing?: number;
  total_score?: number;
  grade?: string;
  comments?: string;
}

export interface StudentScore {
  id: string;
  student_id: string;
  student_name: string;
  exam_id: string;
  exam_name: string;
  listening?: number;
  reading?: number;
  speaking?: number;
  writing?: number;
  total_score?: number;
  grade?: string;
  comments?: string;
  created_at: string;
}

export interface GradesData {
  scores: ScoreData[];
}

// Schedule types
export interface ScheduleData {
  id: string;
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  classroom?: ClassroomNested;
}

export interface TeachingSchedule {
  teacher_id: string;
  teacher_name: string;
  schedules: ScheduleData[];
}

export interface ClassSession {
  id: string;
  class_name: string;
  course_name: string;
  room?: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  date: string;
}

export interface ClassDetails {
  id: string;
  class_name: string;
  course: CourseNested;
  teacher: TeacherNested;
  room?: string;
  course_level:
    | 'beginner'
    | 'elementary'
    | 'intermediate'
    | 'upper-intermediate'
    | 'advanced'
    | 'proficiency';
  status: 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  created_at: string;
  enrollments: EnrollmentNested[];
  exams: ExamNested[];
  feedbacks: FeedbackNested[];
  schedules: ScheduleNested[];
}

// Dashboard types
export interface TeacherDashboard {
  teacher_id: string;
  teacher_name: string;
  total_classes: number;
  total_students: number;
  today_schedules: ScheduleData[];
  upcoming_classes: ClassDetails[];
  recent_activities: any[];
}

// Query parameters
export interface TeacherClassesParams {
  status?: 'active' | 'completed' | 'cancelled';
  course_id?: string;
}

export interface TeacherScheduleParams {
  weekday?: Weekday;
  start_date?: string;
  end_date?: string;
}

export interface TeacherClassesResponse {
  classes: ClassDetails[];
  total: number;
}

export interface TeacherScheduleResponse {
  schedules: ScheduleData[];
  total: number;
}

export interface TeacherClassroomResponse extends ClassDetails {}

// Nested schemas for teacher
export interface CourseNested {
  id: string;
  course_name: string;
  level?: string;
}

export interface TeacherNested {
  id: string;
  name: string;
  email: string;
}

export interface ClassroomNested {
  id: string;
  class_name: string;
  room?: string;
}

export interface EnrollmentNested {
  id: string;
  enrollment_at: string;
  status: string;
  student: StudentInClass;
}

export interface FeedbackNested {
  id: string;
  content?: string;
  rating?: number;
}

export interface ExamNested {
  id: string;
  exam_name: string;
  exam_date?: string;
}

export interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}
