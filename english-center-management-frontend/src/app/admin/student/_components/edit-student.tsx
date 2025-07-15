'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, User, BookOpen, Save, AlertCircle } from 'lucide-react';
import { UserUpdate } from '../../../../types/admin';

interface EditStudentModalProps {
  student: UserUpdate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: UserUpdate) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<UserUpdate>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
      });
      setErrors({});
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleInputChange = (
    field: string,
    value: string | number | boolean | any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }

    if (!formData.level) {
      newErrors.level = 'Trình độ là bắt buộc';
    }

    if (!formData.status) {
      newErrors.status = 'Trạng thái là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedStudent: UserUpdate = {
        ...student,
        ...formData,
        updatedAt: new Date().toISOString(),
      } as UserUpdate;

      onSave(updatedStudent);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='h-12 w-12 flex-shrink-0'>
              <img
                className='h-12 w-12 rounded-full object-cover'
                src={
                  formData.avatar ||
                  'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=150&h=150&fit=crop&crop=face'
                }
                alt={formData.name}
              />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Chỉnh sửa thông tin học viên
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <User size={20} className='text-blue-500' />
                Thông tin cá nhân
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Họ và tên *
                  </label>
                  <input
                    type='text'
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập họ và tên'
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Ngày sinh
                  </label>
                  <input
                    type='date'
                    value={formData.date_of_birth || ''}
                    onChange={(e) =>
                      handleInputChange('date_of_birth', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Địa chỉ
                  </label>
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    rows={3}
                    placeholder='Nhập địa chỉ'
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <Phone size={20} className='text-green-500' />
                Thông tin liên hệ
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập email'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Số điện thoại *
                  </label>
                  <input
                    type='tel'
                    value={formData.phone_number || ''}
                    onChange={(e) =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập số điện thoại'
                  />
                  {errors.phone_number && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle size={14} />
                      {errors.phone_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Liên hệ phụ huynh
                  </label>
                  <input
                    type='tel'
                    value={formData.parent_phone || ''}
                    onChange={(e) =>
                      handleInputChange('parent_phone', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Nhập số điện thoại phụ huynh'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
              <BookOpen size={20} className='text-purple-500' />
              Thông tin học tập
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mã số học viên *
                </label>
                <input
                  type='text'
                  value={formData.student_id || ''}
                  onChange={(e) =>
                    handleInputChange('student_id', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.student_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập mã số học viên'
                />
                {errors.student_id && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle size={14} />
                    {errors.student_id}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trình độ *
                </label>
                <select
                  value={formData.level || ''}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.level ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn trình độ</option>
                  <option value='beginner'>Sơ cấp</option>
                  <option value='elementary'>Cơ bản</option>
                  <option value='intermediate'>Trung cấp</option>
                  <option value='upper-intermediate'>Trung cao cấp</option>
                  <option value='advanced'>Cao cấp</option>
                  <option value='proficiency'>Thành thạo</option>
                </select>
                {errors.level && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle size={14} />
                    {errors.level}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trạng thái *
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn trạng thái</option>
                  <option value='active'>Đang học</option>
                  <option value='inactive'>Tạm nghỉ</option>
                  <option value='suspended'>Tạm đình chỉ</option>
                  <option value='graduated'>Đã tốt nghiệp</option>
                </select>
                {errors.status && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                    <AlertCircle size={14} />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
              <AlertCircle size={20} className='text-red-500' />
              Thông tin liên hệ khẩn cấp
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Họ và tên
                </label>
                <input
                  type='text'
                  value={formData.parent_name || ''}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập họ và tên'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone || ''}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập số điện thoại'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mối quan hệ
                </label>
                <input
                  type='text'
                  value={formData.parent_name || ''}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Ví dụ: Bố, Mẹ, Anh trai...'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
            >
              <Save size={16} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
