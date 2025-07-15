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
} from 'lucide-react';
import { TeacherUpdate } from '../../../../types/admin';

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeacher: (teacherData: TeacherUpdate) => void;
  teacher: TeacherUpdate | null;
}

const specializations = [
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

const qualifications = [
  { value: 'bachelor', label: 'Cử nhân' },
  { value: 'master', label: 'Thạc sĩ' },
  { value: 'phd', label: 'Tiến sĩ' },
  { value: 'tesol', label: 'TESOL' },
  { value: 'tefl', label: 'TEFL' },
  { value: 'celta', label: 'CELTA' },
  { value: 'delta', label: 'DELTA' },
  { value: 'other', label: 'Khác' },
];

const experienceYears = [
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
    specialization: 'general-english',
    education: 'bachelor',
    experience_years: 0,
    bio: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherUpdate, string>>
  >({});

  // Load teacher data when modal opens
  useEffect(() => {
    if (teacher && isOpen) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone_number: teacher.phone_number || '',
        specialization: teacher.specialization,
        education: teacher.education || 'bachelor',
        experience_years: teacher.experience_years || 0,
        bio: '',
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
      specialization: 'general-english',
      education: 'bachelor',
      experience_years: 0,
      bio: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof TeacherUpdate, value: any) => {
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
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
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <BookOpen className='w-4 h-4' />
                Chuyên môn
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange('specialization', e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.specialization ? 'border-red-500' : 'border-gray-300'
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
          </div>

          {/* Qualifications and Experience */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label className=' text-sm font-medium text-gray-700 mb-2 flex items-center gap-2'>
                <GraduationCap className='w-4 h-4' />
                Bằng cấp
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.education ? 'border-red-500' : 'border-gray-300'
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
              className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
