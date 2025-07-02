'use client';

import React, { useState } from 'react';
import { Filter, Save } from 'lucide-react';
import { mockStudents, mockClasses } from '../../../data';
import { Student as StudentType } from '../../../types';

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  avatar: string;
  scores: {
    listening: string;
    speaking: string;
    reading: string;
    writing: string;
  };
  comments: string;
}

const ClassScoreEntry: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>(
    mockClasses[0]?.name || 'English 201 - Intermediate'
  );

  // Use mock students data
  const [students, setStudents] = useState<Student[]>(
    mockStudents.slice(0, 2).map((student: StudentType, index: number) => ({
      id: student.id,
      name: student.name,
      studentId: student.id,
      email: student.email,
      avatar: student.avatar || '',
      scores: {
        listening: index === 0 ? '85' : '',
        speaking: index === 0 ? '78' : '',
        reading: index === 0 ? '92' : '',
        writing: index === 0 ? '80' : '',
      },
      comments:
        index === 0
          ? 'Strong performance in reading comprehension. Needs improvement in speaking fluency.'
          : '',
    }))
  );

  const updateStudentScore = (
    studentId: string,
    skill: keyof Student['scores'],
    value: string
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, scores: { ...student.scores, [skill]: value } }
          : student
      )
    );
  };

  const updateStudentComments = (studentId: string, comments: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, comments } : student
      )
    );
  };

  const saveStudentScores = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    console.log('Saving scores for:', student);
  };

  const saveAllScores = () => {
    console.log('Saving all scores:', students);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
              Chọn lớp học
            </h1>
            <p className='text-gray-500'>
              Chọn một lớp để nhập điểm cho học viên
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
            >
              {mockClasses.map((classItem) => (
                <option key={classItem.id} value={classItem.name}>
                  {classItem.name}
                </option>
              ))}
            </select>
            <button className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'>
              <Filter className='w-4 h-4 mr-2' />
              Lọc
            </button>
          </div>
        </div>

        {/* Class Info */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              {selectedClass}
            </h2>
            <p className='text-gray-500'>
              {students.length} học viên • Bài kiểm tra: Đánh giá giữa kỳ
            </p>
          </div>
          <button
            onClick={saveAllScores}
            className='inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors'
          >
            <Save className='w-4 h-4 mr-2' />
            Lưu tất cả điểm
          </button>
        </div>

        {/* Students List */}
        <div className='space-y-6'>
          {students.map((student) => (
            <div
              key={student.id}
              className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
            >
              {/* Student Header */}
              <div className='flex justify-between items-start mb-6'>
                <div className='flex items-center'>
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className='w-12 h-12 rounded-full mr-4'
                  />
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {student.name}
                    </h3>
                    <p className='text-gray-500'>
                      ID: {student.studentId} • {student.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => saveStudentScores(student.id)}
                  className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                >
                  <Save className='w-4 h-4 mr-2' />
                  Lưu
                </button>
              </div>

              {/* Score Inputs */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nghe
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    placeholder={student.scores.listening || '0-100'}
                    value={student.scores.listening}
                    onChange={(e) =>
                      updateStudentScore(
                        student.id,
                        'listening',
                        e.target.value
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nói
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    placeholder={student.scores.speaking || '0-100'}
                    value={student.scores.speaking}
                    onChange={(e) =>
                      updateStudentScore(student.id, 'speaking', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Đọc
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    placeholder={student.scores.reading || '0-100'}
                    value={student.scores.reading}
                    onChange={(e) =>
                      updateStudentScore(student.id, 'reading', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Viết
                  </label>
                  <input
                    type='number'
                    min='0'
                    max='100'
                    placeholder={student.scores.writing || '0-100'}
                    value={student.scores.writing}
                    onChange={(e) =>
                      updateStudentScore(student.id, 'writing', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Nhận xét
                </label>
                <textarea
                  placeholder='Nhập thêm nhận xét về kết quả học tập của học viên...'
                  value={student.comments}
                  onChange={(e) =>
                    updateStudentComments(student.id, e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassScoreEntry;
