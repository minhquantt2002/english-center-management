'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  GraduationCap,
  Calendar,
  MapPin,
  Shield,
  Users,
  UserCheck,
  UserPlus,
  Globe,
  Award,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { UserRole, UserStatus, CourseLevel } from '../../../../types/common';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: UserFormData) => void;
}

export interface UserFormData {
  // Basic information
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  status: UserStatus;

  // Additional fields based on role
  dateOfBirth?: string;
  address?: string;

  // Teacher specific
  specialization?: string;
  qualification?: string;
  experience?: number;
  hourlyRate?: number;
  bio?: string;
  languages?: string[];
  certifications?: string[];

  // Student specific
  studentId?: string;
  level?: CourseLevel;
  enrollmentDate?: string;
  parentContact?: string;
  notes?: string;
  currentClass?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };

  // Admin/Staff specific
  employeeId?: string;
  department?: string;
  position?: string;
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
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    status: 'active',
    dateOfBirth: '',
    address: '',
    specialization: 'general-english',
    qualification: 'bachelor',
    experience: 0,
    hourlyRate: 0,
    bio: '',
    languages: ['Tiếng Anh'],
    certifications: [],
    studentId: '',
    level: 'beginner',
    enrollmentDate: new Date().toISOString().split('T')[0],
    parentContact: '',
    notes: '',
    currentClass: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    employeeId: '',
    department: 'Quản lý',
    position: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    // Role-specific validation
    if (formData.role === 'teacher') {
      if (!formData.specialization) {
        newErrors.specialization = 'Chuyên môn là bắt buộc';
      }
      if (!formData.qualification) {
        newErrors.qualification = 'Bằng cấp là bắt buộc';
      }
      if (formData.hourlyRate && formData.hourlyRate <= 0) {
        newErrors.hourlyRate = 'Mức lương theo giờ phải lớn hơn 0';
      }
    }

    if (formData.role === 'student') {
      if (!formData.level) {
        newErrors.level = 'Trình độ là bắt buộc';
      }
      if (!formData.enrollmentDate) {
        newErrors.enrollmentDate = 'Ngày đăng ký là bắt buộc';
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
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      status: 'active',
      dateOfBirth: '',
      address: '',
      specialization: 'general-english',
      qualification: 'bachelor',
      experience: 0,
      hourlyRate: 0,
      bio: '',
      languages: ['Tiếng Anh'],
      certifications: [],
      studentId: '',
      level: 'beginner',
      enrollmentDate: new Date().toISOString().split('T')[0],
      parentContact: '',
      notes: '',
      currentClass: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      employeeId: '',
      department: 'Quản lý',
      position: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setNewLanguage('');
    setNewCertification('');
    onClose();
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
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
      !formData.languages?.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), newLanguage.trim()],
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages?.filter((lang) => lang !== language) || [],
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications?.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [
          ...(prev.certifications || []),
          newCertification.trim(),
        ],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications:
        prev.certifications?.filter((cert) => cert !== certification) || [],
    }));
  };

  const getRoleIcon = (role: UserRole) => {
    const roleData = userRoles.find((r) => r.value === role);
    return roleData ? roleData.icon : User;
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
                    onClick={() => handleInputChange('role', role.value)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      formData.role === role.value
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                />
                {errors.phone && (
                  <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>
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
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-gray-300'
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
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  Ngày sinh
                </label>
                <input
                  type='date'
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange('dateOfBirth', e.target.value)
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
          {formData.role === 'teacher' && (
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
                    value={formData.qualification}
                    onChange={(e) =>
                      handleInputChange('qualification', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.qualification
                        ? 'border-red-500'
                        : 'border-gray-300'
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
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Kinh nghiệm giảng dạy
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) =>
                      handleInputChange('experience', Number(e.target.value))
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
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      handleInputChange('hourlyRate', Number(e.target.value))
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
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

              {/* Languages */}
              <div className='mt-4'>
                <h4 className='text-md font-medium text-gray-900 mb-3 flex items-center gap-2'>
                  <Globe className='w-4 h-4 text-orange-600' />
                  Ngôn ngữ
                </h4>
                <div className='space-y-3'>
                  <div className='flex gap-2'>
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
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
                      className='px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors'
                    >
                      Thêm
                    </button>
                  </div>

                  {formData.languages && formData.languages.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {formData.languages.map((language) => (
                        <span
                          key={language}
                          className='inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm'
                        >
                          {language}
                          <button
                            type='button'
                            onClick={() => removeLanguage(language)}
                            className='hover:text-orange-600'
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
              <div className='mt-4'>
                <h4 className='text-md font-medium text-gray-900 mb-3 flex items-center gap-2'>
                  <Award className='w-4 h-4 text-orange-600' />
                  Chứng chỉ
                </h4>
                <div className='space-y-3'>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      placeholder='Nhập tên chứng chỉ'
                    />
                    <button
                      type='button'
                      onClick={addCertification}
                      className='px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors'
                    >
                      Thêm
                    </button>
                  </div>

                  {formData.certifications &&
                    formData.certifications.length > 0 && (
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

          {/* Student Specific Fields */}
          {formData.role === 'student' && (
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <UserCheck className='w-5 h-5 text-purple-600' />
                Thông tin học viên
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Mã học viên
                  </label>
                  <input
                    type='text'
                    value={formData.studentId}
                    onChange={(e) =>
                      handleInputChange('studentId', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='STU-2024-001'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Trình độ <span className='text-red-500'>*</span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.level ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {courseLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.level && (
                    <p className='text-red-500 text-sm mt-1'>{errors.level}</p>
                  )}
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Ngày đăng ký <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='date'
                    value={formData.enrollmentDate}
                    onChange={(e) =>
                      handleInputChange('enrollmentDate', e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.enrollmentDate
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.enrollmentDate && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.enrollmentDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Liên hệ phụ huynh
                  </label>
                  <input
                    type='tel'
                    value={formData.parentContact}
                    onChange={(e) =>
                      handleInputChange('parentContact', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='0123456789'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Lớp hiện tại
                  </label>
                  <input
                    type='text'
                    value={formData.currentClass}
                    onChange={(e) =>
                      handleInputChange('currentClass', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    placeholder='Lớp A1'
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className='mt-4'>
                <h4 className='text-md font-medium text-gray-900 mb-3 flex items-center gap-2'>
                  <Phone className='w-4 h-4 text-purple-600' />
                  Liên hệ khẩn cấp
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700 mb-2'>
                      Họ tên
                    </label>
                    <input
                      type='text'
                      value={formData.emergencyContact?.name}
                      onChange={(e) =>
                        handleInputChange('emergencyContact', {
                          ...formData.emergencyContact,
                          name: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Họ tên người liên hệ'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 mb-2'>
                      Số điện thoại
                    </label>
                    <input
                      type='tel'
                      value={formData.emergencyContact?.phone}
                      onChange={(e) =>
                        handleInputChange('emergencyContact', {
                          ...formData.emergencyContact,
                          phone: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='0123456789'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-700 mb-2'>
                      Mối quan hệ
                    </label>
                    <input
                      type='text'
                      value={formData.emergencyContact?.relationship}
                      onChange={(e) =>
                        handleInputChange('emergencyContact', {
                          ...formData.emergencyContact,
                          relationship: e.target.value,
                        })
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Cha, mẹ, anh, chị...'
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className='mt-4'>
                <label className='text-sm font-medium text-gray-700 mb-2'>
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  rows={3}
                  placeholder='Ghi chú về học viên...'
                />
              </div>
            </div>
          )}

          {/* Admin/Staff Specific Fields */}
          {(formData.role === 'admin' || formData.role === 'staff') && (
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <Shield className='w-5 h-5 text-green-600' />
                Thông tin nhân viên
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Mã nhân viên
                  </label>
                  <input
                    type='text'
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange('employeeId', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    placeholder='EMP-2024-001'
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Phòng ban
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange('department', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2'>
                    Chức vụ
                  </label>
                  <input
                    type='text'
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange('position', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    placeholder='Nhân viên, Trưởng phòng, Giám đốc...'
                  />
                </div>
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
