// Student hooks
export { useStaffStudentApi } from './use-student';

// Teacher hooks
export { useStaffTeacherApi } from './use-teacher';

// Course hooks
export { useStaffCourseApi } from './use-course';

// Classroom hooks
export { useStaffClassroomApi } from './use-classroom';

// Invoice hooks
export { useStaffInvoiceApi } from './use-invoice';
export type { CreateInvoiceData } from './use-invoice';

// Schedule hooks
export { useStaffScheduleApi } from './use-schedule';
export type {
  ScheduleSession,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleApiResponse,
  RoomApiResponse,
  TeacherApiResponse,
} from './use-schedule';

// Stats and Room hooks
export { useStaffStatsApi } from './use-stats';
