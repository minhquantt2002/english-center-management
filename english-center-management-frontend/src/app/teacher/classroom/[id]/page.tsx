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
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTeacherApi } from '../../_hooks/use-api';
import {
  ClassOverview,
  StudentList,
  ClassSchedule,
  ClassStats,
  AttendanceManagement,
  GradeManagement,
} from './_components';

const ClassDetailPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const {
    loading,
    error,
    getClassDetails,
    getClassStudents,
    getClassSchedule,
  } = useTeacherApi();
  const [activeTab, setActiveTab] = useState('overview');
  const [classDetails, setClassDetails] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const [classData, studentsData, scheduleData] = await Promise.all([
          getClassDetails(classId),
          getClassStudents(classId),
          getClassSchedule(classId),
        ]);
        setClassDetails(classData);
        setStudents(studentsData);
        setSchedule(scheduleData);
      } catch (err) {
        console.error('Error fetching class data:', err);
      }
    };

    fetchClassData();
  }, [classId, getClassDetails, getClassStudents, getClassSchedule]);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: Book },
    { id: 'students', label: 'Học viên', icon: Users },
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'attendance', label: 'Điểm danh', icon: UserCheck },
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

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Có lỗi xảy ra
          </h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <Link
            href='/teacher/classroom'
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Quay lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
                {classDetails.name}
              </h1>
              <p className='text-sm text-gray-500'>
                {classDetails.teacher} • {classDetails.room}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <button className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
              <Settings className='w-4 h-4 mr-2' />
              Cài đặt
            </button>
            <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <Edit className='w-4 h-4 mr-2' />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {/* Class Stats */}
        <ClassStats
          totalStudents={classDetails?.totalStudents || 0}
          maxStudents={classDetails?.maxStudents || 0}
          room={classDetails?.room || ''}
          currentUnit={classDetails?.currentUnit || ''}
        />

        {/* Tabs */}
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
              <ClassOverview classDetails={classDetails || {}} />
            )}

            {activeTab === 'students' && <StudentList students={students} />}

            {activeTab === 'schedule' && <ClassSchedule sessions={schedule} />}

            {activeTab === 'attendance' && <AttendanceManagement />}

            {activeTab === 'grades' && <GradeManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
