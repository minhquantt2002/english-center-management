'use client';

import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { mockStudents } from '../../../data';
import { Student } from '../../../types';

interface LocalStudent {
  id: number;
  name: string;
  email: string;
  level: string;
  status: 'available' | 'busy';
  avatar: string;
}

const AddStudentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('Elementary (A2)');
  const [statusFilter, setStatusFilter] = useState('Chưa có lớp');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  // Use mock students data
  const students: LocalStudent[] = mockStudents
    .slice(0, 5)
    .map((student: Student, index: number) => ({
      id: parseInt(student.id.replace('student_', '')) || index + 1,
      name: student.name,
      email: student.email,
      level: student.level.toUpperCase(),
      status: index % 2 === 0 ? 'available' : ('busy' as 'available' | 'busy'),
      avatar: '/api/placeholder/40/40',
    }));

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAddStudents = () => {
    console.log('Adding students:', selectedStudents);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setIsOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'busy':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Sẵn sàng';
      case 'busy':
        return 'Trung lịch';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '●';
      case 'busy':
        return '▲';
      default:
        return '●';
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Thêm học viên vào lớp
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Lớp: English Intermediate - A2
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Filters */}
        <div className='p-6 border-b border-gray-200'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tìm kiếm học viên
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Tìm theo tên hoặc email...'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trình độ
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option>Elementary (A2)</option>
                <option>Pre-Intermediate (A2-B1)</option>
                <option>Intermediate (B1)</option>
                <option>Upper-Intermediate (B2)</option>
                <option>Advanced (C1)</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Chưa có lớp</option>
                <option>Đã có lớp</option>
                <option>Tất cả</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className='flex-1 overflow-auto' style={{ maxHeight: '400px' }}>
          <table className='w-full'>
            <thead className='bg-gray-50 sticky top-0'>
              <tr>
                <th className='w-12 px-6 py-3'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(students.map((s) => s.id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Học viên
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trình độ
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50 ${
                    selectedStudents.includes(student.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3'>
                        <span className='text-sm font-medium text-gray-600'>
                          {student.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {student.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {student.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                      {student.level}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`text-sm ${getStatusColor(student.status)}`}
                    >
                      {getStatusIcon(student.status)}{' '}
                      {getStatusText(student.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Đã chọn {selectedStudents.length} học viên
          </div>
          <div className='flex space-x-3'>
            <button
              onClick={handleCancel}
              className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              onClick={handleAddStudents}
              disabled={selectedStudents.length === 0}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
            >
              <Plus className='w-4 h-4' />
              <span>Thêm học viên</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
