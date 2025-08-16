'use client';

import React from 'react';
import { X, Clock, DollarSign, BookOpen } from 'lucide-react';
import { CourseResponse } from '../../../../types/admin';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseResponse | null;
}

const ViewCourseModal: React.FC<ViewCourseModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  if (!isOpen || !course) return null;

  const getLevelDisplay = (level: string) => {
    switch (level) {
      case 'A1':
        return 'A1 - Mất gốc';
      case 'A2':
        return 'A2 - Sơ cấp';
      case 'B1':
        return 'B1 - Trung cấp thấp';
      case 'B2':
        return 'B2 - Trung cấp cao';
      case 'C1':
        return 'C1 - Nâng cao';
      default:
        return 'A2 - Sơ cấp';
    }
  };

  // const getLevelBadgeColor = (level: string) => {
  //   switch (level) {
  //     case 'beginner':
  //     case 'elementary':
  //       return 'bg-green-100 text-green-800';
  //     case 'intermediate':
  //     case 'upper-intermediate':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'advanced':
  //     case 'proficiency':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };
  const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'A1':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'A2':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'B1':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'B2':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'C1':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
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
                  {course.course_name}
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
                    {course.total_weeks
                      ? `${course.total_weeks} tuần`
                      : 'Chưa cập nhật'}
                  </span>
                </div>
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
                    {formatDate(course.created_at || '')}
                  </span>
                </div>
              </div>
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
