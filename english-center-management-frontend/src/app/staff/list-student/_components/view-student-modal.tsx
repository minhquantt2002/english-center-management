'use client';

import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Clock,
} from 'lucide-react';
import { StudentProfile } from '@/types';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
}

export default function ViewStudentModal({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) {
  if (!isOpen || !student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      beginner: 'Sơ cấp',
      elementary: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
    };
    return levelMap[level] || level;
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'Đang học',
      inactive: 'Tạm nghỉ',
      pending: 'Chờ phân lớp',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: string) => {
    const colorMap: { [key: string]: string } = {
      beginner: 'bg-green-100 text-green-800',
      elementary: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Thông tin học viên
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Student Header */}
          <div className='flex items-start space-x-6 mb-8'>
            <div className='flex-shrink-0'>
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className='w-24 h-24 rounded-full object-cover border-4 border-gray-200'
                />
              ) : (
                <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl'>
                  {getInitials(student.name)}
                </div>
              )}
            </div>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {student.name}
              </h3>
              <p className='text-gray-600 mb-4'>
                Mã học viên: {student.studentId}
              </p>

              <div className='flex flex-wrap gap-3'>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(
                    student.level
                  )}`}
                >
                  {getLevelLabel(student.level)}
                </span>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    student.enrollmentStatus
                  )}`}
                >
                  {getStatusLabel(student.enrollmentStatus)}
                </span>
                {student.streak && (
                  <span className='px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800'>
                    🔥 {student.streak} ngày liên tiếp
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-gray-50 rounded-lg p-6'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Mail className='w-5 h-5 mr-2 text-gray-600' />
                Thông tin liên hệ
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <Mail className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>{student.email}</span>
                </div>
                {student.phone && (
                  <div className='flex items-center'>
                    <Phone className='w-4 h-4 text-gray-500 mr-3' />
                    <span className='text-gray-700'>{student.phone}</span>
                  </div>
                )}
                {student.address && (
                  <div className='flex items-start'>
                    <MapPin className='w-4 h-4 text-gray-500 mr-3 mt-0.5' />
                    <span className='text-gray-700'>{student.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className='bg-gray-50 rounded-lg p-6'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Calendar className='w-5 h-5 mr-2 text-gray-600' />
                Thông tin cá nhân
              </h4>
              <div className='space-y-3'>
                {student.dateOfBirth && (
                  <div className='flex items-center'>
                    <Calendar className='w-4 h-4 text-gray-500 mr-3' />
                    <span className='text-gray-700'>
                      Ngày sinh: {formatDate(student.dateOfBirth)}
                    </span>
                  </div>
                )}
                <div className='flex items-center'>
                  <Clock className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>
                    Ngày nhập học: {formatDate(student.enrollmentDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className='bg-gray-50 rounded-lg p-6 mb-8'>
            <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <BookOpen className='w-5 h-5 mr-2 text-gray-600' />
              Thông tin học tập
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Lớp hiện tại
                </label>
                <p className='text-gray-900 font-medium'>
                  {student.currentClass || 'Chưa phân lớp'}
                </p>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trình độ
                </label>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(
                    student.level
                  )}`}
                >
                  {getLevelLabel(student.level)}
                </span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {student.emergencyContact && (
            <div className='bg-gray-50 rounded-lg p-6'>
              <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Users className='w-5 h-5 mr-2 text-gray-600' />
                Liên hệ khẩn cấp
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Tên
                  </label>
                  <p className='text-gray-900'>
                    {student.emergencyContact.name}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Số điện thoại
                  </label>
                  <p className='text-gray-900'>
                    {student.emergencyContact.phone}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Mối quan hệ
                  </label>
                  <p className='text-gray-900'>
                    {student.emergencyContact.relationship}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
