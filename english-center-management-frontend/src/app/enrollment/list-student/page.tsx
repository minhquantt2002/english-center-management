'use client';

import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, User } from 'lucide-react';
import { mockStudents } from '../../../data';
import { Student } from '../../../types';

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Use mock students data
  const students = mockStudents.map((student: Student) => ({
    id: student.id,
    name: student.name,
    phone: student.phone || 'N/A',
    email: student.email,
    level: student.level.charAt(0).toUpperCase() + student.level.slice(1),
    currentClass: student.currentClass || 'Chưa phân lớp',
    status: student.status as 'active' | 'inactive' | 'pending',
  }));

  const levelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Elementary: 'bg-yellow-100 text-yellow-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    active: 'Đang học',
    inactive: 'Tạm nghỉ',
    pending: 'Chờ phân lớp',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <h1 className='text-2xl font-bold text-teal-600'>Zenlish</h1>
            <span className='text-gray-600'>Quản lý học viên</span>
          </div>
          <div className='flex items-center gap-2'>
            <User className='w-5 h-5 text-gray-600' />
            <span className='text-gray-700'>Lê Tấn</span>
          </div>
        </div>
      </header>

      <div className='p-6'>
        {/* Page Title */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Danh sách học viên
            </h2>
            <p className='text-gray-600 mt-1'>
              Quản lý thông tin học viên trung tâm Zenlish
            </p>
          </div>
          <button className='flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'>
            <Plus className='w-4 h-4' />
            Thêm học viên
          </button>
        </div>

        {/* Filters */}
        <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tìm kiếm
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Tên, số điện thoại, email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trình độ
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='all'>Tất cả trình độ</option>
                <option value='beginner'>Beginner</option>
                <option value='elementary'>Elementary</option>
                <option value='intermediate'>Intermediate</option>
                <option value='advanced'>Advanced</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='all'>Tất cả trạng thái</option>
                <option value='active'>Đang học</option>
                <option value='pending'>Chờ phân lớp</option>
                <option value='inactive'>Tạm nghỉ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tên học viên
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Số điện thoại
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trình độ
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Lớp hiện tại
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
                {students.map((student) => (
                  <tr key={student.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium'>
                          {getInitials(student.name)}
                        </div>
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-gray-900'>
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.phone}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          levelColors[student.level as keyof typeof levelColors]
                        }`}
                      >
                        {student.level}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.currentClass}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[student.status]
                        }`}
                      >
                        {statusLabels[student.status]}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button className='text-indigo-600 hover:text-indigo-900'>
                          <Eye className='w-4 h-4' />
                        </button>
                        <button className='text-gray-600 hover:text-gray-900'>
                          <Edit className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
