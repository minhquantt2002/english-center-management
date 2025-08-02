'use client';

import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { StudentCreate } from '../../../../types/admin';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentCreate) => Promise<void>;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentCreate>({
    name: '',
    email: '',
    password: '',
    status: 'active',
    date_of_birth: '',
    input_level: 'beginner',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên học viên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phone_number?.replace(/\s/g, ''))
    ) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newStudent: StudentCreate = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        input_level: formData.input_level,
        address: formData.address || undefined,
        password: formData.password,
        parent_name: formData.parent_name,
        parent_phone: formData.parent_phone,
        status: formData.status,
      };

      // Trước khi gửi studentData lên API, chuyển đổi date_of_birth nếu có
      if (newStudent.date_of_birth) {
        // Chuyển sang định dạng ISO 8601 đầy đủ
        const date = new Date(newStudent.date_of_birth);
        newStudent.date_of_birth = date.toISOString().split("T")[0] + "T00:00:00";
      }

      await onSave(newStudent);

      setFormData({
        name: '',
        email: '',
        password: '',
        status: 'active',
        date_of_birth: '',
        input_level: 'beginner',
        address: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating student:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        date_of_birth: '',
        input_level: 'beginner',
        address: '',
        password: '',
        parent_name: '',
        parent_phone: '',
        status: 'active',
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <User className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Thêm học viên mới
              </h2>
              <p className='text-sm text-gray-500'>
                Nhập thông tin học viên mới
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='h-6 w-6' />
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
              {/* Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên *
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập họ và tên'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email *
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='example@email.com'
                  />
                </div>
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại *
                </label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <input
                    type='tel'
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='0123456789'
                  />
                </div>
                {errors.phone_number && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.phone_number}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày sinh *
                </label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <input
                    type='date'
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleInputChange('date_of_birth', e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.date_of_birth
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date_of_birth && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Địa chỉ
                </label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <input
                    type='text'
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Nhập địa chỉ'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Thông tin học tập
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Level */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trình độ
                </label>
                <select
                  value={formData.input_level}
                  onChange={(e) =>
                    handleInputChange('input_level', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='beginner'>Sơ cấp</option>
                  <option value='elementary'>Cơ bản</option>
                  <option value='intermediate'>Trung cấp</option>
                  <option value='upper-intermediate'>Trung cao cấp</option>
                  <option value='advanced'>Cao cấp</option>
                  <option value='proficiency'>Thành thạo</option>
                </select>
              </div>

              {/* Enrollment Status */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trạng thái đăng ký
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='active'>Đang học</option>
                  <option value='inactive'>Tạm nghỉ</option>
                  <option value='suspended'>Tạm đình chỉ</option>
                  <option value='graduated'>Đã tốt nghiệp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Thông tin liên hệ khác
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tên người liên hệ
                </label>
                <input
                  type='text'
                  value={formData.parent_name}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Tên người liên hệ'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='0123456789'
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2'
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Users className='h-4 w-4' />
                  <span>Tạo học viên</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentModal;
