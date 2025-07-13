'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  Book,
  Calendar,
  Edit,
  UserCheck,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ClassOverview,
  StudentList,
  ClassSchedule,
  ClassStats,
  AttendanceManagement,
  GradeManagement,
  MaterialsManagement,
} from './_components';

// Mock data for class details
const mockClassDetails = {
  id: 'class_1',
  name: 'Tiếng Anh Cơ Bản A1',
  level: 'Beginner',
  teacher: 'Sarah Johnson',
  room: 'Room A101',
  building: 'Building A',
  schedule: 'Thứ 2, 4, 6 - 9:00 AM - 10:30 AM',
  totalStudents: 24,
  maxStudents: 30,
  currentUnit: 'Unit 3: Daily Conversations',
  description:
    'Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu, tập trung vào kỹ năng giao tiếp hàng ngày.',
  startDate: '2024-01-15',
  endDate: '2024-04-15',
  status: 'active',
  levelColor: 'bg-green-100 text-green-700',
};

const mockStudents = [
  {
    id: 'student_1',
    name: 'Nguyễn Thị Mai',
    email: 'mai.nguyen@email.com',
    phone: '+84 987 654 321',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    attendanceRate: 95,
    lastScore: 85,
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: 'student_2',
    name: 'Trần Văn Hùng',
    email: 'hung.tran@email.com',
    phone: '+84 987 654 322',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    attendanceRate: 88,
    lastScore: 78,
    status: 'active',
    joinDate: '2024-01-10',
  },
  {
    id: 'student_3',
    name: 'Lê Thị Hoa',
    email: 'hoa.le@email.com',
    phone: '+84 987 654 323',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    attendanceRate: 92,
    lastScore: 90,
    status: 'active',
    joinDate: '2024-01-05',
  },
  {
    id: 'student_4',
    name: 'Phạm Văn Nam',
    email: 'nam.pham@email.com',
    phone: '+84 987 654 324',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    level: 'Beginner',
    attendanceRate: 85,
    lastScore: 72,
    status: 'active',
    joinDate: '2024-01-12',
  },
];

const mockSchedule: Array<{
  id: string;
  date: string;
  day: string;
  time: string;
  topic: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  attendance: number;
  totalStudents: number;
}> = [
  {
    id: 'session_1',
    date: '2024-01-22',
    day: 'Thứ 2',
    time: '9:00 AM - 10:30 AM',
    topic: 'Unit 3: Daily Conversations - Lesson 1',
    status: 'completed',
    attendance: 22,
    totalStudents: 24,
  },
  {
    id: 'session_2',
    date: '2024-01-24',
    day: 'Thứ 4',
    time: '9:00 AM - 10:30 AM',
    topic: 'Unit 3: Daily Conversations - Lesson 2',
    status: 'upcoming',
    attendance: 0,
    totalStudents: 24,
  },
  {
    id: 'session_3',
    date: '2024-01-26',
    day: 'Thứ 6',
    time: '9:00 AM - 10:30 AM',
    topic: 'Unit 3: Daily Conversations - Lesson 3',
    status: 'upcoming',
    attendance: 0,
    totalStudents: 24,
  },
];

const ClassDetailPage = () => {
  const params = useParams();
  const classId = params.id as string;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: Book },
    { id: 'students', label: 'Học viên', icon: Users },
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'attendance', label: 'Điểm danh', icon: UserCheck },
    { id: 'grades', label: 'Điểm số', icon: BarChart3 },
    { id: 'materials', label: 'Tài liệu', icon: FileText },
  ];

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
                {mockClassDetails.name}
              </h1>
              <p className='text-sm text-gray-500'>
                {mockClassDetails.teacher} • {mockClassDetails.room}
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
          totalStudents={mockClassDetails.totalStudents}
          maxStudents={mockClassDetails.maxStudents}
          room={mockClassDetails.room}
          currentUnit={mockClassDetails.currentUnit}
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
              <ClassOverview classDetails={mockClassDetails} />
            )}

            {activeTab === 'students' && (
              <StudentList students={mockStudents} />
            )}

            {activeTab === 'schedule' && (
              <ClassSchedule sessions={mockSchedule} />
            )}

            {activeTab === 'attendance' && <AttendanceManagement />}

            {activeTab === 'grades' && <GradeManagement />}

            {activeTab === 'materials' && <MaterialsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
