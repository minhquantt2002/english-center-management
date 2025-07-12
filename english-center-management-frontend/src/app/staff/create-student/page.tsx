'use client';

import React, { useState } from 'react';
import {
  User,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    level: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    } else if (
      !/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))
    ) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (
      formData.birthDate &&
      !/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthDate)
    ) {
      newErrors.birthDate = 'Ngày sinh phải có định dạng dd/mm/yyyy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Form submitted:', formData);
      setShowSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: '',
          birthDate: '',
          phoneNumber: '',
          email: '',
          level: '',
          notes: '',
        });
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/staff');
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900 mb-3'>
            Thêm học viên mới
          </h1>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className='mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center max-w-md mx-auto'>
            <CheckCircle className='w-5 h-5 text-green-500 mr-3' />
            <span className='text-green-700 font-medium'>
              Thêm học viên thành công!
            </span>
          </div>
        )}

        {/* Form */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          <div className='px-6 py-8 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Full Name */}
              <div className='lg:col-span-2'>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <User className='w-5 h-5 text-teal-500 mr-2' />
                  Họ và tên
                  <span className='text-red-500 ml-1'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Nhập họ và tên học viên'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.fullName
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange('fullName', e.target.value)
                  }
                />
                {errors.fullName && (
                  <div className='flex items-center mt-2 text-red-600 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <Calendar className='w-5 h-5 text-teal-500 mr-2' />
                  Ngày sinh
                </label>
                <input
                  type='text'
                  placeholder='dd/mm/yyyy'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.birthDate
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange('birthDate', e.target.value)
                  }
                />
                {errors.birthDate && (
                  <div className='flex items-center mt-2 text-red-600 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.birthDate}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <Phone className='w-5 h-5 text-teal-500 mr-2' />
                  Số điện thoại
                  <span className='text-red-500 ml-1'>*</span>
                </label>
                <input
                  type='tel'
                  placeholder='0123 456 789'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.phoneNumber
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange('phoneNumber', e.target.value)
                  }
                />
                {errors.phoneNumber && (
                  <div className='flex items-center mt-2 text-red-600 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <Mail className='w-5 h-5 text-teal-500 mr-2' />
                  Email
                </label>
                <input
                  type='email'
                  placeholder='example@email.com'
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && (
                  <div className='flex items-center mt-2 text-red-600 text-sm'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Level */}
              <div>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <GraduationCap className='w-5 h-5 text-teal-500 mr-2' />
                  Trình độ đầu vào
                </label>
                <select
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white hover:border-gray-400 transition-colors'
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                >
                  <option value=''>Chọn trình độ</option>
                  <option value='beginner'>Cơ bản</option>
                  <option value='elementary'>Sơ cấp</option>
                  <option value='intermediate'>Trung cấp</option>
                  <option value='upper-intermediate'>Trung cấp cao</option>
                  <option value='advanced'>Nâng cao</option>
                  <option value='proficiency'>Thành thạo</option>
                </select>
              </div>

              {/* Notes */}
              <div className='lg:col-span-2'>
                <label className='flex items-center text-sm font-medium text-gray-700 mb-3'>
                  <FileText className='w-5 h-5 text-teal-500 mr-2' />
                  Ghi chú
                </label>
                <textarea
                  placeholder='Thông tin bổ sung về học viên...'
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white hover:border-gray-400 transition-colors resize-none'
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='p-3 bg-gray-50 border-t border-gray-200'>
            <div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
              <button
                onClick={handleBack}
                className='p-2 px-4 text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className='p-2 text-base bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' />
                    Lưu học viên
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <div className='w-2 h-2 bg-blue-400 rounded-full mt-2'></div>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-blue-800'>
                <strong>Lưu ý:</strong> Các trường có dấu (*) là bắt buộc. Thông
                tin học viên sẽ được sử dụng để tạo tài khoản và quản lý lịch
                học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
