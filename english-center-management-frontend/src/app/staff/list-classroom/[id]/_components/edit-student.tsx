'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { StudentResponse } from '../../../../../types/staff';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
  onSave: (updatedStudent: StudentResponse) => void;
}

export default function EditStudentModal({
  isOpen,
  onClose,
  student,
  onSave,
}: EditStudentModalProps) {
  const [formData, setFormData] = useState<Partial<StudentResponse>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone_number: student.phone_number,
        date_of_birth: student.date_of_birth,
        input_level: student.input_level,
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
        bio: student.bio,
        status: student.status,
      });
      setErrors({});
    }
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên học viên là bắt buộc';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.input_level) {
      newErrors.input_level = 'Trình độ là bắt buộc';
    }

    if (
      formData.parent_phone &&
      !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.parent_phone)
    ) {
      newErrors.parent_phone = 'Số điện thoại phụ huynh không hợp lệ';
    }

    if (
      formData.parent_phone &&
      !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.parent_phone)
    ) {
      newErrors.parent_phone = 'Số điện thoại khẩn cấp không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !student) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedStudent: StudentResponse = {
        ...student,
        ...formData,
      };

      onSave(updatedStudent);
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <User className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Chỉnh sửa thông tin học viên
              </h2>
              <p className='text-sm text-gray-500'>
                Cập nhật thông tin cho {student.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Thông tin cơ bản
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập họ và tên'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập email'
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={formData.phone_number || ''}
                  onChange={(e) =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập số điện thoại'
                />
                {errors.phone_number && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.phone_number}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày sinh <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.date_of_birth || ''}
                  onChange={(e) =>
                    handleInputChange('date_of_birth', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date_of_birth && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trình độ <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.input_level || ''}
                  onChange={(e) =>
                    handleInputChange('input_level', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.input_level ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn trình độ</option>
                  <option value='A1'>A1 - Mất gốc</option>
                  <option value='A2'>A2 - Sơ cấp</option>
                  <option value='B1'>B1 - Trung cấp thấp</option>
                  <option value='B2'>B2 - Trung cấp cao</option>
                  <option value='C1'>C1 - Nâng cao</option>
                  <option value='proficiency'>Thành thạo</option>
                </select>
                {errors.input_level && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.input_level}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại phụ huynh
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone || ''}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.parent_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập số điện thoại phụ huynh'
                />
                {errors.parent_phone && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.parent_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Địa chỉ</h3>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Địa chỉ
              </label>
              <textarea
                value={formData.bio || ''}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Nhập địa chỉ'
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Liên hệ khẩn cấp
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tên người liên hệ
                </label>
                <input
                  type='text'
                  value={formData.parent_name || ''}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Nhập tên'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone || ''}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.parent_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập số điện thoại'
                />
                {errors.parent_phone && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.parent_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Ghi chú
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Nhập ghi chú về học viên...'
            />
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
