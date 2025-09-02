'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Clock,
  Star,
  Calendar,
  MapPin,
  Book,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useTeacherApi } from '../_hooks/use-api';
import { TeacherClassroomResponse } from '../../../types/teacher';
import { formatDays } from '../../staff/list-classroom/[id]/page';
import { HomeworkStatus } from '../_hooks/use-homework';

const MyClassesDashboard = () => {
  const { loading, getClassrooms } = useTeacherApi();
  const [classes, setClasses] = useState<TeacherClassroomResponse[]>([]);
  const [stats, setStats] = useState([
    {
      icon: Book,
      label: 'Tổng số lớp',
      value: '0',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'Tổng số học viên',
      value: '0',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Clock,
      label: 'Giờ/tuần',
      value: '24',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      icon: Star,
      label: 'Đánh giá trung bình',
      value: '4.8',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ]);

  const renderClassItem = (classItem: TeacherClassroomResponse) => {
    const totalSessions = classItem.sessions.length;

    const totalAttendance = classItem.sessions.reduce((acc, session) => {
      return (
        acc +
        (session.attendances.filter((att) => att.is_present === true).length ||
          0)
      );
    }, 0);

    const totalPassed = classItem.sessions.reduce((acc, session) => {
      return (
        acc +
        (session.homeworks.filter((e) => e.status === HomeworkStatus.PASSED)
          .length || 0)
      );
    }, 0);

    const totalHomeworks = classItem.sessions.reduce((acc, session) => {
      return acc + (session.homeworks.length || 0);
    }, 0);

    const attendanceRate =
      totalSessions > 0
        ? (totalAttendance / (totalSessions * classItem.enrollments.length)) *
          100
        : 0;
    const homeworkPassRate =
      totalHomeworks > 0 ? (totalPassed / totalHomeworks) * 100 : 0;

    return (
      <div
        key={classItem.id}
        className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300'
      >
        {/* Class Header with gradient background */}
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-white'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <h3 className='text-lg font-bold mb-2 group-hover:text-blue-50 transition-colors'>
                {classItem.class_name}
              </h3>
              <span className='inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm'>
                {classItem.course_level}
              </span>
            </div>
            <div className='bg-white/20 flex-col items-center justify-center flex rounded-lg p-3 backdrop-blur-sm'>
              <Users className='w-5 h-5 text-white' />
              <span className='block text-sm font-semibold mt-1'>
                {classItem.enrollments.length}
              </span>
            </div>
          </div>
        </div>

        <div className='p-4'>
          <div className='space-x-6 mb-6 flex w-full items-center'>
            <div className='flex items-center w-1/3 text-gray-700'>
              <div className='bg-blue-50 rounded-lg p-2 mr-3'>
                <Calendar className='w-4 h-4 text-blue-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>Lịch học</p>
                <p className='text-sm text-gray-600'>
                  {formatDays(classItem.schedules.map((v) => v.weekday))}
                </p>
              </div>
            </div>

            <div className='flex items-center text-gray-700'>
              <div className='bg-green-50 rounded-lg p-2 mr-3'>
                <MapPin className='w-4 h-4 text-green-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>Phòng học</p>
                <p className='text-sm text-gray-600'>{classItem.room}</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                  <div className='bg-blue-500 rounded-lg p-1.5 mr-2'>
                    <Users className='w-3 h-3 text-white' />
                  </div>
                  <span className='text-sm font-medium text-gray-700'>
                    Điểm danh
                  </span>
                </div>
              </div>
              <div className='text-2xl font-bold text-blue-600'>
                {attendanceRate.toFixed(1)}%
              </div>
            </div>

            <div className='bg-green-50 rounded-lg p-4 border border-green-100'>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center'>
                  <div className='bg-green-500 rounded-lg p-1.5 mr-2'>
                    <CheckCircle className='w-3 h-3 text-white' />
                  </div>
                  <span className='text-sm font-medium text-gray-700'>
                    Bài tập
                  </span>
                </div>
              </div>
              <div className='text-2xl font-bold text-green-600'>
                {homeworkPassRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <Link
            href={`/teacher/classroom/${classItem.id}`}
            className='group/button w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
          >
            <span>Xem chi tiết</span>
            <ChevronRight className='w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform' />
          </Link>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesData = await getClassrooms();

        setClasses(classesData);

        // Update stats
        setStats((prevStats) => [
          { ...prevStats[0], value: classesData.length.toString() },
          { ...prevStats[1], value: classesData.length.toString() },
          prevStats[2],
          prevStats[3],
        ]);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
      }
    };

    fetchData();
  }, [getClassrooms]);

  return (
    <div className='p-4'>
      <div className='mx-auto'>
        {/* Loading state */}
        {loading && (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* Header */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
              Lớp đang dạy
            </h1>
            <p className='text-gray-500'>
              Quản lý và theo dõi các lớp học của bạn
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}
              >
                <div className='flex items-center'>
                  <Icon className={`w-8 h-8 ${stat.iconColor} mr-3`} />
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {stat.value}
                    </p>
                    <p className='text-sm text-gray-600'>{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Classes Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {classes.map(renderClassItem)}
        </div>

        {/* Empty State */}
        {!loading && classes.length === 0 && (
          <div className='text-center py-12'>
            <div className='bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
              <Book className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Chưa có lớp học nào
            </h3>
            <p className='text-gray-500 max-w-sm mx-auto'>
              Bạn chưa được phân công dạy lớp nào. Vui lòng liên hệ với ban quản
              lý.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClassesDashboard;
