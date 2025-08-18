'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Clock, Star, Calendar, MapPin, Book } from 'lucide-react';
import { useTeacherApi } from '../_hooks/use-api';
import { TeacherClassroomResponse } from '../../../types/teacher';
import { formatDays } from '../../staff/list-classroom/[id]/page';

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
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className='bg-white rounded-lg  shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer'
            >
              {/* Class Header */}
              <div className='flex justify-between items-start mb-4'>
                <div className='flex space-x-2 items-center'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {classItem.class_name}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700`}
                  >
                    {classItem.course_level}
                  </span>
                </div>

                <div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Users className='w-4 h-4 mr-1' />
                    {classItem.enrollments.length}
                  </div>
                </div>
              </div>

              {/* Schedule & Location */}
              <div className='mb-4 flex justify-between items-center'>
                <div className='flex items-center text-sm text-gray-600'>
                  <Calendar className='w-4 h-4 mr-2' />
                  {formatDays(classItem.schedules.map((v) => v.weekday))}
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                  <MapPin className='w-4 h-4 mr-2' />
                  {classItem.room}
                </div>
              </div>

              {/* Student Avatars */}
              <div className='flex items-center justify-end '>
                <Link
                  href={`/teacher/classroom/${classItem.id}`}
                  className='text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium'
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyClassesDashboard;
