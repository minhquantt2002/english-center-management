import { Eye, Home, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  EnrollmentNested,
  SessionNested,
  StudentInClass,
} from '../../../../../types/teacher';
import ViewStudentModal from './view-student-modal';
import AssignStudentModal from './assign-student';
import { toast } from 'react-toastify';
import { useStaffClassroomApi } from '../../../../staff/_hooks';
import { HomeworkStatus } from '../../../_hooks/use-homework';
import { checkIsPassed } from '../../../../staff/list-classroom/[id]/page';
import { getInitials } from '../../../../staff/list-teacher/page';

interface StudentListProps {
  classroomId: string;
  sessions: SessionNested[];
  students: EnrollmentNested[];
  courseLevel?: string;
  refetchData: any;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  sessions,
  classroomId,
  courseLevel,
  refetchData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenView, setIsOpenView] = useState<StudentInClass | null>(null);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { deleteStudentFromClassroom } = useStaffClassroomApi();

  const filteredStudents = students.filter(
    (student) =>
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        deleteStudentFromClassroom(classroomId, studentId);
        toast.success('Xóa học viên thành công!');
        refetchData();
      } catch (err) {
        toast.error('Xóa học viên thất bại!');
        console.error('Failed to delete student:', err);
      }
    }
  };

  const renderStudentCard = (student: EnrollmentNested) => {
    const totalSessions = sessions.length;
    const totalAttended = sessions.filter((session) =>
      session.attendances.some(
        (att) =>
          att.student_id === student.student.id && att.is_present === true
      )
    ).length;
    const totalPassedHomework = sessions.filter((session) =>
      session.homeworks.some(
        (hw) =>
          hw.student_id === student.student.id &&
          hw.status === HomeworkStatus.PASSED
      )
    ).length;

    return (
      <div
        key={student.id}
        className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'
      >
        <div className='flex items-start space-x-3'>
          <div className='h-12 w-12 flex-shrink-0'>
            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
              {getInitials(student.student.name.charAt(0))}
            </div>
          </div>
          <div className='flex-1 min-w-0'>
            <h4 className='text-sm font-semibold text-gray-900 truncate'>
              {student.student.name}
            </h4>
            <p className='text-xs text-gray-500 truncate'>
              {student.student.email}
            </p>

            {/* Statistics Section */}
            <div className='mt-2 flex flex-col text-xs'>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='font-medium text-gray-700'>
                  Điểm danh:{' '}
                  {totalSessions > 0
                    ? Math.round((totalAttended / totalSessions) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='font-medium text-gray-700'>
                  Hoàn thành bài tập:{' '}
                  {totalSessions > 0
                    ? Math.round((totalPassedHomework / totalSessions) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className='flex items-center space-x-1'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                <span className='font-medium text-gray-700'>
                  Đầu ra:{' '}
                  {checkIsPassed(student, courseLevel) === 2
                    ? 'Đạt'
                    : checkIsPassed(student, courseLevel) === 0
                    ? 'Không đạt'
                    : 'Chưa đánh giá'}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              className='p-1 text-blue-600 hover:text-blue-400'
              onClick={() => setIsOpenView(student.student)}
            >
              <Eye className='w-4 h-4' />
            </button>

            <button
              className='p-1 text-red-600 hover:text-red-400'
              onClick={() => handleDeleteStudent(student.student.id)}
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm học viên...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
            />
          </div>
        </div>
        <button
          onClick={() => setIsOpenAdd(true)}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <Plus className='w-4 h-4 mr-2' />
          Thêm học viên
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredStudents.map(renderStudentCard)}
      </div>

      {isOpenView !== null && (
        <ViewStudentModal
          isOpen={isOpenView !== null}
          onClose={() => setIsOpenView(null)}
          studentId={isOpenView.id}
          classroomId={classroomId}
        />
      )}

      {isOpenAdd && (
        <AssignStudentModal
          isOpen={isOpenAdd}
          onClose={() => {
            setIsOpenAdd(false);
            refetchData();
          }}
          classroomId={classroomId}
        />
      )}
    </div>
  );
};

export default StudentList;
