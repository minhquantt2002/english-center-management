'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { StudentCreate } from '../../../../types/admin';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: StudentCreate) => Promise<void>;
}

// Initial form data constant for consistency
const INITIAL_FORM_DATA: StudentCreate = {
  name: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  input_level: 'A1',
  address: '',
  password: '',
  parent_name: '',
  parent_phone: '',
  status: 'active',
};

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentCreate>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Progressive validation - only show errors when appropriate
  const shouldShowError = (field: string) => {
    return formSubmitted || touchedFields[field];
  };

  // Validation helpers for button logic (always validate)
  const isValidEmail = (email: string) => {
    return email.trim() !== '' && /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return (
      phone.trim() !== '' && /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))
    );
  };

  const isValidPassword = (password: string) => {
    return password.trim() !== '' && password.length >= 6;
  };

  const isValidDate = (date: string) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
  };

  // Button validation logic (independent of UI state)
  const isFormValidForSubmit = () => {
    const requiredFields = [
      formData.name.trim(),
      formData.email.trim(),
      formData.phone_number?.trim(),
      formData.date_of_birth,
      formData.password.trim(),
    ];

    // Check required fields
    const hasRequiredFields = requiredFields.every(
      (field) => field !== '' && field !== undefined
    );

    // Check format validation
    const hasValidFormats =
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone_number || '') &&
      isValidPassword(formData.password) &&
      isValidDate(formData.date_of_birth) &&
      formData.name.trim().length > 0;

    return hasRequiredFields && hasValidFormats;
  };

  // Validate single field for display (with detailed messages)
  const validateFieldForDisplay = (field: string, value: any) => {
    setErrors((prev) => {
      const newErrors = { ...prev };

      switch (field) {
        case 'name':
          if (!value.trim()) {
            newErrors.name = 'Tên học viên là bắt buộc';
          } else {
            delete newErrors.name;
          }
          break;

        case 'email':
          if (!value.trim()) {
            newErrors.email = 'Email là bắt buộc';
          } else if (!/\S+@\S+\.\S+/.test(value)) {
            newErrors.email = 'Email không hợp lệ';
          } else {
            delete newErrors.email;
          }
          break;

        case 'phone_number':
          if (!value?.trim()) {
            newErrors.phone_number = 'Số điện thoại là bắt buộc';
          } else if (!/^[0-9]{10,11}$/.test(value?.replace(/\s/g, ''))) {
            newErrors.phone_number = 'Số điện thoại không hợp lệ';
          } else {
            delete newErrors.phone_number;
          }
          break;

        case 'password':
          if (!value.trim()) {
            newErrors.password = 'Mật khẩu là bắt buộc';
          } else if (value.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
          } else {
            delete newErrors.password;
          }
          break;

        case 'date_of_birth':
          if (!value) {
            delete newErrors.date_of_birth;
          } else {
            const selectedDate = new Date(value);
            const today = new Date();
            if (selectedDate > today) {
              newErrors.date_of_birth =
                'Ngày sinh không được vượt quá ngày hiện tại';
            } else {
              delete newErrors.date_of_birth;
            }
          }
          break;

        default:
          break;
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
      'password',
      'date_of_birth',
    ];

    fieldsToValidate.forEach((field) => {
      validateFieldForDisplay(field, formData[field as keyof StudentCreate]);
    });

    // Check if there are any errors after validation
    return Object.keys(errors).length === 0 && isFormValidForSubmit();
  };

  const handleInputChange = (field: string, value: string) => {
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

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate field when user leaves it
    validateFieldForDisplay(field, formData[field as keyof StudentCreate]);
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
      'password',
      'date_of_birth',
    ];
    setTouchedFields((prev) => {
      const newTouched = { ...prev };
      requiredFields.forEach((field) => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
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

      await onSave(newStudent);
      handleClose();
    } catch (error) {
      console.error('Error creating student:', error);
      setSubmitError('Có lỗi xảy ra khi tạo học viên. Vui lòng thử lại.');
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
            aria-label='Đóng modal'
          >
            <X className='h-6 w-6' />
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
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className='mt-1 text-sm text-red-600'
                  >
                    {errors.name}
                  </p>
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
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                </div>
                {shouldShowError('email') && errors.email && (
                  <p
                    id='email-error'
                    className='mt-1 text-sm text-red-600'
                  >
                    {errors.email}
                  </p>
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
                    value={formData.phone_number || ''}
                    onChange={(e) =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('phone_number')}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                </div>
                {shouldShowError('phone_number') && errors.phone_number && (
                  <p
                    id='phone-error'
                    className='mt-1 text-sm text-red-600'
                  >
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
                    onBlur={() => handleFieldBlur('date_of_birth')}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      shouldShowError('date_of_birth') && errors.date_of_birth
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    aria-describedby={
                      shouldShowError('date_of_birth') && errors.date_of_birth
                        ? 'dob-error'
                        : undefined
                    }
                  />
                </div>
                {shouldShowError('date_of_birth') && errors.date_of_birth && (
                  <p
                    id='dob-error'
                    className='mt-1 text-sm text-red-600'
                  >
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
                    value={formData.address || ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Nhập địa chỉ'
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Mật khẩu *
                </label>
                <input
                  type='password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('password')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    shouldShowError('password') && errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Nhập mật khẩu (tối thiểu 6 ký tự)'
                  aria-describedby={
                    shouldShowError('password') && errors.password
                      ? 'password-error'
                      : undefined
                  }
                />
                {shouldShowError('password') && errors.password && (
                  <p
                    id='password-error'
                    className='mt-1 text-sm text-red-600'
                  >
                    {errors.password}
                  </p>
                )}
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
                  <option value='A1'>A1 - Mất gốc</option>
                  <option value='A2'>A2 - Sơ cấp</option>
                  <option value='B1'>B1 - Trung cấp thấp</option>
                  <option value='B2'>B2 - Trung cấp cao</option>
                  <option value='C1'>C1 - Nâng cao</option>
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
                  <option value='inactive'>Đã huỷ</option>
                  <option value='graduated'>Đã hoàn thành</option>
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
                  value={formData.parent_name || ''}
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
                  value={formData.parent_phone || ''}
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
              disabled={isSubmitting || !isFormValidForSubmit()}
              className={`px-4 py-2 text-sm font-medium border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2 ${
                isSubmitting || !isFormValidForSubmit()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
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
