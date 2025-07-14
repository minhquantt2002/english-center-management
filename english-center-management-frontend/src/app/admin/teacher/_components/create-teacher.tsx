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
  DollarSign,
  Globe,
  Award,
  FileText,
} from 'lucide-react';

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeacher: (teacherData: TeacherFormData) => void;
}

export interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  hourlyRate: number;
  bio: string;
  languages: string[];
  certifications: string[];
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

const commonLanguages = [
  'Tiếng Anh',
  'Tiếng Việt',
  'Tiếng Trung',
  'Tiếng Nhật',
  'Tiếng Hàn',
  'Tiếng Pháp',
  'Tiếng Đức',
  'Tiếng Tây Ban Nha',
  'Tiếng Ý',
  'Tiếng Nga',
];

export default function CreateTeacherModal({
  isOpen,
  onClose,
  onCreateTeacher,
}: CreateTeacherModalProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    phone: '',
    specialization: 'general-english',
    qualification: 'bachelor',
    experience: 0,
    hourlyRate: 0,
    bio: '',
    languages: ['Tiếng Anh'],
    certifications: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherFormData, string>>
  >({});
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

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

    if (!formData.specialization) {
      newErrors.specialization = 'Chuyên môn là bắt buộc';
    }

    if (!formData.qualification) {
      newErrors.qualification = 'Bằng cấp là bắt buộc';
    }

    if (formData.hourlyRate <= 0) {
      newErrors.hourlyRate = 'Mức lương theo giờ phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onCreateTeacher(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: 'general-english',
      qualification: 'bachelor',
      experience: 0,
      hourlyRate: 0,
      bio: '',
      languages: ['Tiếng Anh'],
      certifications: [],
    });
    setErrors({});
    setNewLanguage('');
    setNewCertification('');
    onClose();
  };

  const handleInputChange = (field: keyof TeacherFormData, value: any) => {
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

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang !== language),
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (cert) => cert !== certification
      ),
    }));
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

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <DollarSign className='w-4 h-4' />
                  Mức lương theo giờ (VNĐ){' '}
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    handleInputChange('hourlyRate', Number(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.hourlyRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='200000'
                  min='0'
                />
                {errors.hourlyRate && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.hourlyRate}
                  </p>
                )}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
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

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2'>
                  Bằng cấp <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) =>
                    handleInputChange('qualification', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {qualifications.map((qual) => (
                    <option key={qual.value} value={qual.value}>
                      {qual.label}
                    </option>
                  ))}
                </select>
                {errors.qualification && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.qualification}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Clock className='w-4 h-4' />
                  Kinh nghiệm giảng dạy
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) =>
                    handleInputChange('experience', Number(e.target.value))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
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

          {/* Languages */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Globe className='w-5 h-5 text-teal-600' />
              Ngôn ngữ
            </h3>

            <div className='space-y-4'>
              <div className='flex gap-2'>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                >
                  <option value=''>Chọn ngôn ngữ</option>
                  {commonLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <button
                  type='button'
                  onClick={addLanguage}
                  className='px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors'
                >
                  Thêm
                </button>
              </div>

              {formData.languages.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {formData.languages.map((language) => (
                    <span
                      key={language}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm'
                    >
                      {language}
                      <button
                        type='button'
                        onClick={() => removeLanguage(language)}
                        className='hover:text-teal-600'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Award className='w-5 h-5 text-teal-600' />
              Chứng chỉ
            </h3>

            <div className='space-y-4'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  placeholder='Nhập tên chứng chỉ'
                />
                <button
                  type='button'
                  onClick={addCertification}
                  className='px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors'
                >
                  Thêm
                </button>
              </div>

              {formData.certifications.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {formData.certifications.map((certification) => (
                    <span
                      key={certification}
                      className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                    >
                      {certification}
                      <button
                        type='button'
                        onClick={() => removeCertification(certification)}
                        className='hover:text-blue-600'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
              rows={4}
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
              className='px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2'
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
