'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Headphones,
  BookOpen,
  Save,
  Eye,
  Pencil,
} from 'lucide-react';
import { mockClasses, mockStudents } from '../../../data';
import {
  ClassData as AdminClassData,
  Student as StudentType,
} from '../../../types';

interface Student {
  id: string;
  name: string;
  avatar: string;
  lastFeedback: string;
  studentId: string;
  level: string;
}

interface LocalClassData {
  id: string;
  name: string;
  studentCount: number;
  students: Student[];
}

const StudentFeedback: React.FC = () => {
  // Use mock classes data
  const [classes] = useState<LocalClassData[]>(
    mockClasses.slice(0, 3).map((classItem: AdminClassData, index: number) => {
      // Get students for this class
      const classStudents = mockStudents
        .slice(index * 4, (index + 1) * 4)
        .map((student: StudentType, studentIndex: number) => ({
          id: student.id,
          name: student.name,
          avatar: `https://images.unsplash.com/photo-${
            1494790108755 + studentIndex
          }?w=150&h=150&fit=crop&crop=face`,
          lastFeedback:
            studentIndex === 0
              ? '2 days ago'
              : studentIndex === 1
              ? 'No feedback yet'
              : `${studentIndex + 1} days ago`,
          studentId: `#${student.id}`,
          level: classItem.name,
        }));

      return {
        id: classItem.id,
        name: classItem.name,
        studentCount: classItem.students,
        students: classStudents,
      };
    })
  );

  const [selectedClass, setSelectedClass] = useState<string>(
    mockClasses[0]?.id || 'intermediate-a1'
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    classes[0].students[0]
  );
  const [selectedSkill, setSelectedSkill] = useState<string>('speaking');
  const [feedback, setFeedback] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);

  const currentClass = classes.find((c) => c.id === selectedClass);

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    const newClass = classes.find((c) => c.id === classId);
    if (newClass && newClass.students.length > 0) {
      setSelectedStudent(newClass.students[0]);
    } else {
      setSelectedStudent(null);
    }
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleFeedbackChange = (text: string) => {
    setFeedback(text);
    setCharCount(text.length);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkill(skill);
  };

  const handleSaveFeedback = () => {
    console.log('Saving feedback:', {
      student: selectedStudent,
      skill: selectedSkill,
      feedback: feedback,
    });
  };

  const handlePreview = () => {
    console.log('Preview feedback');
  };

  const skillIcons = {
    speaking: MessageSquare,
    listening: Headphones,
    reading: BookOpen,
    writing: Pencil,
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold text-gray-900 mb-2'>
            Student Feedback
          </h1>
          <p className='text-gray-500'>
            Provide constructive feedback to help your students improve their
            English skills
          </p>
        </div>

        {/* Select Class */}
        <div className='mb-8'>
          <h2 className='text-lg font-medium text-gray-700 mb-4'>
            Select Class
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => handleClassSelect(classItem.id)}
                className={`p-6 rounded-lg border-2 transition-all ${
                  selectedClass === classItem.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Users className='w-8 h-8 mx-auto mb-3' />
                <h3 className='font-semibold text-lg mb-1'>{classItem.name}</h3>
                <p className='text-sm opacity-75'>
                  {classItem.studentCount} students
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {currentClass && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Student List */}
            <div className='lg:col-span-1'>
              <h3 className='text-lg font-medium text-gray-700 mb-4'>
                Students - {currentClass.name}
              </h3>
              <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                {currentClass.students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`w-full p-4 flex items-center text-left transition-colors ${
                      selectedStudent?.id === student.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className='w-12 h-12 rounded-full mr-4'
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900'>
                        {student.name}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {student.studentId}
                      </p>
                      <p className='text-xs text-gray-400'>
                        Last feedback: {student.lastFeedback}
                      </p>
                    </div>
                  </button>
                ))}
                {currentClass.students.length === 0 && (
                  <div className='p-8 text-center text-gray-500'>
                    No students in this class yet
                  </div>
                )}
              </div>
            </div>

            {/* Feedback Form */}
            {selectedStudent && (
              <div className='lg:col-span-2'>
                <div className='bg-white rounded-lg border border-gray-200 p-6'>
                  {/* Student Info Header */}
                  <div className='flex items-center mb-6 pb-6 border-b border-gray-200'>
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className='w-16 h-16 rounded-full mr-4'
                    />
                    <div>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        {selectedStudent.name}
                      </h3>
                      <p className='text-gray-500'>
                        {selectedStudent.studentId} • {selectedStudent.level}
                      </p>
                    </div>
                  </div>

                  {/* Skill Selection */}
                  <div className='mb-6'>
                    <h4 className='text-lg font-medium text-gray-700 mb-4'>
                      Select Skill
                    </h4>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                      {Object.entries(skillIcons).map(([skill, Icon]) => (
                        <button
                          key={skill}
                          onClick={() => handleSkillSelect(skill)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedSkill === skill
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <Icon className='w-6 h-6 mx-auto mb-2' />
                          <span className='text-sm font-medium capitalize'>
                            {skill}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Textarea */}
                  <div className='mb-6'>
                    <label className='block text-lg font-medium text-gray-700 mb-4'>
                      Feedback for {selectedSkill}
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => handleFeedbackChange(e.target.value)}
                      placeholder={`Write your feedback for ${selectedStudent.name}'s ${selectedSkill} skills...`}
                      className='w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
                      maxLength={500}
                    />
                    <div className='flex justify-between items-center mt-2'>
                      <span className='text-sm text-gray-500'>
                        {charCount}/500 characters
                      </span>
                      <div className='flex space-x-3'>
                        <button
                          onClick={handlePreview}
                          className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        >
                          <Eye className='w-4 h-4 mr-2' />
                          Preview
                        </button>
                        <button
                          onClick={handleSaveFeedback}
                          className='inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
                        >
                          <Save className='w-4 h-4 mr-2' />
                          Save Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedback;
