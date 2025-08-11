// Staff specific types based on backend schemas
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
export type AchievementType =
  | 'academic'
  | 'participation'
  | 'leadership'
  | 'other';

export type UserRole = 'admin' | 'staff' | 'teacher' | 'student';
export type StudentStatus = 'active' | 'inactive' | 'suspended' | 'graduated';
export type ClassStatus = 'active' | 'completed' | 'cancelled';
export type CourseLevel =
  | 'beginner'
  | 'elementary'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'proficiency';

// ==================== STUDENT MANAGEMENT ====================
export interface StudentCreate {
  name: string;
  email: string;
  password: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  role_name: UserRole;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  status?: StudentStatus;
}

export interface StudentUpdate {
  name?: string;
  email?: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status?: StudentStatus;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
}

export interface StudentResponse {
  id: string;
  name: string;
  email: string;
  input_level?: string;
  parent_name?: string;
  parent_phone?: string;
  status: StudentStatus;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  created_at: string;
  enrollments?: EnrollmentNested[];
  scores?: ScoreNested[];
  received_feedbacks?: FeedbackNested[];
}

// ==================== TEACHER MANAGEMENT ====================
export interface TeacherResponse {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  address?: string;
  education?: string;
  experience_years?: number;
  bio?: string;
  date_of_birth?: string;
  phone_number?: string;
  created_at: string;
  taught_classes?: ClassroomNested[];
  given_feedbacks?: FeedbackNested[];
}

// ==================== COURSE MANAGEMENT ====================
export interface CourseResponse {
  id: string;
  course_name: string;
  description?: string;
  level?: string;
  total_weeks?: number;
  price?: number;
  created_at: string;
  classes?: ClassroomNested[];
}

// ==================== CLASSROOM MANAGEMENT ====================
export interface ClassroomCreate {
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level?: CourseLevel;
  status?: ClassStatus;
  start_date?: string;
  end_date?: string;
}

export interface ClassroomUpdate {
  class_name?: string;
  course_id?: string;
  teacher_id?: string;
  room?: string;
  course_level?: CourseLevel;
  status?: ClassStatus;
  start_date?: string;
  end_date?: string;
}

export interface ClassroomResponse {
  id: string;
  class_name: string;
  course_id: string;
  teacher_id: string;
  room?: string;
  course_level: CourseLevel;
  status: ClassStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  course?: CourseNested;
  teacher?: TeacherNested;
  enrollments?: EnrollmentNested[];
  exams?: ExamNested[];
  feedbacks?: FeedbackNested[];
  schedules?: ScheduleNested[];
}

// ==================== SCHEDULE MANAGEMENT ====================
export interface ScheduleCreate {
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
}

export interface ScheduleUpdate {
  class_id?: string;
  weekday?: Weekday;
  start_time?: string;
  end_time?: string;
}

export interface ScheduleResponse {
  id: string;
  class_id: string;
  weekday: Weekday;
  start_time: string;
  end_time: string;
  classroom?: ClassroomNested;
}

// ==================== INVOICE MANAGEMENT ====================
export interface InvoiceCreate {
  student_id: string;
  amount: number;
  description: string;
  due_date: string;
  status: InvoiceStatus;
}

export interface InvoiceUpdate {
  student_id?: string;
  amount?: number;
  description?: string;
  due_date?: string;
  status?: InvoiceStatus;
}

export interface InvoiceResponse {
  id: string;
  student_id: string;
  amount: number;
  description: string;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  student?: StudentNested;
}

// ==================== STATS MANAGEMENT ====================
export interface StaffStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalClasses: number;
  totalEnrollments: number;
  recentEnrollments: RecentEnrollment[];
}

export interface RecentEnrollment {
  id: string;
  student_name: string;
  class_name: string;
  enrollment_date: string;
}

// ==================== ACHIEVEMENT TYPES ====================
export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  achieved_date: string;
  type: AchievementType;
}

// ==================== API RESPONSE TYPES ====================
export interface StudentAchievementsResponse {
  achievements: StudentAchievement[];
}

export interface StudentInvoicesResponse {
  invoices: InvoiceResponse[];
}

export interface TeacherScheduleResponse {
  schedule: ScheduleResponse[];
}

export interface ClassroomStudentsResponse {
  students: StudentResponse[];
}

export interface ClassroomSchedulesResponse {
  schedules: ScheduleResponse[];
}

export interface AllInvoicesResponse {
  invoices: InvoiceResponse[];
}

export interface RoomsResponse {
  rooms: string[];
}

export interface InvoiceCreateResponse {
  message: string;
}

export interface AssignStudentResponse {
  message: string;
}

export interface AssignMultipleStudentsResponse {
  message: string;
}

export interface DeleteScheduleResponse {
  message: string;
}

// ==================== QUERY PARAMETERS ====================
export interface GetStudentsQuery {
  status?: StudentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetClassroomsQuery {
  course_id?: string;
  teacher_id?: string;
  status?: ClassStatus;
}

export interface GetSchedulesQuery {
  classroom_id?: string;
  teacher_id?: string;
  weekday?: Weekday;
}

export interface GetInvoicesQuery {
  student_id?: string;
  status?: InvoiceStatus;
  page?: number;
  limit?: number;
}

// ==================== REQUEST BODY TYPES ====================
export interface AssignStudentToClassroomRequest {
  studentId: string;
}

export interface AssignMultipleStudentsToClassroomRequest {
  studentIds: string[];
}

export interface CreateInvoiceRequest {
  student_id: string;
  amount: number;
  description: string;
  due_date: string;
  status: InvoiceStatus;
}

// ==================== NESTED SCHEMAS ====================
export interface StudentNested {
  id: string;
  name: string;
  email: string;
}

export interface TeacherNested {
  id: string;
  name: string;
  email: string;
}

export interface CourseNested {
  id: string;
  course_name: string;
  level?: string;
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
  class_id?: string;
  classroom: ClassroomNested;
}

export interface ExamBase {
  exam_name: string;
  class_id: string;
  exam_date?: string;
  description?: string;
  duration?: number;
  total_points?: number;
  exam_type?: string;
}

export interface ScoreNested {
  id: string;
  total_score?: number;
  grade?: string;

  listening?: number;
  reading?: number;
  speaking?: number;
  writing?: number;

  exam?: ExamBase;
}

export interface FeedbackNested {
  id: string;
  content?: string;
  rating?: number;
  feedback_type?: string;
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
