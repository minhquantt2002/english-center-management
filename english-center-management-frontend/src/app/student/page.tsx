'use client';

import React, { useState } from 'react';
import {
  Video,
  MessageCircle,
  User,
  Mail,
  BookOpen,
  Edit,
  CalendarIcon,
} from 'lucide-react';
import { mockStudents, mockStudentClasses, mockTestResults } from '../../data';

const EnglishLearningDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(20);

  // Get student profile data (using first student as example)
  const studentProfile = mockStudents[0];

  // Get upcoming classes from student data
  const upcomingClasses = mockStudentClasses.slice(0, 2);

  // Get recent test results
  const recentResults = mockTestResults.slice(0, 2);

  // Generate calendar days for December 2024
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(2024, 11, 1).getDay(); // December 1, 2024
    const daysInMonth = 31;
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Left Column */}
      <div className='lg:col-span-2 space-y-6'>
        {/* Welcome Banner */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white'>
          <h1 className='text-2xl font-bold mb-2'>
            Chào mừng trở lại, {studentProfile?.name}!
          </h1>
          <p className='text-blue-100 mb-4'>
            Sẵn sàng cho các bài học tiếng Anh hôm nay? Bạn có{' '}
            {upcomingClasses.length} lớp đã được lên lịch.
          </p>
          <div className='flex space-x-6'>
            <div className='bg-white/20 rounded-lg px-3 py-2'>
              <span className='text-sm font-medium'>
                Cấp độ: {studentProfile?.level || 'Trung cấp'}
              </span>
            </div>
            <div className='bg-white/20 rounded-lg px-3 py-2'>
              <span className='text-sm font-medium'>
                Lớp hiện tại: {studentProfile?.currentClass}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Lớp học sắp tới
            </h2>
            <button className='text-blue-500 text-sm font-medium hover:text-blue-600'>
              Xem tất cả
            </button>
          </div>

          <div className='space-y-4'>
            {upcomingClasses.map((classItem: any, index: number) => (
              <div
                key={classItem.id || index}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  index === 0 ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      index === 0 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  >
                    {index === 0 ? (
                      <Video className='w-6 h-6 text-white' />
                    ) : (
                      <MessageCircle className='w-6 h-6 text-white' />
                    )}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      {classItem.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      {classItem.teacher?.name
                        ? `với ${classItem.teacher.name}`
                        : 'với Giáo viên'}
                    </p>
                    <p className='text-gray-500 text-sm'>
                      {classItem.status === 'In Progress'
                        ? 'Hôm nay'
                        : 'Ngày mai'}
                      , {classItem.schedule?.time || '14:00 - 15:00'}
                    </p>
                  </div>
                </div>
                {index === 0 ? (
                  <button className='bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600'>
                    Tham gia
                  </button>
                ) : (
                  <span className='bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-medium'>
                    Đã lên lịch
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Test Results */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Kết quả kiểm tra gần đây
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {recentResults.map((result: any, index: number) => {
              const percentage =
                Math.round(
                  (result.overall?.totalScore / result.maxScore) * 100
                ) || 85;
              const colorClass = index === 0 ? 'green' : 'blue';

              return (
                <div
                  key={result.id || index}
                  className={`bg-${colorClass}-50 rounded-xl p-4`}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='font-semibold text-gray-900'>
                      {result.testType || 'Kiểm tra tiếng Anh'}
                    </h3>
                    <span
                      className={`text-2xl font-bold text-${colorClass}-600`}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <p className='text-gray-600 text-sm mb-3'>
                    Hoàn thành{' '}
                    {result.createdAt
                      ? new Date(result.createdAt).toLocaleDateString()
                      : '2 ngày trước'}
                  </p>
                  <div
                    className={`w-full bg-${colorClass}-200 rounded-full h-2`}
                  >
                    <div
                      className={`bg-${colorClass}-500 h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className='space-y-6'>
        {/* Calendar */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Lịch</h2>
          <div className='text-center mb-4'>
            <h3 className='text-lg font-medium text-gray-700'>Tháng 12 2024</h3>
          </div>

          {/* Calendar Grid */}
          <div className='grid grid-cols-7 gap-1 mb-2'>
            {dayLabels.map((day) => (
              <div
                key={day}
                className='text-center text-xs font-medium text-gray-500 py-2'
              >
                {day}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-7 gap-1'>
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className='aspect-square flex items-center justify-center'
              >
                {day && (
                  <button
                    onClick={() => setSelectedDate(day)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      day === selectedDate
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Thông tin cá nhân
          </h2>

          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <User className='w-5 h-5 text-gray-400' />
              <span className='text-gray-700'>Sarah Johnson</span>
            </div>

            <div className='flex items-center space-x-3'>
              <Mail className='w-5 h-5 text-gray-400' />
              <span className='text-gray-700'>sarah.j@email.com</span>
            </div>

            <div className='flex items-center space-x-3'>
              <BookOpen className='w-5 h-5 text-gray-400' />
              <span className='text-gray-700'>Cấp độ trung cấp</span>
            </div>

            <div className='flex items-center space-x-3'>
              <CalendarIcon className='w-5 h-5 text-gray-400' />
              <span className='text-gray-700'>Tham gia: Tháng 9 2024</span>
            </div>
          </div>

          <button className='w-full mt-6 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 flex items-center justify-center space-x-2'>
            <Edit className='w-4 h-4' />
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>

        {/* Recent Feedback */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Nhận xét gần đây
          </h2>

          <div className='space-y-4'>
            <div className='border-l-4 border-green-400 pl-4'>
              <p className='text-gray-700 font-medium'>
                "Cải thiện phát âm rất tốt!"
              </p>
              <p className='text-gray-500 text-sm mt-1'>
                Cô Anderson • 2 ngày trước
              </p>
            </div>

            <div className='border-l-4 border-blue-400 pl-4'>
              <p className='text-gray-700 font-medium'>
                "Sử dụng từ vựng xuất sắc trong bài viết."
              </p>
              <p className='text-gray-500 text-sm mt-1'>
                Thầy Thompson • 1 tuần trước
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnglishLearningDashboard;
