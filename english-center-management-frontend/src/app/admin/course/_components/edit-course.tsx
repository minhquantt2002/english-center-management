'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, DollarSign, Save } from 'lucide-react';
import {
  CourseLevel,
  CourseStatus,
  CourseResponse,
  CourseUpdate,
} from '../../../../types/admin';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (courseId: string, courseData: CourseUpdate) => void;
  course: CourseResponse | null;
}

const levels: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'upper-intermediate', label: 'Cao trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
  { value: 'proficiency', label: 'Thành thạo' },
];

const statuses: { value: CourseStatus; label: string }[] = [
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

export default function EditCourseModal({
  isOpen,
  onClose,
  onUpdateCourse,
  course,
}: EditCourseModalProps) {
  const [formData, setFormData] = useState<CourseUpdate>({
    course_name: '',
    description: '',
    level: 'beginner',
    status: 'upcoming',
    price: 0,
    total_weeks: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseUpdate, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load course data when modal opens
  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        course_name: course.course_name || '',
        description: course.description || '',
        level: course.level as CourseLevel,
        total_weeks: course.total_weeks || 0,
        status: course.status as CourseStatus,
        price: course.price || 0,
      });
      setErrors({});
    }
  }, [course, isOpen]);

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
      newErrors.price = 'Học phí khóa học là bắt buộc';
    }

    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Học phí không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && course) {
      setIsSubmitting(true);
      try {
        const courseData = {
          ...formData,
        };

        await onUpdateCourse(course.id, courseData);
        handleClose();
      } catch (error) {
        console.error('Error updating course:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      course_name: '',
      description: '',
      level: 'beginner',
      status: 'upcoming',
      total_weeks: 0,
      price: 0,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: keyof CourseUpdate, value: any) => {
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

  if (!isOpen || !course) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Chỉnh sửa khóa học
              </h2>
              <p className='text-sm text-gray-600'>
                Cập nhật thông tin khóa học: {course.course_name}
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
              <BookOpen className='w-5 h-5 text-blue-600' />
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  onChange={(e) =>
                    handleInputChange('level', e.target.value as CourseLevel)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                  Thời lượng <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.total_weeks}
                  onChange={(e) =>
                    handleInputChange('total_weeks', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  onChange={(e) =>
                    handleInputChange('status', e.target.value as CourseStatus)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              <DollarSign className='w-5 h-5 text-blue-600' />
              Học phí và sĩ số
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' />
                  Cập nhật khóa học
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
