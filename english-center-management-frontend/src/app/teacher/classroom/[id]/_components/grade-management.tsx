import React, { useState, useEffect } from 'react';
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
  enrollments: EnrollmentNested[];
}> = ({ enrollments }) => {
  const { updateScore } = useTeacherApi();
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

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

  const updateStudentScore = (
    studentIndex: number,
    skill: 'listening' | 'speaking' | 'reading' | 'writing',
    value: string
  ) => {
    const numValue = value === '' ? null : parseInt(value);
    if (numValue !== null && (numValue < 0 || numValue > 100)) return;

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
        console.error('No score ID found for student');
        return;
      }

      await updateScore(scoreId, {
        writing: currentStudent.writing,
        feedback: currentStudent.feedback,
        listening: currentStudent.listening,
        reading: currentStudent.reading,
        speaking: currentStudent.speaking,
      });

      toast('Cập nhật thành công!');

      // Optionally show success message
      console.log(`Score saved for ${enrollment.student.name}`);
    } catch (error) {
      console.error('Error saving score:', error);
      // Optionally show error message to user
    } finally {
      setIsLoading((prev) => ({ ...prev, [studentIndex]: false }));
    }
  };

  return (
    <div>
      <div className='space-y-6'>
        {enrollments.map((enrollment, index) => {
          const student = students[index];
          if (!student) return null;

          return (
            <div
              key={enrollment.student.id}
              className='bg-white border-b border-blue-300 p-4 rounded-lg shadow-sm'
            >
              <div className='flex justify-between items-center mb-6'>
                <div className='flex items-center space-x-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {enrollment.student.name}
                    </h3>
                    <p className='text-gray-600'>{enrollment.student.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => saveStudentScore(index)}
                  disabled={isLoading[index]}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLoading[index]
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {isLoading[index] ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
                {(['listening', 'speaking', 'reading', 'writing'] as const).map(
                  (skill) => (
                    <div key={skill} className='space-y-2'>
                      <label className='block text-sm font-medium text-gray-700'>
                        {skillMapping[skill]}
                      </label>
                      <div className='relative'>
                        <input
                          type='number'
                          min='0'
                          max='10'
                          value={student[skill] ?? ''}
                          onChange={(e) =>
                            updateStudentScore(index, skill, e.target.value)
                          }
                          placeholder='0-100'
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                        {student[skill] !== null && (
                          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>
                            /100
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Comments */}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Nhận xét
                </label>
                <textarea
                  value={student.feedback}
                  onChange={(e) => updateStudentComments(index, e.target.value)}
                  placeholder='Thêm nhận xét về điểm của học sinh...'
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GradeManagement;
