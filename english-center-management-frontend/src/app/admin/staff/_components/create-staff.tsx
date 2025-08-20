'use client';

import React, { useState } from 'react';
import { X, User, Phone, Mail } from 'lucide-react';
import { UserCreate } from '../../../../types/admin';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStaff: (staffData: UserCreate) => Promise<void>;
}

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

  // Check if form has any errors
  const hasErrors = () => {
    return Object.values(errors).some(error => error !== undefined && error !== '');
  };

  // Validate form in real-time
  const validateFormRealtime = (data: UserCreate) => {
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

    if (!data.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }

    if (!data.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
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

    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = 'Ngày sinh là bắt buộc';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }
    // bio không bắt buộc

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      await onCreateStaff(formData);
      // handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      date_of_birth: '',
      bio: '',
      address: '',
      role_name: 'staff',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof UserCreate, value: any) => {
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
        today.getFullYear() - 16,
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
          date_of_birth: "Nhân viên phải đủ 16 tuổi",
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
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100'>
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
          {/* Personal Information */}
          <div className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Họ và tên <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${errors.name ? 'border-red-400' : 'border-gray-300'
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
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${errors.email ? 'border-red-400' : 'border-gray-300'
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
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${errors.phone_number ? 'border-red-400' : 'border-gray-300'
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
                Ngày sinh <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                value={formData.date_of_birth}
                onChange={(e) =>
                  handleInputChange('date_of_birth', e.target.value)
                }
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${errors.date_of_birth ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder='Chọn ngày sinh'
              />
              {errors.date_of_birth && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.date_of_birth}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Địa chỉ <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm ${errors.address ? 'border-red-400' : 'border-gray-300'
                  }`}
                placeholder='Nhập địa chỉ'
              />
              {errors.address && (
                <p className='text-red-500 text-sm mt-1'>{errors.address}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Giới thiệu
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className='w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent text-base bg-gray-50 transition-all duration-150 shadow-sm min-h-[80px] resize-y'
                placeholder='Giới thiệu ngắn về nhân viên (không bắt buộc)'
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className='flex items-center justify-end space-x-4 pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={handleClose}
              className='px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-teal-300'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={hasErrors()}
              className={`px-7 py-2.5 rounded-xl transition-colors flex items-center gap-2 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                hasErrors()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              <User className='w-4 h-4' />
              Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
