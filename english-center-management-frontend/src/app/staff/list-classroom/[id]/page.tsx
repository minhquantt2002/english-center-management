'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Search,
  Plus,
  Trash2,
  Eye,
  BookOpen,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useStaffClassroomApi } from '../../_hooks';
import AssignStudentModal from './_components/assign-student';
import ViewStudentModal from './_components/view-student';
import EditStudentModal from './_components/edit-student';
import StudyingScheduleModal from './_components/studying-schedule';
import EditClassroomInfoModal from './_components/edit-classroom-info';
import {
  ClassroomResponse,
  EnrollmentNested,
  StudentResponse,
} from '../../../../types/staff';
import { toast } from 'react-toastify';
import { HomeworkStatus } from '../../../teacher/_hooks/use-homework';
import { getInitials } from '../../list-teacher/page';

export const checkIsPassed = (enrollment: any, courseLevel: string) => {
  let rangeScore = 0;
  let isSW = true;
  if (courseLevel === 'C1') {
    rangeScore = 250;
  } else {
    isSW = false;
    if (courseLevel === 'A1') {
      rangeScore = 150;
    } else if (courseLevel === 'A2') {
      rangeScore = 350;
    } else if (courseLevel === 'B1') {
      rangeScore = 600;
    } else if (courseLevel === 'B2') {
      rangeScore = 750;
    }
  }
  if (enrollment?.score.length > 0) {
    if (isSW) {
      if (
        enrollment?.score[0].speaking !== null &&
        enrollment?.score[0].writing !== null
      ) {
        if (
          enrollment?.score[0].speaking + enrollment?.score[0].writing >=
          rangeScore
        ) {
          return 2;
        }
      } else {
        return 1;
      }
    } else {
      if (
        enrollment?.score[0].listening !== null &&
        enrollment?.score[0].reading !== null
      ) {
        if (
          enrollment?.score[0].listening + enrollment?.score[0].reading >=
          rangeScore
        ) {
          return 2;
        }
      } else {
        return 1;
      }
    }
  }
  return 0;
};

export function formatDays(days: string[]) {
  const mapDays: Record<string, string> = {
    monday: '2',
    tuesday: '3',
    wednesday: '4',
    thursday: '5',
    friday: '6',
    saturday: '7',
    sunday: 'CN',
  };

  const orderDays: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const unique = Array.from(new Set(days));

  const sorted = [...unique].sort((a, b) => orderDays[a] - orderDays[b]);

  const formatted = sorted.map((d) => mapDays[d]);
  if (formatted.length > 0) {
    formatted[0] = 'Thứ ' + formatted[0];
  }

  return formatted.join(', ');
}

