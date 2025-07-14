'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  CalendarIcon,
  Clock,
  Trophy,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BarChart3,
  Calendar,
  Award,
  BookOpen as BookOpenIcon,
  Clock as ClockIcon,
  ArrowUp,
  Star,
  Plus,
} from 'lucide-react';
import { useStudentApi } from './_hooks/use-api';

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    error,
    getStudentDashboard,
    getStudentClasses,
    getStudentSchedule,
    getStudentScores,
  } = useStudentApi();

  // Fetch student data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [dashboard, classes, schedule, scores] = await Promise.all([
        getStudentDashboard(),
        getStudentClasses(),
        getStudentSchedule(),
        getStudentScores(),
      ]);

      setStudentProfile(dashboard.profile || dashboard.studentProfile);

      // Get upcoming classes (next 3 classes)
      const upcoming = classes
        .filter((cls: any) => cls.status === 'In Progress')
        .slice(0, 3);
      setUpcomingClasses(upcoming);

      // Get recent test results
      const recent = scores.slice(0, 3);
      setRecentResults(recent);

      // Get today's schedule
      const today = new Date();
      const todaySched = schedule.filter(
        (sched: any) =>
          new Date(sched.date).toDateString() === today.toDateString()
      );
      setTodaySchedule(todaySched);

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      setIsLoading(false);
    }
  };

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
  const overallScore = studentProfile?.scores
    ? Math.round(
        (Number(studentProfile.scores.listening) +
          Number(studentProfile.scores.speaking) +
          Number(studentProfile.scores.reading) +
          Number(studentProfile.scores.writing)) /
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

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-6 mb-6'>
        <div className='flex items-center gap-3'>
          <AlertCircle className='w-5 h-5 text-red-500' />
          <p className='text-red-800 font-medium'>
            Có lỗi xảy ra khi tải dữ liệu
          </p>
        </div>
        <button
          onClick={fetchStudentData}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Chào mừng trở lại, {studentProfile?.name}!
            </h1>
            <p className='text-gray-600 mt-1'>
              Đây là tổng quan về quá trình học tập của bạn hôm nay
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>Điểm tổng thể</p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>
                {overallScore}%
              </p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <BarChart3 className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ArrowUp size={16} className='text-green-500' />
            <span className='text-sm font-medium text-green-500'>
              +5% so với tuần trước
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>
                Lớp học hiện tại
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>
                {upcomingClasses.length}
              </p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <BookOpenIcon className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle size={16} className='text-blue-500' />
            <span className='text-sm font-medium text-blue-500'>
              Đang học tích cực
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>
                Lịch học hôm nay
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>
                {todaySchedule.length}
              </p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <Calendar className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ClockIcon size={16} className='text-green-500' />
            <span className='text-sm font-medium text-green-500'>
              Sẵn sàng học tập
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>
                Streak học tập
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>
                {studentProfile?.streak || 0}
              </p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <Trophy className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Star size={16} className='text-orange-500' />
            <span className='text-sm font-medium text-orange-500'>
              Ngày liên tiếp
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Today's Schedule */}
          {todaySchedule.length > 0 && (
            <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
              <div className='p-6 border-b border-gray-100'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                    <Calendar className='w-5 h-5 text-green-600' />
                    Lịch hôm nay
                  </h2>
                  <span className='text-sm text-gray-500'>
                    {new Date().toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className='p-6'>
                <div className='space-y-4'>
                  {todaySchedule.map((schedule) => (
                    <div
                      key={schedule.id}
                      className='flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white shadow-lg'>
                          <Clock className='w-6 h-6' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            {schedule.className}
                          </div>
                          <div className='text-sm text-gray-600 flex items-center gap-2'>
                            <Clock className='w-4 h-4' />
                            {schedule.timeSlot?.startTime} -{' '}
                            {schedule.timeSlot?.endTime}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200'>
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
              <div className='p-6 border-b border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                  <Award className='w-5 h-5 text-purple-600' />
                  Kết quả gần đây
                </h2>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  {recentResults.map((result) => (
                    <div
                      key={result.id}
                      className='flex items-center justify-between p-4 bg-gray-50 rounded-xl'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg'>
                          <BarChart3 className='w-6 h-6' />
                        </div>
                        <div>
                          <div className='font-semibold text-gray-900'>
                            {result.testName}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {result.date}
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-2xl font-bold text-purple-600'>
                          {result.score}%
                        </div>
                        <div className='text-sm text-gray-500'>Điểm số</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className='space-y-8'>
          {/* Student Info Card */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <User className='w-5 h-5 text-blue-600' />
                Thông tin học viên
              </h2>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                    {studentProfile?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {studentProfile?.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {studentProfile?.email}
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Cấp độ</span>
                    <span className='font-semibold text-gray-900'>
                      {getLevelDisplayName(
                        studentProfile?.level || 'intermediate'
                      )}
                    </span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Lớp hiện tại</span>
                    <span className='font-semibold text-gray-900'>
                      {studentProfile?.currentClass}
                    </span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Ngày tham gia</span>
                    <span className='font-semibold text-gray-900'>
                      {studentProfile?.enrollmentDate
                        ? new Date(
                            studentProfile.enrollmentDate
                          ).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <Plus className='w-5 h-5 text-green-600' />
                Truy cập nhanh
              </h2>
            </div>
            <div className='p-6'>
              <div className='space-y-3'>
                <button className='w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl'>
                  <BookOpen className='w-5 h-5' />
                  <span className='font-semibold'>Vào lớp học</span>
                </button>

                <button className='w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl'>
                  <Calendar className='w-5 h-5' />
                  <span className='font-semibold'>Xem lịch học</span>
                </button>

                <button className='w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl'>
                  <Award className='w-5 h-5' />
                  <span className='font-semibold'>Thành tích</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <CalendarIcon className='w-5 h-5 text-orange-600' />
                Lịch tháng
              </h2>
            </div>
            <div className='p-6'>
              <div className='text-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
                </h3>
              </div>

              <div className='grid grid-cols-7 gap-1 mb-2'>
                {dayLabels.map((day) => (
                  <div
                    key={day}
                    className='text-center text-xs font-semibold text-gray-500 py-2'
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className='grid grid-cols-7 gap-1'>
                {calendarDays.map((day) => (
                  <div
                    key={day}
                    className={`
                      text-center text-sm py-2 rounded-lg cursor-pointer transition-colors
                      ${
                        day === selectedDate
                          ? 'bg-purple-600 text-white font-semibold'
                          : day
                          ? 'hover:bg-gray-100 text-gray-700'
                          : 'text-gray-300'
                      }
                    `}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
