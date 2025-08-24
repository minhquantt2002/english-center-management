'use client';

import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  X,
  Lock,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TeacherCreate } from '../../../../types/admin';

interface CreateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeacher: (teacherData: TeacherCreate) => Promise<void>;
}

const INITIAL_FORM_DATA: TeacherCreate = {
  name: '',
  email: '',
  phone_number: '',
  specialization: 'general-english',
  education: 'bachelor',
  bio: '',
  experience_years: 0,
  date_of_birth: '',
  address: '',
};

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
    experience_years: 0,
    date_of_birth: '',
    address: '',
  });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Progressive validation - only show errors when appropriate
  const shouldShowError = (field: string) => {
    return formSubmitted || touchedFields[field];
  };
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherCreate, string>>
  >({});

  // Validation helpers for button logic (always validate)
  const isValidEmail = (email: string) => {
    return email.trim() !== '' && /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return (
      phone.trim() !== '' && /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))
    );
  };

  const isValidDate = (date: string) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return selectedDate <= today && selectedDate <= minBirthDate;
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    const requiredFields = [
      formData.name.trim(),
      formData.email.trim(),
      formData.phone_number.trim(),
      formData.date_of_birth,
    ];
    const hasRequiredFields = requiredFields.every(
      (field) => field !== '' && field !== undefined
    );
    const hasValidFormats =
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone_number) &&
      isValidDate(formData.date_of_birth) &&
      formData.name.trim().length > 0;
    return hasRequiredFields && hasValidFormats;
  };

  // Validate field for display
  const validateFieldForDisplay = (field: string, value: any) => {
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === 'name') {
        if (!value.trim()) {
          newErrors.name = 'Họ tên là bắt buộc';
        } else {
          delete newErrors.name;
        }
      } else if (field === 'email') {
        if (!value.trim()) {
          newErrors.email = 'Email là bắt buộc';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Email không hợp lệ';
        } else {
          delete newErrors.email;
        }
      } else if (field === 'phone_number') {
        if (!value.trim()) {
          newErrors.phone_number = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone_number = 'Số điện thoại không hợp lệ';
        } else {
          delete newErrors.phone_number;
        }
      } else if (field === 'specialization') {
        if (!value) {
          newErrors.specialization = 'Chuyên môn là bắt buộc';
        } else {
          delete newErrors.specialization;
        }
      } else if (field === 'date_of_birth') {
        if (!value) {
          delete newErrors.date_of_birth;
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          const minBirthDate = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
          );
          if (selectedDate > today) {
            newErrors.date_of_birth =
              'Ngày sinh không được vượt quá ngày hiện tại';
          } else if (selectedDate > minBirthDate) {
            newErrors.date_of_birth = 'Ngày sinh không được nhỏ hơn 18 tuổi';
          } else {
            delete newErrors.date_of_birth;
          }
        }
      } else if (field === 'password') {
        if (!value) {
          newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (value.trim().length < 6) {
          newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else {
          delete newErrors.password;
        }
      }

      return newErrors;
    });
  };

  // Validate all fields for form submission
  const validateAllFields = () => {
    const fieldsToValidate = [
      'name',
      'email',
      'phone_number',
      'specialization',
      'date_of_birth',
    ];
    fieldsToValidate.forEach((field) => {
      validateFieldForDisplay(field, formData[field as keyof TeacherCreate]);
    });
    return Object.keys(errors).length === 0 && isFormValid();
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate field when user leaves it
    validateFieldForDisplay(field, formData[field as keyof TeacherCreate]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setSubmitError('');
    // Mark all required fields as touched
    const requiredFields = [
      'name',
      'email',
      'phone_number',
      'specialization',
      'date_of_birth',
    ];
    setTouchedFields((prev) => {
      const newTouchedFields = { ...prev };
      requiredFields.forEach((field) => {
        newTouchedFields[field] = true;
      });
      return newTouchedFields;
    });

    const isValid = validateAllFields();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    try {
      const newTeacher: TeacherCreate = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        specialization: formData.specialization,
        bio: formData.bio.trim(),
        date_of_birth: formData.date_of_birth,
        address: formData.address.trim(),
        password: formData.password.trim(),
        education: formData.education,
        experience_years: formData.experience_years,
      };
      await onCreateTeacher(newTeacher);
    } catch (error) {
      console.error('Error creating teacher:', error);
      setSubmitError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      setTouchedFields({});
      setFormSubmitted(false);
      setSubmitError('');
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(newFormData);
    setSubmitError(''); // Clear submit error when user makes changes

    // Progressive error display - only show if field has been touched or form submitted
    if (shouldShowError(field)) {
      validateFieldForDisplay(field, value);
    }
  };
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    };
  }, [isSubmitting]);

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
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-6'
        >
          {/* Submit Error Message */}
          {submitError && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-sm text-red-600'>{submitError}</p>
            </div>
          )}
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
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    shouldShowError('name') && errors.name
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Nhập họ và tên'
                  aria-describedby={
                    shouldShowError('name') && errors.name
                      ? 'name-error'
                      : undefined
                  }
                />
                {shouldShowError('name') && errors.name && (
                  <p
                    id='name-error'
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.name}
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
                  onBlur={() => handleFieldBlur('email')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    shouldShowError('email') && errors.email
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='example@email.com'
                  aria-describedby={
                    shouldShowError('email') && errors.email
                      ? 'email-error'
                      : undefined
                  }
                />
                {shouldShowError('email') && errors.email && (
                  <p
                    id='email-error'
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.email}
                  </p>
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
                  onBlur={() => handleFieldBlur('phone_number')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    shouldShowError('phone_number') && errors.phone_number
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='0123456789'
                  aria-describedby={
                    shouldShowError('phone_number') && errors.phone_number
                      ? 'phone-error'
                      : undefined
                  }
                />
                {shouldShowError('phone_number') && errors.phone_number && (
                  <p
                    id='phone-error'
                    className='text-red-500 text-sm mt-1'
                  >
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
                    onBlur={() => handleFieldBlur('date_of_birth')}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      shouldShowError('date_of_birth') && errors.date_of_birth
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    aria-describedby={
                      shouldShowError('date_of_birth') && errors.date_of_birth
                        ? 'date-error'
                        : undefined
                    }
                  />
                </div>
                {shouldShowError('date_of_birth') && errors.date_of_birth && (
                  <p
                    id='date-error'
                    className='mt-1 text-sm text-red-600'
                  >
                    {errors.date_of_birth}
                  </p>
                )}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 my-2'>
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
                <label className='text-sm font-medium text-gray-700 flex my-2'>
                  <Lock className=' h-4 w-4' />
                  Mật khẩu <span className='text-red-500'>*</span>
                </label>
                <input
                  type='password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('password')}
                  className={`w-full pl-5 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    shouldShowError('password') && errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Nhập mật khẩu'
                  aria-describedby={
                    shouldShowError('password') && errors.password
                      ? 'password-error'
                      : undefined
                  }
                />
                {shouldShowError('password') && errors.password && (
                  <p
                    id='password-error'
                    className='text-red-500 text-sm mt-1'
                  >
                    {errors.password}
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
                    <option
                      key={spec.value}
                      value={spec.value}
                    >
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.education ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {qualifications.map((qual) => (
                    <option
                      key={qual.value}
                      value={qual.value}
                    >
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.experience_years
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  {experienceYears.map((exp) => (
                    <option
                      key={exp.value}
                      value={exp.value}
                    >
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
              disabled={isSubmitting}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting || !isFormValid()}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting || !isFormValid()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <GraduationCap className='w-4 h-4' />
                  Thêm giáo viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