export default function ClassroomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;
  const {
    loading: classroomLoading,
    getClassroomById,
    deleteClassroom,
    deleteStudentFromClassroom,
  } = useStaffClassroomApi();

  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [students, setStudents] = useState<EnrollmentNested[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isEditClassroomModalOpen, setIsEditClassroomModalOpen] =
    useState(false);

  const loadData = async () => {
    try {
      const classroomData = await getClassroomById(classroomId);
      setClassroom(classroomData);
      setStudents(classroomData.enrollments);
    } catch (err) {
      console.error('Error loading classroom data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students.filter((student) => {
    if (!student) return false;
    const matchesSearch =
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSaveStudent = (updatedStudent: StudentResponse) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.student.id === updatedStudent.id
          ? { ...student, student: updatedStudent }
          : student
      )
    );
  };

  const handleSaveClassroom = (updatedClassroom: ClassroomResponse) => {
    setClassroom(updatedClassroom);
    // In a real app, you would make an API call here to save the changes
    console.log('Classroom updated:', updatedClassroom);
  };

  const handleDeleteClassroom = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await deleteClassroom(classroomId);
        toast.success('Xóa lớp học thành công!');
        router.push('/staff/list-classroom');
      } catch (err) {
        toast.error('Xóa lớp học thất bại!');
        console.error('Failed to delete classroom:', err);
      }
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        deleteStudentFromClassroom(classroomId, studentId);
        toast.success('Xóa học viên thành công!');
        loadData();
      } catch (err) {
        toast.error('Xóa học viên thất bại!');
        console.error('Failed to delete student:', err);
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-red-100 text-red-800 font-semibold';
      case 'A2':
        return 'bg-orange-100 text-orange-800 font-semibold';
      case 'B1':
        return 'bg-yellow-100 text-yellow-800 font-semibold';
      case 'B2':
        return 'bg-blue-100 text-blue-800 font-semibold';
      case 'C1':
        return 'bg-purple-100 text-purple-800 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 font-semibold';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'A1':
        return 'A1 - Mất gốc';
      case 'A2':
        return 'A2 - Sơ cấp';
      case 'B1':
        return 'B1 - Trung cấp thấp';
      case 'B2':
        return 'B2 - Trung cấp cao';
      case 'C1':
        return 'C1 - Nâng cao';
      default:
        return level;
    }
  };

  if (classroomLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Đang tải thông tin lớp...</p>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Không tìm thấy lớp
          </h2>
          <p className='text-gray-600 mb-6'>
            Lớp bạn đang tìm kiếm không tồn tại.
          </p>
          <button
            onClick={() => router.back()}
            className='bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const totalSessions = classroom?.sessions?.length;

  const totalAttendance = classroom?.sessions?.reduce((acc, session) => {
    return (
      acc +
      (session.attendances.filter((att) => att.is_present === true).length || 0)
    );
  }, 0);

  const totalPassed = classroom?.sessions?.reduce((acc, session) => {
    return (
      acc +
      (session.homeworks.filter((e) => e.status === HomeworkStatus.PASSED)
        .length || 0)
    );
  }, 0);

  const totalHomeworks = classroom?.sessions?.reduce((acc, session) => {
    return acc + (session.homeworks.length || 0);
  }, 0);

  const attendanceRate =
    totalSessions > 0
      ? (totalAttendance / (totalSessions * classroom?.enrollments?.length)) *
        100
      : 0;
  const homeworkPassRate =
    totalHomeworks > 0 ? (totalPassed / totalHomeworks) * 100 : 0;

  return (
    <>
      <main>
        {/* Header */}
        <div className='mb-4'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative'>
            <div className='flex items-center justify-between mb-4'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {classroom.class_name}
              </h1>
              <div className='flex items-center space-x-3'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    classroom.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : classroom.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {classroom.status === 'active'
                    ? 'Đang hoạt động'
                    : classroom.status === 'cancelled'
                    ? 'Đã huỷ'
                    : 'Đã hoàn thành'}
                </span>
                <button
                  onClick={handleDeleteClassroom}
                  className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  title='Chỉnh sửa thông tin lớp học'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Main classroom info grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
              <div className='flex items-center space-x-3'>
                <User className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Giáo viên</p>
                  <p className='font-medium text-gray-900'>
                    {classroom.teacher.name}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Calendar className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Lịch học</p>
                  <p className='font-medium text-gray-900'>
                    {formatDays(classroom.schedules.map((v) => v.weekday))}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <MapPin className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Phòng học</p>
                  <p className='font-medium text-gray-900'>
                    {classroom.room || 'Chưa phân công'}
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Users className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Sĩ số</p>
                  <p className='font-medium text-gray-900'>
                    {classroom.enrollments.length} học viên
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics section */}
            <div className='border-t border-gray-200 pt-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
                {/* Attendance Rate */}
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <CheckCircle className='w-5 h-5 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Tỷ lệ điểm danh</p>
                    <p className='font-semibold text-lg text-gray-900'>
                      {attendanceRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Homework Pass Rate */}
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <BookOpen className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Tỷ lệ hoàn thành BT</p>
                    <p className='font-semibold text-lg text-gray-900'>
                      {homeworkPassRate.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Total Sessions */}
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <Clock className='w-5 h-5 text-purple-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-600'>Tổng buổi học</p>
                    <p className='font-semibold text-lg text-gray-900'>
                      {totalSessions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Section */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Danh sách học viên ({filteredStudents.length})
              </h2>
              <div className='flex items-center space-x-3'>
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                >
                  <Calendar className='w-4 h-4' />
                  <span>Lịch học</span>
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className='bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                  <span>Thêm học viên</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Tìm kiếm học viên...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                />
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Học viên
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trình độ
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Liên hệ
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ngày nhập học
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    % Tham gia lớp
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    % Đạt bài tập
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Đầu ra
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-12 text-center text-gray-500'
                    >
                      <Users className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                      <p className='text-lg font-medium'>
                        Không có học viên nào
                      </p>
                      <p className='text-sm'>Hãy thêm học viên vào lớp này</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((enrollment) => {
                    const student = enrollment.student;
                    const totalSessions = classroom?.sessions.length;
                    const totalAttended = classroom?.sessions.filter(
                      (session) =>
                        session.attendances.some(
                          (att) =>
                            att.student_id === student.id &&
                            att.is_present === true
                        )
                    ).length;
                    const totalPassedHomework = classroom?.sessions.filter(
                      (session) =>
                        session.homeworks.some(
                          (hw) =>
                            hw.student_id === student.id &&
                            hw.status === HomeworkStatus.PASSED
                        )
                    ).length;

                    return (
                      <tr
                        key={student.id}
                        className='hover:bg-gray-50'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='h-8 w-8 flex-shrink-0'>
                              <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                                {getInitials(student.name.charAt(0))}
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {student.name}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {student.email}
                              </div>
                              <div className='text-sm text-gray-500'>
                                #{student.id.substring(0, 5)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
                              student.input_level
                            )}`}
                          >
                            {getLevelText(student.input_level)}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm text-gray-900'>
                            <div className='flex items-center space-x-1'>
                              <Phone className='w-3 h-3 text-gray-400' />
                              <span>{student.phone_number}</span>
                            </div>
                            {student.parent_phone && (
                              <div className='flex items-center space-x-1 mt-1'>
                                <Mail className='w-3 h-3 text-gray-400' />
                                <span className='text-xs text-gray-500'>
                                  PH: {student.parent_phone}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {new Date(student.created_at).toLocaleDateString(
                            'vi-VN'
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {totalSessions > 0
                            ? Math.round((totalAttended / totalSessions) * 100)
                            : 0}
                          %
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {totalSessions > 0
                            ? Math.round(
                                (totalPassedHomework / totalSessions) * 100
                              )
                            : 0}
                          %
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {checkIsPassed(enrollment, classroom.course_level) ===
                          2 ? (
                            <div className='text-green-600 font-semibold p-2 bg-green-50 text-center rounded-full'>
                              Đạt
                            </div>
                          ) : checkIsPassed(
                              enrollment,
                              classroom.course_level
                            ) === 0 ? (
                            <div className='text-red-600 font-semibold p-2 bg-red-50 text-center rounded-full'>
                              Không đạt
                            </div>
                          ) : (
                            <div className='text-yellow-600 font-semibold p-2 bg-yellow-50 text-center rounded-full'>
                              Chưa đánh giá
                            </div>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex items-center space-x-2'>
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsViewModalOpen(true);
                              }}
                              className='text-cyan-600 hover:text-cyan-800 transition-colors'
                            >
                              <Eye className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className='text-red-600 hover:text-red-800 transition-colors'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Assign Student Modal */}
      {isCreateModalOpen && (
        <AssignStudentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          refetch={loadData}
          classroomId={classroom.id}
          classroomName={classroom?.class_name || ''}
          existingStudentIds={students.map((student) => student?.id)}
        />
      )}
      {/* Edit Student Modal */}
      {isEditModalOpen && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSave={handleSaveStudent}
        />
      )}
      {/* View Student Modal */}
      {isViewModalOpen && (
        <ViewStudentModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedStudent(null);
          }}
          studentId={selectedStudent.id}
          classroomId={classroom.id}
        />
      )}

      {isScheduleModalOpen && (
        <StudyingScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          refetch={loadData}
          classroom={classroom}
        />
      )}

      {/* Edit Classroom Info Modal */}
      {isEditClassroomModalOpen && (
        <EditClassroomInfoModal
          isOpen={isEditClassroomModalOpen}
          onClose={() => setIsEditClassroomModalOpen(false)}
          classroom={classroom}
          onSave={handleSaveClassroom}
        />
      )}
    </>
  );
}
