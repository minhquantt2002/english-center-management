'use client';

import React from 'react';
import { Users, Calendar, BarChart3, User } from 'lucide-react';
import {
  mockEnrollmentStats,
  mockEnrollments,
  mockSchedules,
} from '../../data';
import { Enrollment, Schedule } from '../../types';

const Dashboard = () => {
  // Use mock data from enrollment module
  const statsData = [
    {
      title: 'Học viên mới đăng ký',
      value: String(mockEnrollmentStats.newRegistrations),
      change: '+18% so với tháng qua',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Lớp đang hoạt động',
      value: String(mockEnrollmentStats.activeClasses),
      change: '— Không đổi so với tuần trước',
      changeType: 'neutral',
      icon: Calendar,
      color: 'bg-orange-500',
    },
    {
      title: 'Lịch học hôm nay',
      value: String(mockEnrollmentStats.todaySchedule),
      change: '5 lớp đang diễn ra',
      changeType: 'info',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ];

  const recentRegistrations = mockEnrollmentStats.recentRegistrations.slice(
    0,
    3
  );

  const todaySchedule = mockEnrollmentStats.todayScheduleDetails.slice(0, 3);

  const quickActions = [
    {
      title: 'Thêm học viên',
      subtitle: 'Đăng ký học viên mới',
      icon: Users,
      color: 'bg-teal-500',
      textColor: 'text-white',
    },
    {
      title: 'Phân lớp',
      subtitle: 'Xếp lớp cho học viên',
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-white',
    },
    {
      title: 'Thời khóa biểu',
      subtitle: 'Quản lý lịch học',
      icon: Calendar,
      color: 'bg-purple-500',
      textColor: 'text-white',
    },
  ];

  const weeklyStats = [
    { day: 'T2', value: 3 },
    { day: 'T3', value: 5 },
    { day: 'T4', value: 2 },
    { day: 'T5', value: 8 },
    { day: 'T6', value: 4 },
    { day: 'T7', value: 6 },
    { day: 'CN', value: 1 },
  ];

  const maxValue = Math.max(...weeklyStats.map((stat) => stat.value));

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <div className='text-2xl font-bold text-teal-600'>Zenlish</div>
              <div className='text-sm text-gray-500'>Dashboard Lê Tân</div>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Xin chào, Thu Hương</span>
              <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                <User className='w-5 h-5 text-gray-600' />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Title */}
        <h1 className='text-2xl font-semibold text-gray-900 mb-8'>
          Tổng quan hôm nay
        </h1>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {statsData.map((stat, index) => (
            <div
              key={index}
              className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon className='w-6 h-6' />
                </div>
              </div>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-600 mb-2'>{stat.title}</div>
              <div
                className={`text-sm ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : stat.changeType === 'neutral'
                    ? 'text-gray-500'
                    : 'text-blue-600'
                }`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='mb-8'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Truy cập nhanh
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`${action.color} ${action.textColor} rounded-lg p-6 hover:opacity-90 transition-opacity cursor-pointer`}
              >
                <div className='flex items-center space-x-3'>
                  <action.icon className='w-8 h-8' />
                  <div>
                    <div className='font-semibold'>{action.title}</div>
                    <div className='text-sm opacity-90'>{action.subtitle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Recent Registrations */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Đăng ký gần đây
              </h3>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                {recentRegistrations.map((student, index) => (
                  <div key={index} className='flex items-center space-x-4'>
                    <div className='w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold'>
                      {student.avatar}
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>
                        {student.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {student.level}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${student.statusColor}`}
                    >
                      {student.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
            <div className='p-6 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Thống kê đăng ký tuần
              </h3>
            </div>
            <div className='p-6'>
              <div className='flex items-end justify-between space-x-2 h-40'>
                {weeklyStats.map((stat, index) => (
                  <div
                    key={index}
                    className='flex flex-col items-center space-y-2'
                  >
                    <div className='text-xs text-gray-600'>{stat.value}</div>
                    <div
                      className='bg-teal-500 rounded-t'
                      style={{
                        height: `${(stat.value / maxValue) * 100}px`,
                        width: '24px',
                      }}
                    ></div>
                    <div className='text-xs text-gray-600'>{stat.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className='mt-8 bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Lịch học hôm nay
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thời gian
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Lớp
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Giáo viên
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Phòng
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {todaySchedule.map((schedule, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {schedule.time}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {schedule.class}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {schedule.teacher}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {schedule.room}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.statusColor}`}
                      >
                        {schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
