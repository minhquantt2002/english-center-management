'use client';

import React from 'react';
import {
  Clock,
  Users,
  MapPin,
  Calendar,
  User,
  ChevronRight,
} from 'lucide-react';
import { mockClasses } from '../../../data';
import { ClassData } from '../../../types';

// Use mock classes data
const courses = mockClasses.map((classItem: ClassData) => ({
  id: classItem.id,
  status:
    classItem.status === 'active'
      ? 'active'
      : ('upcoming' as 'active' | 'upcoming' | 'full'),
  statusText:
    classItem.status === 'active' ? 'Đang hoạt động' : 'Sắp khai giảng',
  time: classItem.schedule.time,
  instructor: classItem.teacher.name,
  students: `${classItem.students}/${classItem.maxStudents || 20} học viên`,
  room: classItem.room || 'Phòng A101',
  day: classItem.schedule.time,
}));

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'upcoming':
      return 'bg-orange-100 text-orange-800';
    case 'full':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getProgressColor = (students: string) => {
  const [current, total] = students.split('/').map((n) => parseInt(n));
  const percentage = (current / total) * 100;

  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-orange-500';
  return 'bg-blue-500';
};

const getProgressPercentage = (students: string) => {
  const [current, total] = students.split('/').map((n) => parseInt(n));
  return (current / total) * 100;
};

export default function EnglishCourseInterface() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Khóa học: Tiếng Anh giao tiếp nâng cao
            </h1>
            <div className='flex items-center space-x-6 text-sm text-gray-600'>
              <div className='flex items-center space-x-2'>
                <Clock className='w-4 h-4' />
                <span>Thời gian: 6 tháng</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Users className='w-4 h-4' />
                <span>Trình độ: Nâng cao</span>
              </div>
              <div className='flex items-center space-x-2'>
                <MapPin className='w-4 h-4' />
                <span>5 lớp đang hoạt động</span>
              </div>
            </div>
          </div>
          <button className='bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors'>
            <span>+ Tạo lớp mới</span>
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses.map((course) => (
            <div
              key={course.id}
              className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
            >
              {/* Card Header */}
              <div className='p-6 pb-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {course.id}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      course.status
                    )}`}
                  >
                    {course.statusText}
                  </span>
                </div>

                {/* Course Details */}
                <div className='space-y-3'>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <Calendar className='w-4 h-4' />
                    <span>{course.day}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <User className='w-4 h-4' />
                    <span>{course.instructor}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <Users className='w-4 h-4' />
                    <span>{course.students}</span>
                  </div>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <MapPin className='w-4 h-4' />
                    <span>{course.room}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mt-4'>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        course.students
                      )}`}
                      style={{
                        width: `${getProgressPercentage(course.students)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className='px-6 py-4 bg-gray-50 border-t'>
                <button className='w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium transition-colors'>
                  Xem chi tiết lớp
                </button>
                <div className='flex justify-between mt-3 text-xs text-gray-500'>
                  <span>Thêm học viên</span>
                  <span>Chỉnh sửa</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-white border-t mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              © 2024 Zenlish English Center. All rights reserved.
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Chính sách
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
