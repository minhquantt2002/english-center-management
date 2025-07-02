'use client';

import React from 'react';
import { Plus, MessageCircle, Calendar, FileText } from 'lucide-react';
import { mockClassSessions } from '../../data';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'Có mặt' | 'Sắp tới' | 'Vắng mặt';
}

const TeacherDashboard = () => {
  const actionCards = [
    {
      title: 'Nhập điểm kiểm tra',
      icon: Plus,
      bgColor: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
    },
    {
      title: 'Gửi nhận xét',
      icon: MessageCircle,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Lên lịch lớp học',
      icon: Calendar,
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Tạo bài tập',
      icon: FileText,
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
  ];

  // Use mock data for today's classes
  const todaysClasses = mockClassSessions.slice(0, 3).map((classItem: any) => ({
    id: classItem.id,
    title: classItem.className || classItem.title || 'Lớp tiếng Anh',
    level: `Cấp độ ${classItem.level || 'B1'}`,
    room: classItem.room || 'Phòng 101',
    studentCount: classItem.studentsCount || 15,
    time: `${classItem.startTime || '9:00'} - ${classItem.endTime || '10:30'}`,
    status: 'Đang diễn ra' as 'Đang diễn ra' | 'Sắp tới',
  }));

  // Create simple students by class mapping for display
  const studentsByClass: { [key: string]: Student[] } = {
    'Intermediate B1': [
      {
        id: '1',
        name: 'John Martinez',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        status: 'Có mặt',
      },
      {
        id: '2',
        name: 'Emma Chen',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face',
        status: 'Có mặt',
      },
    ],
    'Advanced C1': [
      {
        id: '4',
        name: 'Sophie Williams',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'Sắp tới',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Có mặt':
      case 'Present':
        return 'bg-green-100 text-green-700';
      case 'Sắp tới':
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-700';
      case 'Vắng mặt':
      case 'Absent':
        return 'bg-red-100 text-red-700';
      case 'Đang diễn ra':
      case 'In Progress':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calendarDays = [
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
  ];

  return (
    <>
      {/* Action Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={index}
              className={`${card.bgColor} ${card.hoverColor} text-white rounded-xl p-6 transition-colors duration-200 text-left`}
            >
              <Icon className='w-8 h-8 mb-3' />
              <h3 className='text-lg font-semibold'>{card.title}</h3>
            </button>
          );
        })}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Today's Classes */}
        <div className='lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Lớp học hôm nay
            </h2>
            <span className='text-gray-500'>15 tháng 3, 2024</span>
          </div>

          <div className='space-y-4'>
            {todaysClasses.map((classItem) => (
              <div
                key={classItem.id}
                className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-1 h-12 bg-blue-400 rounded-full'></div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {classItem.title}
                          {classItem.level && (
                            <span className='text-sm font-normal text-gray-500 ml-2'>
                              {classItem.level}
                            </span>
                          )}
                        </h3>
                        <p className='text-gray-600 text-sm'>
                          {classItem.room} • {classItem.studentCount} học viên
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-gray-900 mb-1'>
                      {classItem.time}
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        classItem.status
                      )}`}
                    >
                      {classItem.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='space-y-8'>
          {/* Calendar */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Lịch</h3>
            <div className='space-y-2'>
              {calendarDays.map((week, weekIndex) => (
                <div key={weekIndex} className='grid grid-cols-7 gap-1'>
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`text-center py-2 text-sm ${
                        weekIndex === 0
                          ? 'font-medium text-gray-700'
                          : typeof day === 'number'
                          ? day === 15
                            ? 'bg-blue-500 text-white rounded-full'
                            : 'text-gray-900 hover:bg-gray-100 rounded cursor-pointer'
                          : 'text-gray-900'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Student Attendance */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Điểm danh học viên
            </h3>
            <div className='space-y-4'>
              {Object.entries(studentsByClass).map(([className, students]) => (
                <div key={className}>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    {className}
                  </h4>
                  <div className='space-y-2'>
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className='w-6 h-6 rounded-full'
                          />
                          <span className='text-sm text-gray-900'>
                            {student.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
