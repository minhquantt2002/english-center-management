'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Book,
  Calendar,
  Edit,
  UserCheck,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTeacherApi } from '../../_hooks/use-api';
import { TeacherClassroomResponse } from '../../../../types/teacher';
import ClassOverview from './_components/class-overview';
import StudentList from './_components/student-list';
import ClassSchedule from './_components/class-schedule';
import AttendanceManagement from './_components/attendance-management';
import GradeManagement from './_components/grade-management';
import HomeworkManagement from './_components/homework-management';

const ClassDetailPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const { loading, error, getClassroomDetail } = useTeacherApi();
  const [activeTab, setActiveTab] = useState('overview');
  const [classDetails, setClassDetails] =
    useState<TeacherClassroomResponse>(null);

  const fetchClassData = async () => {
    try {
      const [classData] = await Promise.all([getClassroomDetail(classId)]);
      setClassDetails(classData);
    } catch (err) {
      console.error('Error fetching class data:', err);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, [classId, getClassroomDetail]);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: Book },
    { id: 'students', label: 'Học viên', icon: Users },
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'attendance', label: 'Điểm danh', icon: UserCheck },
    { id: 'homework', label: 'Bài tập về nhà', icon: BookOpen },
    { id: 'grades', label: 'Điểm số', icon: BarChart3 },
  ];

  if (loading || !classDetails) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Đang tải thông tin lớp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
      {/* Header */}
      <div className='mx-auto'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/teacher/classroom'
              className='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100'
            >
              <ArrowLeft className='w-5 h-5' />
            </Link>
            <div>
              <h1 className='text-xl font-semibold text-gray-900'>
                {classDetails.class_name}
              </h1>
              <p className='text-sm text-gray-500'>
                {classDetails.teacher.name} • {classDetails.room}
              </p>
            </div>
          </div>

          <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
            <Edit className='w-4 h-4 mr-2' />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className=' mx-auto px-4 py-6'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8 px-6'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className='w-4 h-4 mr-2' />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='p-6'>
            {activeTab === 'overview' && (
              <ClassOverview classDetails={classDetails} />
            )}

            {activeTab === 'students' && (
              <StudentList
                classroomId={classDetails.id}
                sessions={classDetails.sessions}
                students={classDetails.enrollments.filter((en) => en.student)}
                courseLevel={classDetails.course.level}
                refetchData={fetchClassData}
              />
            )}

            {activeTab === 'schedule' && (
              <ClassSchedule
                classroom={classDetails}
                refetchData={fetchClassData}
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceManagement
                classId={classDetails.id}
                schedules={classDetails.schedules}
                enrollments={classDetails.enrollments.filter(
                  (en) => en.student
                )}
              />
            )}

            {activeTab === 'homework' && (
              <HomeworkManagement
                classId={classDetails.id}
                enrollments={classDetails.enrollments.filter(
                  (en) => en.student
                )}
              />
            )}

            {activeTab === 'grades' && (
              <GradeManagement
                isFullSkills={
                  !['A1', 'A2', 'B1', 'B2'].includes(
                    classDetails.course.level.toUpperCase()
                  )
                }
                enrollments={classDetails.enrollments.filter(
                  (en) => en.student
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
