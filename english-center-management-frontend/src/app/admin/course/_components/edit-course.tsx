'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
  Plus,
  Save,
} from 'lucide-react';
import { Course, CourseLevel, CourseStatus } from '../../../../types';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (courseId: string, courseData: CourseFormData) => void;
  course: Course | null;
}

export interface CourseFormData {
  name: string;
  description: string;
  level: CourseLevel;
  duration: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  price?: number;
  maxStudents?: number;
  syllabus: string[];
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
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    level: 'beginner',
    duration: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    price: undefined,
    maxStudents: undefined,
    syllabus: [''],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CourseFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load course data when modal opens
  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        name: course.name,
        description: course.description,
        level: course.level,
        duration: course.duration,
        startDate: course.startDate,
        endDate: course.endDate,
        status: course.status,
        price: course.price,
        maxStudents: course.maxStudents,
        syllabus: course.syllabus || [''],
      });
      setErrors({});
    }
  }, [course, isOpen]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên khóa học là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả khóa học là bắt buộc';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Thời lượng khóa học là bắt buộc';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Ngày bắt đầu là bắt buộc';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Ngày kết thúc là bắt buộc';
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    if (formData.price !== undefined && formData.price < 0) {
      newErrors.price = 'Học phí không được âm';
    }

    if (formData.maxStudents !== undefined && formData.maxStudents <= 0) {
      newErrors.maxStudents = 'Số học viên tối đa phải lớn hơn 0';
    }

    // Validate syllabus
    const validSyllabus = formData.syllabus.filter(
      (item) => item.trim() !== ''
    );
    if (validSyllabus.length === 0) {
      newErrors.syllabus = 'Phải có ít nhất một bài học trong giáo trình';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && course) {
      setIsSubmitting(true);
      try {
        // Filter out empty syllabus items
        const cleanSyllabus = formData.syllabus.filter(
          (item) => item.trim() !== ''
        );
        const courseData = {
          ...formData,
          syllabus: cleanSyllabus,
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
      name: '',
      description: '',
      level: 'beginner',
      duration: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
      price: undefined,
      maxStudents: undefined,
      syllabus: [''],
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
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

  const handleSyllabusChange = (index: number, value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData((prev) => ({
      ...prev,
      syllabus: newSyllabus,
    }));

    // Clear syllabus error
    if (errors.syllabus) {
      setErrors((prev) => ({
        ...prev,
        syllabus: undefined,
      }));
    }
  };

  const addSyllabusItem = () => {
    setFormData((prev) => ({
      ...prev,
      syllabus: [...prev.syllabus, ''],
    }));
  };

  const removeSyllabusItem = (index: number) => {
    if (formData.syllabus.length > 1) {
      const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        syllabus: newSyllabus,
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
                Cập nhật thông tin khóa học: {course.name}
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập tên khóa học'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
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
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange('duration', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.duration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='VD: 8 tuần, 12 buổi'
                />
                {errors.duration && (
                  <p className='text-red-500 text-sm mt-1'>{errors.duration}</p>
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

          {/* Schedule Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-blue-600' />
              Lịch học
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày bắt đầu <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange('startDate', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày kết thúc <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className='text-red-500 text-sm mt-1'>{errors.endDate}</p>
                )}
              </div>
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

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Sĩ số tối đa
                </label>
                <input
                  type='number'
                  value={formData.maxStudents || ''}
                  onChange={(e) =>
                    handleInputChange(
                      'maxStudents',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='VD: 20'
                  min='1'
                />
                {errors.maxStudents && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.maxStudents}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-blue-600' />
              Giáo trình <span className='text-red-500'>*</span>
            </h3>

            <div className='space-y-3'>
              {formData.syllabus.map((item, index) => (
                <div key={index} className='flex gap-2'>
                  <input
                    type='text'
                    value={item}
                    onChange={(e) =>
                      handleSyllabusChange(index, e.target.value)
                    }
                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder={`Bài ${index + 1}: Nhập nội dung bài học`}
                  />
                  {formData.syllabus.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeSyllabusItem(index)}
                      className='px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ))}

              <button
                type='button'
                onClick={addSyllabusItem}
                className='flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium'
              >
                <Plus className='w-4 h-4' />
                Thêm bài học
              </button>
            </div>

            {errors.syllabus && (
              <p className='text-red-500 text-sm mt-2'>{errors.syllabus}</p>
            )}
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
