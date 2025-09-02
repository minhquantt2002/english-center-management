'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  User,
  BookOpen,
  Save,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { UserUpdate } from '../../../../types/admin';
import { getInitials } from '../../../staff/list-teacher/page';

interface EditStudentModalProps {
  student: UserUpdate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: UserUpdate) => Promise<void>;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<UserUpdate>>({});
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
    return email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return (
      phone.trim() !== '' && /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))
    );
  };

  const isValidDate = (date: string) => {
    if (!date) return true; // Optional field
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate <= today;
  };

  // Button validation logic (independent of UI state)
  const isFormValidForSubmit = () => {
    if (!formData.name?.trim()) return false;
    if (!isValidEmail(formData.email || '')) return false;
    if (!isValidPhone(formData.phone_number || '')) return false;
    if (!formData.input_level) return false;
    if (!formData.status) return false;
    if (!isValidDate(formData.date_of_birth || '')) return false;

    // Check parent_phone if provided
    if (formData.parent_phone && !isValidPhone(formData.parent_phone))
      return false;

    return true;
  };

  // Validate single field for display (with detailed messages)
  const validateFieldForDisplay = (field: string, value: any) => {
    setErrors((prev) => {
      const newErrors = { ...prev };

      switch (field) {
        case 'name':
          if (!value?.trim()) {
            newErrors.name = 'Họ và tên là bắt buộc';
          } else {
            delete newErrors.name;
          }
          break;

        case 'email':
          if (!value?.trim()) {
            newErrors.email = 'Email là bắt buộc';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = 'Email không hợp lệ';
          } else {
            delete newErrors.email;
          }
          break;

        case 'phone_number':
          if (!value?.trim()) {
            newErrors.phone_number = 'Số điện thoại là bắt buộc';
          } else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
            newErrors.phone_number = 'Số điện thoại không hợp lệ';
          } else {
            delete newErrors.phone_number;
          }
          break;

        case 'input_level':
          if (!value) {
            newErrors.input_level = 'Trình độ là bắt buộc';
          } else {
            delete newErrors.input_level;
          }
          break;

        case 'status':
          if (!value) {
            newErrors.status = 'Trạng thái là bắt buộc';
          } else {
            delete newErrors.status;
          }
          break;

        case 'date_of_birth':
          if (value) {
            const selectedDate = new Date(value);
            const today = new Date();
            if (selectedDate > today) {
              newErrors.date_of_birth =
                'Ngày sinh không được vượt quá ngày hiện tại';
            } else {
              delete newErrors.date_of_birth;
            }
          } else {
            delete newErrors.date_of_birth;
          }
          break;

        case 'parent_phone':
          if (value && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
            newErrors.parent_phone = 'Số điện thoại phụ huynh không hợp lệ';
          } else {
            delete newErrors.parent_phone;
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
      'input_level',
      'status',
      'date_of_birth',
      'parent_phone',
    ];

    fieldsToValidate.forEach((field) => {
      validateFieldForDisplay(field, formData[field as keyof UserUpdate]);
    });

    // Return true if no errors and form is valid for submit
    return Object.keys(errors).length === 0 && isFormValidForSubmit();
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean | any
  ) => {
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
    validateFieldForDisplay(field, formData[field as keyof UserUpdate]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormSubmitted(true);
    setSubmitError('');

    // Mark all required fields as touched
    const fieldsToTouch = [
      'name',
      'email',
      'phone_number',
      'input_level',
      'status',
    ];
    setTouchedFields((prev) => {
      const newTouched = { ...prev };
      fieldsToTouch.forEach((field) => {
        newTouched[field] = true;
      });
      return newTouched;
    });

    // Validate all fields
    const isValid = validateAllFields();

    if (!isValid) {
      return;
    }

    if (!student) return;

    setIsSubmitting(true);

    try {
      const updatedStudent: UserUpdate = {
        ...student,
        ...formData,
        updatedAt: new Date().toLocaleDateString('vi-VN'),
      } as UserUpdate;

      await onSave(updatedStudent);
      handleClose();
    } catch (error) {
      console.error('Error updating student:', error);
      setSubmitError(
        'Có lỗi xảy ra khi cập nhật thông tin học viên. Vui lòng thử lại.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      setTouchedFields({});
      setFormSubmitted(false);
      setSubmitError('');
      onClose();
    }
  };

  // Initialize form data when student prop changes
  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
      });
      // Reset validation state
      setErrors({});
      setTouchedFields({});
      setFormSubmitted(false);
      setSubmitError('');
    }
  }, [student]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    };
  }, [isSubmitting]);

  if (!isOpen || !student) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='h-12 w-12 flex-shrink-0'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                {getInitials(student.name.charAt(0))}
              </div>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Chỉnh sửa thông tin học viên
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className='text-gray-400 hover:text-gray-600 transition-colors'
            aria-label='Đóng modal'
          >
            <X size={24} />
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <User
                  size={20}
                  className='text-blue-500'
                />
                Thông tin cá nhân
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Họ và tên *
                  </label>
                  <input
                    type='text'
                    value={formData.name || ''}
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
                      className='text-red-500 text-sm mt-1 flex items-center gap-1'
                    >
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Ngày sinh
                  </label>
                  <div className='relative'>
                    <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                    <input
                      type='date'
                      value={formData.date_of_birth?.split('T')[0] || ''}
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
                      className='text-red-500 text-sm mt-1 flex items-center gap-1'
                    >
                      <AlertCircle size={14} />
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Địa chỉ
                  </label>
                  <input
                    type='text'
                    value={formData.address || ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Nhập địa chỉ'
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <Phone
                  size={20}
                  className='text-green-500'
                />
                Thông tin liên hệ
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      shouldShowError('email') && errors.email
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder='Nhập email'
                    aria-describedby={
                      shouldShowError('email') && errors.email
                        ? 'email-error'
                        : undefined
                    }
                  />
                  {shouldShowError('email') && errors.email && (
                    <p
                      id='email-error'
                      className='text-red-500 text-sm mt-1 flex items-center gap-1'
                    >
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Số điện thoại *
                  </label>
                  <input
                    type='tel'
                    value={formData.phone_number || ''}
                    onChange={(e) =>
                      handleInputChange('phone_number', e.target.value)
                    }
                    onBlur={() => handleFieldBlur('phone_number')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      shouldShowError('phone_number') && errors.phone_number
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder='Nhập số điện thoại'
                    aria-describedby={
                      shouldShowError('phone_number') && errors.phone_number
                        ? 'phone-error'
                        : undefined
                    }
                  />
                  {shouldShowError('phone_number') && errors.phone_number && (
                    <p
                      id='phone-error'
                      className='text-red-500 text-sm mt-1 flex items-center gap-1'
                    >
                      <AlertCircle size={14} />
                      {errors.phone_number}
                    </p>
                  )}
                </div>
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
          </div>

          {/* Academic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
              <BookOpen
                size={20}
                className='text-purple-500'
              />
              Thông tin học tập
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trình độ *
                </label>
                <select
                  value={formData.input_level || ''}
                  onChange={(e) =>
                    handleInputChange('input_level', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('input_level')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    shouldShowError('input_level') && errors.input_level
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  aria-describedby={
                    shouldShowError('input_level') && errors.input_level
                      ? 'level-error'
                      : undefined
                  }
                >
                  <option value=''>Chọn trình độ</option>
                  <option value='A1'>A1 - Mất gốc</option>
                  <option value='A2'>A2 - Sơ cấp</option>
                  <option value='B1'>B1 - Trung cấp thấp</option>
                  <option value='B2'>B2 - Trung cấp cao</option>
                  <option value='C1'>C1 - Nâng cao</option>
                </select>
                {shouldShowError('input_level') && errors.input_level && (
                  <p
                    id='level-error'
                    className='text-red-500 text-sm mt-1 flex items-center gap-1'
                  >
                    <AlertCircle size={14} />
                    {errors.input_level}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trạng thái *
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  onBlur={() => handleFieldBlur('status')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    shouldShowError('status') && errors.status
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  aria-describedby={
                    shouldShowError('status') && errors.status
                      ? 'status-error'
                      : undefined
                  }
                >
                  <option value=''>Chọn trạng thái</option>
                  <option value='active'>Đang học</option>
                  <option value='inactive'>Không hoạt động</option>
                  <option value='suspended'>Tạm đình chỉ</option>
                  <option value='graduated'>Đã tốt nghiệp</option>
                </select>
                {shouldShowError('status') && errors.status && (
                  <p
                    id='status-error'
                    className='text-red-500 text-sm mt-1 flex items-center gap-1'
                  >
                    <AlertCircle size={14} />
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
              <AlertCircle
                size={20}
                className='text-red-500'
              />
              Thông tin liên hệ khác
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Họ và tên
                </label>
                <input
                  type='text'
                  value={formData.parent_name || ''}
                  onChange={(e) =>
                    handleInputChange('parent_name', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập họ và tên'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  value={formData.parent_phone || ''}
                  onChange={(e) =>
                    handleInputChange('parent_phone', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('parent_phone')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    shouldShowError('parent_phone') && errors.parent_phone
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  placeholder='Nhập số điện thoại'
                  aria-describedby={
                    shouldShowError('parent_phone') && errors.parent_phone
                      ? 'parent-phone-error'
                      : undefined
                  }
                />
                {shouldShowError('parent_phone') && errors.parent_phone && (
                  <p
                    id='parent-phone-error'
                    className='text-red-500 text-sm mt-1 flex items-center gap-1'
                  >
                    <AlertCircle size={14} />
                    {errors.parent_phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting || !isFormValidForSubmit()}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isSubmitting || !isFormValidForSubmit()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Lưu thay đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
