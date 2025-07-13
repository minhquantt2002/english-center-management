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
  Clock,
  MapPin,
  Trophy,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  mockStudentProfiles,
  mockStudentClasses,
  mockTestResults,
  mockStudentSchedules,
  mockStudentScores,
} from '../../data';

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // Get student profile data
  const studentProfile = mockStudentProfiles[0];

  // Get upcoming classes (next 3 classes)
  const upcomingClasses = mockStudentClasses
    .filter((cls) => cls.status === 'In Progress')
    .slice(0, 3);

  // Get recent test results
  const recentResults = mockTestResults.slice(0, 3);

  // Get today's schedule
  const today = new Date();
  const todaySchedule = mockStudentSchedules.filter(
    (schedule) =>
      new Date(schedule.date).toDateString() === today.toDateString()
  );

  // Get upcoming schedule (next 7 days)
  const upcomingSchedule = mockStudentSchedules
    .filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return (
        scheduleDate >= today &&
        scheduleDate <= nextWeek &&
        schedule.status === 'upcoming'
      );
    })
    .slice(0, 5);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

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

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  // Calculate overall progress
  const overallScore = mockStudentScores
    ? Math.round(
        (Number(mockStudentScores.listening) +
          Number(mockStudentScores.speaking) +
          Number(mockStudentScores.reading) +
          Number(mockStudentScores.writing)) /
          4
      )
    : 0;

  // Get level display name
  const getLevelDisplayName = (level: string) => {
    const levelMap: { [key: string]: string } = {
      beginner: 'Sơ cấp',
      intermediate: 'Trung cấp',
      advanced: 'Cao cấp',
    };
    return levelMap[level] || level;
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Left Column */}
      <div className='lg:col-span-2 space-y-6'>
        {/* Welcome Banner */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold mb-2'>
                Chào mừng trở lại, {studentProfile?.name}!
              </h1>
              <p className='text-blue-100 mb-4'>
                Sẵn sàng cho các bài học tiếng Anh hôm nay? Bạn có{' '}
                {todaySchedule.length} hoạt động hôm nay.
              </p>
              <div className='flex space-x-6'>
                <div className='bg-white/20 rounded-lg px-3 py-2'>
                  <span className='text-sm font-medium'>
                    Cấp độ:{' '}
                    {getLevelDisplayName(
                      studentProfile?.level || 'intermediate'
                    )}
                  </span>
                </div>
                <div className='bg-white/20 rounded-lg px-3 py-2'>
                  <span className='text-sm font-medium'>
                    Lớp hiện tại: {studentProfile?.currentClass}
                  </span>
                </div>
                <div className='bg-white/20 rounded-lg px-3 py-2'>
                  <span className='text-sm font-medium'>
                    Streak: {studentProfile?.streak || 0} ngày
                  </span>
                </div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-3xl font-bold'>{overallScore}%</div>
              <div className='text-blue-100 text-sm'>Điểm tổng thể</div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        {todaySchedule.length > 0 && (
          <div className='bg-white rounded-2xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Lịch hôm nay
              </h2>
              <span className='text-sm text-gray-500'>
                {today.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className='space-y-4'>
              {todaySchedule.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    schedule.type === 'class'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : schedule.type === 'exam'
                      ? 'bg-red-50 border-l-4 border-red-500'
                      : 'bg-green-50 border-l-4 border-green-500'
                  }`}
                >
                  <div className='flex items-center space-x-4'>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        schedule.type === 'class'
                          ? 'bg-blue-500'
                          : schedule.type === 'exam'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {schedule.type === 'class' ? (
                        <Video className='w-6 h-6 text-white' />
                      ) : schedule.type === 'exam' ? (
                        <AlertCircle className='w-6 h-6 text-white' />
                      ) : (
                        <MessageCircle className='w-6 h-6 text-white' />
                      )}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {schedule.title}
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        {schedule.teacher} • {schedule.room}
                      </p>
                      <p className='text-gray-500 text-sm flex items-center'>
                        <Clock className='w-3 h-3 mr-1' />
                        {schedule.time}
                      </p>
                      {schedule.topic && (
                        <p className='text-blue-600 text-sm mt-1'>
                          Chủ đề: {schedule.topic}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className='bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600'>
                    {schedule.type === 'class' ? 'Tham gia' : 'Xem chi tiết'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Classes */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Lớp học của tôi
            </h2>
            <button className='text-blue-500 text-sm font-medium hover:text-blue-600'>
              Xem tất cả
            </button>
          </div>

          <div className='space-y-4'>
            {upcomingClasses.map((classItem, index) => (
              <div
                key={classItem.id}
                className={`flex items-center justify-between p-4 rounded-xl ${
                  classItem.bgColor || 'bg-gray-50'
                }`}
              >
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      classItem.color === 'blue'
                        ? 'bg-blue-500'
                        : classItem.color === 'green'
                        ? 'bg-green-500'
                        : 'bg-gray-500'
                    }`}
                  >
                    <BookOpen className='w-6 h-6 text-white' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      {classItem.name}
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Giáo viên: {classItem.teacher.name}
                    </p>
                    <p className='text-gray-500 text-sm flex items-center'>
                      <Clock className='w-3 h-3 mr-1' />
                      {classItem.schedule.days}, {classItem.schedule.time}
                    </p>
                    <p className='text-gray-500 text-sm flex items-center'>
                      <MapPin className='w-3 h-3 mr-1' />
                      {classItem.room}
                    </p>
                    <div className='flex items-center mt-2'>
                      <div className='flex-1 bg-gray-200 rounded-full h-2 mr-2'>
                        <div
                          className={`h-2 rounded-full ${
                            classItem.color === 'blue'
                              ? 'bg-blue-500'
                              : classItem.color === 'green'
                              ? 'bg-green-500'
                              : 'bg-gray-500'
                          }`}
                          style={{
                            width: `${Math.round(
                              ((classItem.sessionsCompleted || 0) /
                                (classItem.totalSessions || 1)) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className='text-xs text-gray-500'>
                        {classItem.sessionsCompleted}/{classItem.totalSessions}{' '}
                        buổi
                      </span>
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      classItem.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : classItem.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {classItem.status === 'In Progress'
                      ? 'Đang học'
                      : classItem.status === 'Completed'
                      ? 'Hoàn thành'
                      : 'Sắp tới'}
                  </span>
                </div>
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
            {recentResults.map((result, index) => {
              const percentage = Math.round(
                (result.overall / (result.maxScore || 100)) * 100
              );
              const colorClass =
                percentage >= 90
                  ? 'green'
                  : percentage >= 80
                  ? 'blue'
                  : percentage >= 70
                  ? 'yellow'
                  : 'red';

              return (
                <div
                  key={result.id}
                  className={`bg-${colorClass}-50 rounded-xl p-4 border-l-4 border-${colorClass}-500`}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <h3 className='font-semibold text-gray-900'>
                      {result.courseName}
                    </h3>
                    <span
                      className={`text-2xl font-bold text-${colorClass}-600`}
                    >
                      {result.overall}/{result.maxScore || 100}
                    </span>
                  </div>
                  <p className='text-gray-600 text-sm mb-2'>
                    {result.testType === 'final'
                      ? 'Kiểm tra cuối kỳ'
                      : result.testType === 'midterm'
                      ? 'Kiểm tra giữa kỳ'
                      : result.testType === 'quiz'
                      ? 'Bài kiểm tra'
                      : 'Luyện tập'}
                  </p>
                  <p className='text-gray-500 text-sm mb-3'>
                    {new Date(result.date).toLocaleDateString('vi-VN')} •{' '}
                    {result.teacherName}
                  </p>
                  <div
                    className={`w-full bg-${colorClass}-200 rounded-full h-2 mb-2`}
                  >
                    <div
                      className={`bg-${colorClass}-500 h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className='text-xs text-gray-500'>
                    Điểm: {percentage}% • Xếp loại: {result.gradeLevel}
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
            <h3 className='text-lg font-medium text-gray-700'>
              {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
            </h3>
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

        {/* Upcoming Schedule */}
        <div className='bg-white rounded-2xl p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Lịch sắp tới
          </h2>

          <div className='space-y-3'>
            {upcomingSchedule.map((schedule) => (
              <div
                key={schedule.id}
                className='flex items-center space-x-3 p-3 rounded-lg bg-gray-50'
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    schedule.type === 'class'
                      ? 'bg-blue-500'
                      : schedule.type === 'exam'
                      ? 'bg-red-500'
                      : 'bg-green-500'
                  }`}
                ></div>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-900'>
                    {schedule.title}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {new Date(schedule.date).toLocaleDateString('vi-VN')} •{' '}
                    {schedule.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
