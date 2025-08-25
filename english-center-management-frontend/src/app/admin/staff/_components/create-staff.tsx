'use client';

import React, { useEffect, useState } from 'react';
import { X, User, Phone, Mail, Calendar } from 'lucide-react';
import { UserCreate } from '../../../../types/admin';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStaff: (staffData: UserCreate) => Promise<void>;
}
const INITIAL_FORM_DATA: UserCreate = {
  name: '',
  email: '',
  phone_number: '',
  date_of_birth: '',
  bio: '',
  address: '',
  role_name: 'staff',
};
export default function CreateStaffModal({
  isOpen,
  onClose,
  onCreateStaff,
}: CreateStaffModalProps) {
  const [formData, setFormData] = useState<UserCreate>({
    name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    bio: '',
    address: '',
    role_name: 'staff',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UserCreate, string>>
  >({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
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
    return phone.trim() !== '' && /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''));
  };
  const isValidDate = (date: string) => {
    if (!date) return false;
    const selectedDate = new Date(date);
    const today = new Date();
    const minBirthDate = new Date(
      today.getFullYear() - 16,
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
      formData.date_of_birth.trim(),
      formData.address.trim(),
    ];

    // Check required fields
    const hasRequiredFields = requiredFields.every(
      (field) => field !== '' && field !== undefined
    );
    const hasValidFormats = isValidEmail(formData.email) &&
      isValidPhone(formData.phone_number) &&
      isValidDate(formData.date_of_birth) &&
      formData.address.trim().length > 0 &&
      formData.name.trim().length > 0;
    return hasRequiredFields && hasValidFormats;
  };


  // Validate all fields for form submission
  const validateAllFields = () => {
    const fieldsToValidate = ['name', 'email', 'phone_number', 'address', 'date_of_birth'];
    fieldsToValidate.forEach((field) => {
      validateFieldForDisplay(field, formData[field as keyof UserCreate]);
    });
    return Object.keys(errors).length === 0 && isFormValid();
  };
  const validateFieldForDisplay = (field: string, value: any) => {
    setErrors((prev) => {
      const newError = { ...prev };
      switch (field) {
        case 'name':
          if (!value.trim()) {
            newError.name = 'Họ tên là bắt buộc';
          }
          else {
            delete newError.name;
          }
          break;

        case 'email':
          if (!value.trim()) {
            newError.email = 'Email là bắt buộc';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newError.email = 'Email không hợp lệ';
          }
          else {
            delete newError.email;
          }
          break;

        case 'phone_number':
          if (!value.trim()) {
            newError.phone_number = 'Số điện thoại là bắt buộc';
          } else if (
            !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))
          ) {
            newError.phone_number = 'Số điện thoại không hợp lệ';
          }
          else {
            delete newError.phone_number;
          }
          break;

        case 'address':
          if (!value.trim()) {
            newError.address = 'Địa chỉ là bắt buộc';
          } else {
            delete newError.address;
          }

          break;

        case 'date_of_birth':
          if (!value.trim()) {
            delete newError.date_of_birth;
          } else {
            const selectedDate = new Date(value);
            const today = new Date();
            const minBirthDate = new Date(
              today.getFullYear() - 16,
              today.getMonth(),
              today.getDate()
            );
            if (selectedDate > today) {
              newError.date_of_birth = 'Ngày sinh không được vượt quá ngày hiện tại';
            } else if (selectedDate > minBirthDate) {
              newError.date_of_birth = 'Ngày sinh không được nhỏ hơn 16 tuổi';
            } else {
              delete newError.date_of_birth;
            }
          }
          break;
      }
      return newError;
    });
  }


  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate field when user leaves it
    validateFieldForDisplay(field, formData[field as keyof UserCreate]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setSubmitError('');
    const requiredFields = ['name', 'email', 'phone_number', 'address', 'date_of_birth'];
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
      const newStaff: UserCreate = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
        bio: formData.bio,
        address: formData.address,
        role_name: formData.role_name,
        password: formData.password.trim(),
      };
      await onCreateStaff(newStaff);
    } catch (error) {
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

  const handleInputChange = (field: keyof UserCreate, value: any) => {
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
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100'>
        {/* Header */}
        <div className='flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white rounded-t-2xl'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
            <User className='w-7 h-7 text-teal-600' />
            Thêm nhân viên
          </h2>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400'
            aria-label='Đóng'
          >
            <X className='w-6 h-6 text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='px-8 py-7 space-y-7'>
          {/* Submit Error Message */}
          {submitError && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 col-span-2'>
              <p className='text-sm text-red-600'>{submitError}</p>
            </div>
          )}

          {/* Personal Information - 2 Column Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left Column */}
            <div className='space-y-5'>
              {/* Full Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Họ và tên <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleFieldBlur('name')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('name') && errors.name ? 'border-red-400' : 'border-gray-300'
                    }`}
                  placeholder='Nhập họ và tên'
                  aria-describedby={shouldShowError('name') && errors.name ? 'name-error' : undefined}
                />
                {shouldShowError('name') && errors.name && (
                  <p id='name-error' className='text-red-500 text-sm mt-1'>{errors.name}</p>
                )}
              </div>

              {/* Email */}
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
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('email') && errors.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                  placeholder='example@email.com'
                  aria-describedby={shouldShowError('email') && errors.email ? 'email-error' : undefined}
                />
                {shouldShowError('email') && errors.email && (
                  <p id='email-error' className='text-red-500 text-sm mt-1'>{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
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
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('phone_number') && errors.phone_number ? 'border-red-400' : 'border-gray-300'
                    }`}
                  placeholder='0123456789'
                  aria-describedby={shouldShowError('phone_number') ? 'phone-error' : undefined}
                />
                {shouldShowError('phone_number') && errors.phone_number && (
                  <p id='phone-error' className='text-red-500 text-sm mt-1'>
                    {errors.phone_number}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-5'>
              {/* Date of Birth */}
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  Ngày sinh <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    handleInputChange('date_of_birth', e.target.value)
                  }
                  onBlur={() => handleFieldBlur('date_of_birth')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('date_of_birth') && errors.date_of_birth
                    ? 'border-red-400'
                    : 'border-gray-300'
                    }`}
                  aria-describedby={shouldShowError('date_of_birth') && errors.date_of_birth ? 'date-error' : undefined}
                />
                {shouldShowError('date_of_birth') && errors.date_of_birth && (
                  <p id='date-error' className='mt-1 text-sm text-red-600'>
                    {errors.date_of_birth}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Địa chỉ <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onBlur={() => handleFieldBlur('address')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('address') && errors.address ? 'border-red-400' : 'border-gray-300'
                    }`}
                  placeholder='Nhập địa chỉ'
                  aria-describedby={shouldShowError('address') ? 'address-error' : undefined}
                />
                {shouldShowError('address') && errors.address && (
                  <p id='address-error' className='text-red-500 text-sm mt-1'>
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Mật khẩu
                </label>
                <input
                  type='text'
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${shouldShowError('password') && errors.password ? 'border-red-400' : 'border-gray-300'
                    }`}
                  placeholder='Nhập mật khẩu'
                  aria-describedby={shouldShowError('password') ? 'password-error' : undefined}
                />
                {shouldShowError('password') && errors.password && (
                  <p id='password-error' className='text-red-500 text-sm mt-1'>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio - Full Width */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Giới thiệu
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className='w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm border-gray-300 min-h-[100px] resize-y'
              placeholder='Giới thiệu ngắn về nhân viên (không bắt buộc)'
            />
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end space-x-4 pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-teal-300'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={!isFormValid() || isSubmitting}
              className={`px-8 py-2.5 rounded-xl transition-colors flex items-center gap-2 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-teal-400 ${!isFormValid() || isSubmitting
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
                  <User className='w-4 h-4' />
                  Thêm nhân viên
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}