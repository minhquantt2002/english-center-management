import React, { useState, useEffect, useMemo } from 'react';
import { EnrollmentNested } from '../../../../../types/teacher';
import { useTeacherApi } from '../../../_hooks/use-api';
import { toast } from 'react-toastify';

export const skillMapping = {
  listening: 'Nghe',
  speaking: 'Nói',
  reading: 'Đọc',
  writing: 'Viết',
};

interface StudentScore {
  id: string;
  listening: number | null;
  speaking: number | null;
  reading: number | null;
  writing: number | null;
  feedback: string;
}

const GradeManagement: React.FC<{
  isFullSkills: boolean;
  enrollments: EnrollmentNested[];
}> = ({ isFullSkills, enrollments }) => {
  const { updateScore } = useTeacherApi();
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
    new Set()
  );
  const [skills, setSkills] = useState(
    isFullSkills
      ? ['listening', 'speaking', 'reading', 'writing']
      : ['listening', 'reading']
  );

  useEffect(() => {
    const initialStudents = enrollments.map((enrollment) => ({
      id: enrollment.student.id,
      listening: enrollment.score[0]?.listening ?? null,
      speaking: enrollment.score[0]?.speaking ?? null,
      reading: enrollment.score[0]?.reading ?? null,
      writing: enrollment.score[0]?.writing ?? null,
      feedback: enrollment.score[0]?.feedback ?? '',
    }));
    setStudents(initialStudents);
  }, [enrollments]);

  // Filter students based on search term
  const filteredEnrollments = useMemo(() => {
    if (!searchTerm) return enrollments;

    return enrollments.filter((enrollment, index) => {
      const student = students[index];
      return (
        enrollment.student.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.student.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }, [enrollments, students, searchTerm]);

  // Get completion stats
  const completionStats = useMemo(() => {
    const total = students.length;
    const completed = students.filter((student) =>
      skills.every(
        (skill) => student[skill] !== null && student[skill] !== undefined
      )
    ).length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [students, skills]);

  const updateStudentScore = (
    studentIndex: number,
    skill: string,
    value: string
  ) => {
    const numValue = value === '' ? null : parseInt(value);
    if (numValue !== null && (numValue < 0 || numValue > 10)) return;

    setStudents((prev) =>
      prev.map((student, index) =>
        index === studentIndex ? { ...student, [skill]: numValue } : student
      )
    );
  };

  const updateStudentComments = (studentIndex: number, comments: string) => {
    setStudents((prev) =>
      prev.map((student, index) =>
        index === studentIndex ? { ...student, feedback: comments } : student
      )
    );
  };

  const saveStudentScore = async (studentIndex: number) => {
    try {
      setIsLoading((prev) => ({ ...prev, [studentIndex]: true }));

      const currentStudent = students[studentIndex];
      const enrollment = enrollments[studentIndex];
      const scoreId = enrollment.score[0]?.id;

      if (!scoreId) {
        toast.error('Không tìm thấy ID điểm số của học sinh');
        return;
      }

      await updateScore(scoreId, {
        writing: currentStudent.writing,
        feedback: currentStudent.feedback,
        listening: currentStudent.listening,
        reading: currentStudent.reading,
        speaking: currentStudent.speaking,
      });

      toast.success(`Cập nhật điểm thành công cho ${enrollment.student.name}!`);
    } catch (error) {
      console.error('Error saving score:', error);
      toast.error('Có lỗi xảy ra khi cập nhật điểm');
    } finally {
      setIsLoading((prev) => ({ ...prev, [studentIndex]: false }));
    }
  };

  const getStudentCompletion = (student: StudentScore) => {
    const completedSkills = skills.filter(
      (skill) => student[skill] !== null && student[skill] !== undefined
    ).length;
    return Math.round((completedSkills / skills.length) * 100);
  };

  return (
    <div className='max-w-7xl mx-auto'>
      {/* Header with stats and search */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Quản lý điểm số
            </h2>
            <p className='text-gray-600 mt-1'>
              {completionStats.completed}/{completionStats.total} học sinh đã
              hoàn thành ({completionStats.percentage}%)
            </p>
          </div>

          {/* Progress bar */}
          <div className='w-full lg:w-64'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Tiến độ chấm điểm</span>
              <span>{completionStats.percentage}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-green-500 h-2 rounded-full transition-all duration-300'
                style={{ width: `${completionStats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search and bulk actions */}
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1 relative'>
            <input
              type='text'
              placeholder='Tìm kiếm học sinh theo tên hoặc email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <svg
              className='w-5 h-5 text-gray-400 absolute left-3 top-2.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Students list */}
      <div className='space-y-4'>
        {filteredEnrollments.map((enrollment, index) => {
          const originalIndex = enrollments.findIndex(
            (e) => e.student.id === enrollment.student.id
          );
          const student = students[originalIndex];
          if (!student) return null;

          const completion = getStudentCompletion(student);
          const isSelected = selectedStudents.has(index);

          return (
            <div
              key={enrollment.student.id}
              className={`bg-white border rounded-lg shadow-sm transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                        {enrollment.student.name}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {enrollment.student.email}
                      </p>

                      {/* Completion indicator */}
                      <div className='flex items-center mt-2 space-x-2'>
                        <div className='flex-1 bg-gray-200 rounded-full h-1.5'>
                          <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              completion === 100
                                ? 'bg-green-500'
                                : completion > 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            completion === 100
                              ? 'text-green-600'
                              : completion > 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {completion}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => saveStudentScore(originalIndex)}
                    disabled={isLoading[originalIndex]}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isLoading[originalIndex]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : completion === 100
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white shadow-sm hover:shadow-md`}
                  >
                    {isLoading[originalIndex] ? (
                      <div className='flex items-center'>
                        <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2'></div>
                        Đang lưu...
                      </div>
                    ) : (
                      'Cập nhật'
                    )}
                  </button>
                </div>

                {/* Skills grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className='space-y-3'
                    >
                      <div className='flex items-center justify-between'>
                        <label className='block text-sm font-medium text-gray-700'>
                          {skillMapping[skill]}
                        </label>
                        {student[skill] !== null &&
                        student[skill] !== undefined ? (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                            <svg
                              className='w-3 h-3 mr-1'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Đã chấm
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700'>
                            <svg
                              className='w-3 h-3 mr-1'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                                clipRule='evenodd'
                              />
                            </svg>
                            Chưa chấm
                          </span>
                        )}
                      </div>

                      <div className='relative'>
                        <input
                          type='number'
                          min='0'
                          max='10'
                          step='0.1'
                          value={student[skill] ?? ''}
                          onChange={(e) =>
                            updateStudentScore(
                              originalIndex,
                              skill,
                              e.target.value
                            )
                          }
                          placeholder='0-10'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const inputs = document.querySelectorAll(
                                'input[type="number"]'
                              );
                              const currentIndex = Array.from(inputs).indexOf(
                                e.target as HTMLInputElement
                              );
                              if (currentIndex < inputs.length - 1) {
                                (
                                  inputs[currentIndex + 1] as HTMLInputElement
                                ).focus();
                              }
                            }
                          }}
                        />
                        {student[skill] !== null &&
                          student[skill] !== undefined && (
                            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>
                              /10
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comments */}
                <div className='space-y-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Nhận xét
                  </label>
                  <textarea
                    value={student.feedback}
                    onChange={(e) =>
                      updateStudentComments(originalIndex, e.target.value)
                    }
                    placeholder='Thêm nhận xét về điểm của học sinh...'
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all'
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredEnrollments.length === 0 && (
          <div className='text-center py-12'>
            <svg
              className='w-12 h-12 text-gray-400 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33'
              />
            </svg>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy học sinh
            </h3>
            <p className='text-gray-500'>
              {searchTerm
                ? `Không có học sinh nào khớp với "${searchTerm}"`
                : 'Chưa có học sinh nào trong danh sách'}
            </p>
          </div>
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
        <h4 className='text-sm font-medium text-gray-700 mb-2'>
          💡 Mẹo sử dụng:
        </h4>
        <ul className='text-sm text-gray-600 space-y-1'>
          <li>
            • Nhấn{' '}
            <kbd className='px-1 py-0.5 bg-gray-200 rounded text-xs'>Enter</kbd>{' '}
            để chuyển sang ô điểm tiếp theo
          </li>
          <li>
            • Sử dụng checkbox để chọn nhiều học sinh và cập nhật cùng lúc
          </li>
          <li>• Thanh tiến độ hiển thị % hoàn thành cho từng học sinh</li>
          <li>• Tìm kiếm theo tên hoặc email để lọc danh sách</li>
        </ul>
      </div>
    </div>
  );
};

export default GradeManagement;
