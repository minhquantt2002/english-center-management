'use client';

import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { mockCourses } from '../../../data';
import { Course } from '../../../types';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Use mock courses data
  const courses = mockCourses.map((course: Course) => ({
    id: course.id,
    name: course.name,
    description: course.description,
    level: (course.level.charAt(0).toUpperCase() + course.level.slice(1)) as
      | 'Beginner'
      | 'Intermediate'
      | 'Advanced',
    duration: `${course.duration} weeks`,
    startDate: new Date(course.startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    endDate: new Date(course.endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    status:
      course.status === 'active'
        ? 'Active'
        : course.status === 'completed'
        ? 'Completed'
        : ('Upcoming' as 'Active' | 'Upcoming' | 'Completed'),
  }));

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-purple-100 text-purple-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === 'All Levels' || course.level === levelFilter;
    const matchesStatus =
      statusFilter === 'All Status' || course.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Quản lý khóa học
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý và tổ chức tất cả các khóa học đào tạo
            </p>
          </div>
          <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'>
            <Plus size={20} />
            Thêm khóa học mới
          </button>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Level Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Lọc theo cấp độ
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option>Tất cả cấp độ</option>
                <option>Cơ bản</option>
                <option>Trung cấp</option>
                <option>Nâng cao</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Lọc theo trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option>Tất cả trạng thái</option>
                <option>Hoạt động</option>
                <option>Sắp diễn ra</option>
                <option>Đã hoàn thành</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tìm kiếm khóa học
              </label>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={20}
                />
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên khóa học...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Tất cả khóa học
            </h2>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tên khóa học
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cấp độ
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thời lượng
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ngày bắt đầu
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ngày kết thúc
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {course.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {course.description}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {course.duration}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {course.startDate}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {course.endDate}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          course.status
                        )}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <button className='text-blue-600 hover:text-blue-900 transition-colors'>
                          <Edit size={18} />
                        </button>
                        <button className='text-red-600 hover:text-red-900 transition-colors'>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200'>
            <div className='text-sm text-gray-700'>
              Hiển thị 1 đến 4 của 12 khóa học
            </div>
            <div className='flex items-center space-x-2'>
              <button className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                Trước
              </button>
              <button className='px-3 py-1 text-sm bg-blue-600 text-white rounded'>
                1
              </button>
              <button className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                2
              </button>
              <button className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                3
              </button>
              <button className='px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
