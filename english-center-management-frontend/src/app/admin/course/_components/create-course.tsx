'use client';

import React, { useState } from 'react';
import { X, BookOpen, DollarSign, Save } from 'lucide-react';
import {
  CourseCreate,
  CourseLevel,
  CourseStatus,
} from '../../../../types/admin';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCourse: (courseData: CourseCreate) => Promise<void>;
}

export const levels: { value: CourseLevel; label: string }[] = [
  { value: 'A1', label: 'A1 - Mất gốc' },
  { value: 'A2', label: 'A2 - Sơ cấp' },
  { value: 'B1', label: 'B1 - Trung cấp thấp' },
  { value: 'B2', label: 'B2 - Trung cấp cao' },
  { value: 'C1', label: 'C1 - Nâng cao' },
];

export const statuses: { value: CourseStatus; label: string }[] = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function CreateCourseModal({
  isOpen,
  onClose,
  onCreateCourse,
}: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CourseCreate>({
    course_name: '',
    description: '',
    level: 'A2',
    total_weeks: 0,
    price: 0,
    status: 'active',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseCreate, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.course_name.trim()) {
      newErrors.course_name = 'Tên khóa học là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả khóa học là bắt buộc';
    }

    if (!formData.total_weeks) {
      newErrors.total_weeks = 'Thời lượng khóa học là bắt buộc';
    }

    if (!formData.price) {
      newErrors.price = 'Học phí là bắt buộc';
    }

    if (!formData.level) {
      newErrors.level = 'Cấp độ khóa học là bắt buộc';
    }

    if (!formData.status) {
      newErrors.status = 'Trạng thái khóa học là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onCreateCourse(formData as CourseCreate);
        // handleClose();
      } catch (error) {
        console.error('Error creating course:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      course_name: '',
      description: '',
      level: 'elementary',
      total_weeks: 0,
      price: 0,
      status: 'active',
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: keyof CourseCreate, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-teal-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Tạo khóa học mới
              </h2>
              <p className='text-sm text-gray-600'>
                Thêm khóa học mới vào hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <BookOpen className='w-5 h-5 text-teal-600' />
              Thông tin cơ bản
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tên khóa học <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.course_name}
                  onChange={(e) =>
                    handleInputChange('course_name', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.course_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập tên khóa học'
                />
                {errors.course_name && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.course_name}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trình độ <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Thời lượng (tuần) <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  value={formData.total_weeks}
                  onChange={(e) =>
                    handleInputChange('total_weeks', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.total_weeks ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='VD: 8 tuần, 12 buổi'
                />
                {errors.total_weeks && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.total_weeks}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trạng thái <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Mô tả khóa học <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder='Mô tả chi tiết về khóa học, mục tiêu học tập...'
              />
              {errors.description && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Capacity */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <DollarSign className='w-5 h-5 text-teal-600' />
              Học phí
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Học phí (VND)
                </label>
                <input
                  type='number'
                  value={formData.price || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'price',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='VD: 1500000'
                  min='0'
                />
                {errors.price && (
                  <p className='text-red-500 text-sm mt-1'>{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' />
                  Tạo khóa học
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
