'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  Clock,
  FileText,
  Edit,
  Calendar,
  MapPin,
} from 'lucide-react';
import { TeacherUpdate } from '../../../../types/admin';
import {
  experienceYears,
  qualifications,
  specializations,
} from './create-teacher';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeacher: (teacherData: TeacherUpdate) => void;
  teacher: TeacherUpdate | null;
}

export default function EditTeacherModal({
  isOpen,
  onClose,
  onUpdateTeacher,
  teacher,
}: EditTeacherModalProps) {
  const [formData, setFormData] = useState<TeacherUpdate>({
    name: '',
    email: '',
    phone_number: '',
    specialization: '',
    education: 'bachelor',
    experience_years: 0,
    bio: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherUpdate, string>>
  >({});

  // Check if form has any errors
  const hasErrors = () => {
    return Object.values(errors).some(error => error !== undefined && error !== '');
  };

  // Validate form in real-time
  const validateFormRealtime = (data: TeacherUpdate) => {
    setErrors(() => {
      const newErrors: typeof errors = {};

      if (!data.name.trim()) {
        newErrors.name = 'Họ tên là bắt buộc';
      }

      if (!data.email.trim()) {
        newErrors.email = 'Email là bắt buộc';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = 'Email không hợp lệ';
      }

      if (!data.phone_number.trim()) {
        newErrors.phone_number = 'Số điện thoại là bắt buộc';
      } else if (
        !/^[0-9]{10,11}$/.test(data.phone_number.replace(/\s/g, ''))
      ) {
        newErrors.phone_number = 'Số điện thoại không hợp lệ';
      }

      if (!data.specialization) {
        newErrors.specialization = 'Chuyên môn là bắt buộc';
      }

      if (!data.education) {
        newErrors.education = 'Bằng cấp là bắt buộc';
      }

      return newErrors;
    });
  };

  // Load teacher data when modal opens
  useEffect(() => {
    if (teacher && isOpen) {
      setFormData({
        ...teacher,
      });
      // Validate initial data
      validateFormRealtime({
        ...teacher,
      });
    }
  }, [teacher, isOpen]);

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

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phone_number.replace(/\s/g, ''))
    ) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'Chuyên môn là bắt buộc';
    }

    if (!formData.education) {
      newErrors.education = 'Bằng cấp là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onUpdateTeacher(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      specialization: '',
      education: 'bachelor',
      experience_years: 0,
      bio: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof TeacherUpdate, value: any) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(newFormData);

    // Handle date of birth validation separately
    if (field === 'date_of_birth') {
      const selectedDate = new Date(value);
      const today = new Date();
      const minBirthDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );
      if (selectedDate > today) {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: 'Ngày sinh không được vượt quá ngày hiện tại',
        }));
      } else if (selectedDate > minBirthDate) {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: 'Giáo viên phải đủ 18 tuổi',
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.date_of_birth;
          return newErrors;
        });
      }
    } else {
      // Validate form in real-time for other fields
      validateFormRealtime(newFormData);
    }
  };

  if (!isOpen || !teacher) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <Edit className='w-6 h-6 text-blue-600' />
            Chỉnh sửa thông tin giáo viên
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
          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <User className='w-4 h-4' />
                Họ và tên
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder='Nhập họ và tên'
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
              )}
            </div>

            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                Email
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder='Nhập email'
              />
              {errors.email && (
                <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
              )}
            </div>

            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <Phone className='w-4 h-4' />
                Số điện thoại
              </label>
              <input
                type='tel'
                value={formData.phone_number}
                onChange={(e) =>
                  handleInputChange('phone_number', e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder='Nhập số điện thoại'
              />
              {errors.phone_number && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.phone_number}
                </p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.date_of_birth && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.date_of_birth}
                </p>
              )}
            </div>
          </div>
          {/* Address and Password */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu
              </label>
              <div className='relative'>
                <input
                  type='password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className={`w-full pl-5 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập mật khẩu'
                />
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Qualifications and Experience */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <BookOpen className='w-4 h-4' />
                Chuyên môn
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange('specialization', e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.specialization ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                {specializations.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.specialization}
                </p>
              )}
            </div>

            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <GraduationCap className='w-4 h-4' />
                Bằng cấp
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.education ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                {qualifications.map((qual) => (
                  <option key={qual.value} value={qual.value}>
                    {qual.label}
                  </option>
                ))}
              </select>
              {errors.education && (
                <p className='text-red-500 text-sm mt-1'>{errors.education}</p>
              )}
            </div>

            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                Kinh nghiệm
              </label>
              <select
                value={formData.experience_years}
                onChange={(e) =>
                  handleInputChange(
                    'experience_years',
                    parseInt(e.target.value)
                  )
                }
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                {experienceYears.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
              <FileText className='w-4 h-4' />
              Tiểu sử
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='Nhập tiểu sử giáo viên...'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-4 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={hasErrors()}
              className={`px-6 py-3 rounded-lg transition-colors ${hasErrors()
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
