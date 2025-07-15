'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  MapPin,
  Shield,
  Users,
  UserCheck,
  UserPlus,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserCreate } from '../../../../types/admin';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: UserCreate) => void;
}

const userRoles = [
  { value: 'admin', label: 'Quản trị viên', icon: Shield },
  { value: 'teacher', label: 'Giáo viên', icon: GraduationCap },
  { value: 'student', label: 'Học viên', icon: UserCheck },
  { value: 'staff', label: 'Nhân viên', icon: Users },
];

const userStatuses = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'suspended', label: 'Tạm đình chỉ' },
];

const courseLevels = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'upper-intermediate', label: 'Trung cấp cao' },
  { value: 'advanced', label: 'Nâng cao' },
  { value: 'proficiency', label: 'Thành thạo' },
];

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

const departments = [
  'Quản lý',
  'Giảng dạy',
  'Học vụ',
  'Tài chính',
  'Marketing',
  'Hỗ trợ kỹ thuật',
  'Nhân sự',
];

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreateUser,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<UserCreate>({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role_name: 'student',
    status: 'active',
    date_of_birth: '',
    address: '',
    specialization: 'general-english',
    education: 'bachelor',
    experience_years: 0,
    bio: '',
    input_level: 'beginner',
    level: 'beginner',
    parent_name: '',
    parent_phone: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserCreate, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Basic validation
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

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    // Role-specific validation
    if (formData.role_name === 'teacher') {
      if (!formData.specialization) {
        newErrors.specialization = 'Chuyên môn là bắt buộc';
      }
      if (!formData.education) {
        newErrors.education = 'Bằng cấp là bắt buộc';
      }
      if (formData.experience_years && formData.experience_years <= 0) {
        newErrors.experience_years = 'Kinh nghiệm là bắt buộc';
      }
    }

    if (formData.role_name === 'student') {
      if (!formData.level) {
        newErrors.level = 'Trình độ là bắt buộc';
      }
      if (!formData.input_level) {
        newErrors.input_level = 'Trình độ là bắt buộc';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onCreateUser(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      password: '',
      role_name: 'student',
      status: 'active',
      date_of_birth: '',
      address: '',
      specialization: 'general-english',
      education: 'bachelor',
      experience_years: 0,
      bio: '',
      input_level: 'beginner',
      level: 'beginner',
      parent_name: '',
      parent_phone: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setNewLanguage('');
    setNewCertification('');
    onClose();
  };

  const handleInputChange = (field: keyof UserCreate, value: any) => {
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

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <UserPlus className='w-6 h-6 text-blue-600' />
            Tạo tài khoản mới
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
          {/* Role Selection */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <Shield className='w-5 h-5 text-blue-600' />
              Loại tài khoản
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {userRoles.map((role) => {
                const IconComponent = role.icon;
                return (
                  <button
                    key={role.value}
                    type='button'
                    onClick={() => handleInputChange('role_name', role.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.role_name === role.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className='w-6 h-6 mx-auto mb-2' />
                    <p className='text-sm font-medium'>{role.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
              <User className='w-5 h-5 text-blue-600' />
              Thông tin cơ bản
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange('phone_number', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone_number ? 'border-red-500' : 'border-gray-300'
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
                <label className='text-sm font-medium text-gray-700 mb-2'>
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  {userStatuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Lock className='w-4 h-4' />
                  Mật khẩu <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập mật khẩu'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Lock className='w-4 h-4' />
                  Xác nhận mật khẩu <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Nhập lại mật khẩu'
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  Ngày sinh
                </label>
                <input
                  type='date'
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleInputChange('date_of_birth', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>

              <div className='md:col-span-2'>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <MapPin className='w-4 h-4' />
                  Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Nhập địa chỉ'
                />
              </div>
            </div>
          </div>

          {/* Teacher Specific Fields */}
          {formData.role_name === 'teacher' && (
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <GraduationCap className='w-5 h-5 text-orange-600' />
                Thông tin giáo viên
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.specialization
                        ? 'border-red-500'
                        : 'border-gray-300'
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.education}
                    </p>
                  )}
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
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
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  >
                    {experienceYears.map((exp) => (
                      <option key={exp.value} value={exp.value}>
                        {exp.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Mức lương theo giờ (VNĐ)
                  </label>
                  <input
                    type='number'
                    value={formData.experience_years}
                    onChange={(e) =>
                      handleInputChange(
                        'experience_years',
                        Number(e.target.value)
                      )
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.experience_years
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder='200000'
                    min='0'
                  />
                  {errors.experience_years && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.experience_years}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className='mt-4'>
                <h4 className='text-md font-medium text-gray-900 mb-3 flex items-center gap-2'>
                  <FileText className='w-4 h-4 text-orange-600' />
                  Giới thiệu
                </h4>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                  rows={3}
                  placeholder='Giới thiệu về bản thân, phương pháp giảng dạy, kinh nghiệm...'
                />
              </div>
            </div>
          )}

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
              className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2'
            >
              <UserPlus className='w-4 h-4' />
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
