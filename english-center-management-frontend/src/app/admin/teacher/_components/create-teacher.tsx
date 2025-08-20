'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  Clock,
  FileText,
  Calendar,
  MapPin,
} from 'lucide-react';
import { TeacherCreate } from '../../../../types/admin';

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeacher: (teacherData: TeacherCreate) => Promise<void>;
}

export const specializations = [
  { value: 'general-english', label: 'Tiếng Anh tổng quát' },
  { value: 'business-english', label: 'Tiếng Anh thương mại' },
  { value: 'academic-english', label: 'Tiếng Anh học thuật' },
  { value: 'conversation', label: 'Tiếng Anh giao tiếp' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'toeic', label: 'TOEIC' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'young-learners', label: 'Tiếng Anh trẻ em' },
  { value: 'grammar', label: 'Ngữ pháp' },
  { value: 'pronunciation', label: 'Phát âm' },
];

export const qualifications = [
  { value: 'bachelor', label: 'Cử nhân' },
  { value: 'master', label: 'Thạc sĩ' },
  { value: 'phd', label: 'Tiến sĩ' },
  { value: 'tesol', label: 'TESOL' },
  { value: 'tefl', label: 'TEFL' },
  { value: 'celta', label: 'CELTA' },
  { value: 'delta', label: 'DELTA' },
  { value: 'other', label: 'Khác' },
];

export const experienceYears = [
  { value: 0, label: 'Mới tốt nghiệp' },
  { value: 1, label: '1 năm' },
  { value: 2, label: '2 năm' },
  { value: 3, label: '3 năm' },
  { value: 4, label: '4 năm' },
  { value: 5, label: '5 năm' },
  { value: 6, label: '6 năm' },
  { value: 7, label: '7 năm' },
  { value: 8, label: '8 năm' },
  { value: 9, label: '9 năm' },
  { value: 10, label: '10+ năm' },
];

export default function CreateTeacherModal({
  isOpen,
  onClose,
  onCreateTeacher,
}: CreateTeacherModalProps) {
  const [formData, setFormData] = useState<TeacherCreate>({
    name: '',
    email: '',
    phone_number: '',
    specialization: 'general-english',
    education: 'bachelor',
    bio: '',
    password: '',
    experience_years: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherCreate, string>>
  >({});

  // Check if form has any errors
  const hasErrors = () => {
    return Object.values(errors).some(error => error !== undefined && error !== '');
  };

  // Validate form in real-time
  const validateFormRealtime = (data: TeacherCreate) => {
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

    if (!data.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    if (!data.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (data.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
  };

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

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await onCreateTeacher(formData);
      // handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      specialization: 'general-english',
      bio: '',
      password: '',
      date_of_birth: '',
      address: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof TeacherCreate, value: any) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(newFormData);

    // Handle date of birth validation separately
    if (field === "date_of_birth") {
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
          date_of_birth: "Ngày sinh không được vượt quá ngày hiện tại",
        }));
      } else if (selectedDate > minBirthDate) {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: "Giáo viên phải đủ 18 tuổi",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: undefined,
        }));
      }
    } else {
      // Validate form in real-time for other fields
      validateFormRealtime(newFormData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <GraduationCap className='w-6 h-6 text-teal-600' />
            Thêm giáo viên mới
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder='Nhập họ và tên'
                />
                {errors.name && (
                  <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
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
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder='0123456789'
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
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date_of_birth
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
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập địa chỉ'
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <BookOpen className='w-5 h-5 text-teal-600' />
              Thông tin chuyên môn
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2'>
                  Chuyên môn <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange('specialization', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.specialization ? 'border-red-500' : 'border-gray-300'
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
                <label className='text-sm font-medium text-gray-700 mb-2'>
                  Bằng cấp <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.education}
                  onChange={(e) =>
                    handleInputChange('education', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.education ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  {qualifications.map((qual) => (
                    <option key={qual.value} value={qual.value}>
                      {qual.label}
                    </option>
                  ))}
                </select>
                {errors.education && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.education}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  Kinh nghiệm giảng dạy
                </label>
                <select
                  value={formData.experience_years}
                  onChange={(e) =>
                    handleInputChange(
                      'experience_years',
                      Number(e.target.value)
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.experience_years
                      ? 'border-red-500'
                      : 'border-gray-300'
                    }`}
                >
                  {experienceYears.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <FileText className='w-5 h-5 text-teal-600' />
              Giới thiệu
            </h3>

            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              rows={2}
              placeholder='Giới thiệu về bản thân, phương pháp giảng dạy, kinh nghiệm...'
            />
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
              disabled={hasErrors()}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                hasErrors()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <GraduationCap className='w-4 h-4' />
              Thêm giáo viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
