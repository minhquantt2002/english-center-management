'use client';

import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
} from 'lucide-react';
import { Course } from '../../../../types';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  if (!isOpen || !course) return null;

  const getLevelDisplay = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Sơ cấp';
      case 'elementary':
        return 'Tiền trung cấp';
      case 'intermediate':
        return 'Trung cấp';
      case 'upper-intermediate':
        return 'Cao trung cấp';
      case 'advanced':
        return 'Cao cấp';
      case 'proficiency':
        return 'Thành thạo';
      default:
        return 'Sơ cấp';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner':
      case 'elementary':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'upper-intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
      case 'proficiency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động';
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='w-4 h-4' />;
      case 'upcoming':
        return <ClockIcon className='w-4 h-4' />;
      case 'completed':
        return <CheckCircle className='w-4 h-4' />;
      case 'cancelled':
        return <AlertCircle className='w-4 h-4' />;
      default:
        return <AlertCircle className='w-4 h-4' />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <BookOpen className='w-6 h-6 text-blue-600' />
            <h2 className='text-2xl font-bold text-gray-900'>
              Chi tiết khóa học
            </h2>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {/* Course Header */}
          <div className='mb-6'>
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                  {course.course_name || course.name}
                </h1>
                <p className='text-gray-600 text-lg leading-relaxed'>
                  {course.description}
                </p>
              </div>
              <div className='flex items-center space-x-2 ml-4'>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeColor(
                    course.level
                  )}`}
                >
                  {getLevelDisplay(course.level)}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                    course.status || 'upcoming'
                  )}`}
                >
                  {getStatusIcon(course.status || 'upcoming')}
                  <span className='ml-1'>
                    {getStatusDisplay(course.status || 'upcoming')}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Course Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            {/* Basic Information */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <BookOpen className='w-5 h-5 mr-2 text-blue-600' />
                Thông tin cơ bản
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <Clock className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>
                    <span className='font-medium'>Thời lượng:</span>{' '}
                    {course.duration
                      ? `${course.duration} tuần`
                      : 'Chưa cập nhật'}
                  </span>
                </div>
                <div className='flex items-center'>
                  <Calendar className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>
                    <span className='font-medium'>Ngày bắt đầu:</span>{' '}
                    {course.startDate || course.start_date
                      ? formatDate(course.startDate || course.start_date || '')
                      : 'Chưa cập nhật'}
                  </span>
                </div>
                <div className='flex items-center'>
                  <Calendar className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>
                    <span className='font-medium'>Ngày kết thúc:</span>{' '}
                    {course.endDate || course.end_date
                      ? formatDate(course.endDate || course.end_date || '')
                      : 'Chưa cập nhật'}
                  </span>
                </div>
                {(course.maxStudents || course.max_students) && (
                  <div className='flex items-center'>
                    <Users className='w-4 h-4 text-gray-500 mr-3' />
                    <span className='text-gray-700'>
                      <span className='font-medium'>Số học viên tối đa:</span>{' '}
                      {course.maxStudents || course.max_students}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Information */}
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <DollarSign className='w-5 h-5 mr-2 text-green-600' />
                Thông tin học phí
              </h3>
              <div className='space-y-3'>
                {course.price && (
                  <div className='flex items-center'>
                    <DollarSign className='w-4 h-4 text-gray-500 mr-3' />
                    <span className='text-gray-700'>
                      <span className='font-medium'>Học phí:</span>{' '}
                      {formatPrice(course.price)}
                    </span>
                  </div>
                )}
                <div className='flex items-center'>
                  <Clock className='w-4 h-4 text-gray-500 mr-3' />
                  <span className='text-gray-700'>
                    <span className='font-medium'>Thời gian tạo:</span>{' '}
                    {formatDate(course.createdAt || '')}
                  </span>
                </div>
                {course.updatedAt && (
                  <div className='flex items-center'>
                    <Clock className='w-4 h-4 text-gray-500 mr-3' />
                    <span className='text-gray-700'>
                      <span className='font-medium'>Cập nhật lần cuối:</span>{' '}
                      {formatDate(course.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus */}
          {course.syllabus && course.syllabus.length > 0 && (
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <BookOpen className='w-5 h-5 mr-2 text-blue-600' />
                Nội dung khóa học
              </h3>
              <div className='bg-gray-50 rounded-lg p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {course.syllabus.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200'
                    >
                      <div className='flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold'>
                        {index + 1}
                      </div>
                      <span className='text-gray-700'>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Course ID */}
          <div className='bg-gray-50 rounded-lg p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>
                <span className='font-medium'>Mã khóa học:</span> {course.id}
              </span>
              <span className='text-xs text-gray-500'>ID: {course.id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseModal;
