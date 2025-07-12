'use client';

import React, { useState } from 'react';
import { X, User, Phone, Mail, BookOpen, Users, MapPin } from 'lucide-react';
import { CourseLevel } from '../../../../types';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStudent: (studentData: StudentFormData) => Promise<void> | void;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  level: CourseLevel;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const levels = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'advanced', label: 'Nâng cao' },
];

const relationships = [
  { value: 'Father', label: 'Cha' },
  { value: 'Mother', label: 'Mẹ' },
  { value: 'Sibling', label: 'Anh/Chị/Em' },
  { value: 'Spouse', label: 'Vợ/Chồng' },
  { value: 'Friend', label: 'Bạn bè' },
  { value: 'Other', label: 'Khác' },
];

export default function CreateStudentModal({
  isOpen,
  onClose,
  onCreateStudent,
}: CreateStudentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    level: 'beginner',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: 'Father',
    },
  });

  const [errors, setErrors] = useState<
    Partial<
      Record<
        | keyof StudentFormData
        | 'emergencyContactName'
        | 'emergencyContactPhone',
        string
      >
    >
  >({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    }

    if (!formData.emergencyContact.name.trim()) {
      newErrors.emergencyContactName = 'Tên người liên hệ khẩn cấp là bắt buộc';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyContactPhone =
        'Số điện thoại người liên hệ khẩn cấp là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        await onCreateStudent(formData);
        handleClose();
      } catch (error) {
        console.error('Error creating student:', error);
        // You could show an error message here
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      level: 'beginner',
      address: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: 'parent',
      },
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof StudentFormData, value: any) => {
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

  const handleEmergencyContactChange = (
    field: keyof StudentFormData['emergencyContact'],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `emergencyContact${
      field.charAt(0).toUpperCase() + field.slice(1)
    }` as keyof typeof errors;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Thêm học viên mới
          </h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Personal Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <User className='w-5 h-5 text-teal-600' />
              Thông tin cá nhân
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập họ và tên'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày sinh <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange('dateOfBirth', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Mail className='w-4 h-4' />
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='example@email.com'
                />
                {errors.email && (
                  <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Phone className='w-4 h-4' />
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                />
                {errors.phone && (
                  <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
                )}
              </div>

              <div className='md:col-span-2'>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  rows={2}
                  placeholder='Nhập địa chỉ'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <BookOpen className='w-4 h-4' />
                  Trình độ
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    handleInputChange('level', e.target.value as CourseLevel)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Users className='w-5 h-5 text-teal-600' />
              Thông tin liên hệ khẩn cấp
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    handleEmergencyContactChange('name', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.emergencyContactName
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Tên người liên hệ'
                />
                {errors.emergencyContactName && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.emergencyContactName}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    handleEmergencyContactChange('phone', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.emergencyContactPhone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                />
                {errors.emergencyContactPhone && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.emergencyContactPhone}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Mối quan hệ
                </label>
                <select
                  value={formData.emergencyContact.relationship}
                  onChange={(e) =>
                    handleEmergencyContactChange('relationship', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  {relationships.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end space-x-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <User className='w-4 h-4' />
              {isLoading ? 'Đang tạo...' : 'Thêm học viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
