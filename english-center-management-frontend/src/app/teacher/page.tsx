'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  MessageCircle,
  Calendar,
  FileText,
  GraduationCap,
  Users,
  Clock,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Star,
  ArrowUp,
  User,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useTeacherApi } from './_hooks/use-api';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'Có mặt' | 'Sắp tới' | 'Vắng mặt';
}

const TeacherDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [todaysClasses, setTodaysClasses] = useState<any[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<{
    [key: string]: Student[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { error, getTeacherDashboard, getTeacherClasses } = useTeacherApi();

  // Fetch teacher data on component mount
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const [dashboard, classes] = await Promise.all([
        getTeacherDashboard(),
        getTeacherClasses(),
      ]);

      setDashboardData(dashboard);

      // Transform classes data for display
      const transformedClasses = classes.slice(0, 3).map((classItem: any) => ({
        id: classItem.id,
        title: classItem.className || classItem.title || 'Lớp tiếng Anh',
        level: `Cấp độ ${classItem.level || 'B1'}`,
        room: classItem.room || 'Phòng 101',
        studentCount: classItem.studentsCount || 15,
        time: `${classItem.startTime || '9:00'} - ${
          classItem.endTime || '10:30'
        }`,
        status: 'Đang diễn ra' as 'Đang diễn ra' | 'Sắp tới',
      }));

      setTodaysClasses(transformedClasses);

      // Create simple students by class mapping for display
      const studentsMapping: { [key: string]: Student[] } = {
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

      setStudentsByClass(studentsMapping);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch teacher data:', err);
      setIsLoading(false);
    }
  };

  const actionCards = [
    {
      title: 'Nhập điểm kiểm tra',
      description: 'Cập nhật điểm số học viên',
      icon: Plus,
      bgColor: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      title: 'Gửi nhận xét',
      description: 'Viết feedback cho học viên',
      icon: MessageCircle,
      bgColor: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
    },
    {
      title: 'Lên lịch lớp học',
      description: 'Quản lý lịch giảng dạy',
      icon: Calendar,
      bgColor: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      title: 'Tạo bài tập',
      description: 'Giao bài tập mới',
      icon: FileText,
      bgColor: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Có mặt':
      case 'Present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sắp tới':
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Vắng mặt':
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Đang diễn ra':
      case 'In Progress':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calendarDays = [
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
  ];

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600'></div>
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
          onClick={fetchTeacherData}
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
          <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Chào mừng trở lại, {dashboardData?.teacherName || 'Giáo viên'}!
            </h1>
            <p className='text-gray-600 mt-1'>
              Đây là tổng quan về hoạt động giảng dạy của bạn hôm nay
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>
                Lớp học hôm nay
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>
                {todaysClasses.length}
              </p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <BookOpen className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <ArrowUp size={16} className='text-green-500' />
            <span className='text-sm font-medium text-green-500'>
              +2 so với tuần trước
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>Tổng học viên</p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>45</p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <Users className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle size={16} className='text-blue-500' />
            <span className='text-sm font-medium text-blue-500'>
              Đang giảng dạy tích cực
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>Giờ giảng dạy</p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>24h</p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <Clock className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <TrendingUp size={16} className='text-green-500' />
            <span className='text-sm font-medium text-green-500'>Tuần này</span>
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-gray-500 text-sm font-medium'>
                Đánh giá trung bình
              </p>
              <p className='text-3xl font-bold text-gray-900 mt-1'>4.8</p>
            </div>
            <div className='w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg'>
              <Star className='w-6 h-6' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Award size={16} className='text-purple-500' />
            <span className='text-sm font-medium text-purple-500'>
              Xuất sắc
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={index}
              className={`bg-gradient-to-r ${card.bgColor} ${card.hoverColor} text-white rounded-xl p-6 transition-all duration-200 text-left shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              <Icon className='w-8 h-8 mb-3' />
              <h3 className='text-lg font-semibold mb-1'>{card.title}</h3>
              <p className='text-sm opacity-90'>{card.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Today's Classes */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-orange-600' />
                  Lớp học hôm nay
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
                {todaysClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className='bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6 hover:shadow-md transition-all duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-3'>
                          <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg'>
                            <BookOpen className='w-6 h-6' />
                          </div>
                          <div>
                            <h3 className='text-lg font-semibold text-gray-900'>
                              {classItem.title}
                              {classItem.level && (
                                <span className='text-sm font-normal text-gray-500 ml-2'>
                                  {classItem.level}
                                </span>
                              )}
                            </h3>
                            <div className='flex items-center gap-4 text-sm text-gray-600 mt-1'>
                              <div className='flex items-center gap-1'>
                                <MapPin className='w-4 h-4' />
                                {classItem.room}
                              </div>
                              <div className='flex items-center gap-1'>
                                <Users className='w-4 h-4' />
                                {classItem.studentCount} học viên
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium text-gray-900 mb-2 flex items-center gap-1 justify-end'>
                          <Clock className='w-4 h-4' />
                          {classItem.time}
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            classItem.status
                          )}`}
                        >
                          {classItem.status}
                        </span>
                      </div>
                    </div>
                    <div className='mt-4 flex justify-end'>
                      <button className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors'>
                        <span>Vào lớp</span>
                        <ChevronRight className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <Users className='w-5 h-5 text-blue-600' />
                Học viên gần đây
              </h2>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                {Object.entries(studentsByClass).map(
                  ([className, students]) => (
                    <div key={className} className='space-y-3'>
                      <h3 className='font-semibold text-gray-900 text-sm'>
                        {className}
                      </h3>
                      <div className='space-y-2'>
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                          >
                            <div className='flex items-center gap-3'>
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className='w-8 h-8 rounded-full object-cover'
                              />
                              <span className='font-medium text-gray-900'>
                                {student.name}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-8'>
          {/* Teacher Info Card */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <User className='w-5 h-5 text-orange-600' />
                Thông tin giáo viên
              </h2>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                    {dashboardData?.teacherName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {dashboardData?.teacherName || 'Giáo viên'}
                    </div>
                    <div className='text-sm text-gray-500'>
                      Giáo viên tiếng Anh
                    </div>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Chuyên môn</span>
                    <span className='font-semibold text-gray-900'>
                      Speaking & Grammar
                    </span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Kinh nghiệm</span>
                    <span className='font-semibold text-gray-900'>5 năm</span>
                  </div>

                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                    <span className='text-sm text-gray-600'>Lớp đang dạy</span>
                    <span className='font-semibold text-gray-900'>4 lớp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <Calendar className='w-5 h-5 text-green-600' />
                Lịch tháng
              </h2>
            </div>
            <div className='p-6'>
              <div className='text-center mb-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Tháng 3, 2024
                </h3>
              </div>

              <div className='space-y-2'>
                {calendarDays.map((week, weekIndex) => (
                  <div key={weekIndex} className='grid grid-cols-7 gap-1'>
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`
                          text-center text-sm py-2 rounded-lg cursor-pointer transition-colors
                          ${
                            typeof day === 'number' && day === 15
                              ? 'bg-orange-600 text-white font-semibold'
                              : typeof day === 'number'
                              ? 'hover:bg-gray-100 text-gray-700'
                              : 'text-gray-500 font-semibold'
                          }
                        `}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className='bg-white rounded-xl border border-gray-100 shadow-sm'>
            <div className='p-6 border-b border-gray-100'>
              <h2 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                <BarChart3 className='w-5 h-5 text-purple-600' />
                Thống kê hiệu suất
              </h2>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Tỷ lệ tham gia</span>
                  <span className='font-semibold text-gray-900'>95%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-green-500 h-2 rounded-full'
                    style={{ width: '95%' }}
                  ></div>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Điểm trung bình</span>
                  <span className='font-semibold text-gray-900'>8.5/10</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full'
                    style={{ width: '85%' }}
                  ></div>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>Satisfaction</span>
                  <span className='font-semibold text-gray-900'>4.8/5</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-purple-500 h-2 rounded-full'
                    style={{ width: '96%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
