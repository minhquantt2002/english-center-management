'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, User, BookOpen, Save, AlertCircle, Calendar } from 'lucide-react';
import { UserUpdate } from '../../../../types/admin';

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
  console.log(student);

  // Validate form in real-time
  const validateFormRealtime = (data: Partial<UserUpdate>) => {
    const newErrors: Record<string, string> = {};

    if (!data.name?.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!data.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!data.phone_number?.trim()) {
      newErrors.phone_number = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10,11}$/.test(data.phone_number.replace(/\s/g, ''))) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ';
    }

    if (!data.input_level) {
      newErrors.input_level = 'Trình độ là bắt buộc';
    }

    if (!data.status) {
      newErrors.status = 'Trạng thái là bắt buộc';
    }

    // Validation cho parent_phone (không bắt buộc nhưng nếu có thì phải đúng format)
    if (data.parent_phone && !/^[0-9]{10,11}$/.test(data.parent_phone.replace(/\s/g, ''))) {
      newErrors.parent_phone = 'Số điện thoại phụ huynh không hợp lệ';
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
      });
      // Validate initial data
      validateFormRealtime({
        ...student,
      });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleInputChange = (
    field: string,
    value: string | number | boolean | any
  ) => {
    // Xử lý riêng cho ngày sinh
    if (field === "date_of_birth") {
      const selectedDate = new Date(value);
      const today = new Date();

      if (selectedDate > today) {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: "Ngày sinh không được vượt quá ngày hiện tại",
        }));

      } else {
        setErrors((prev) => ({
          ...prev,
          date_of_birth: undefined,
        }));
      }
    }
    else if (field === "phone_number") {
      if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Số điện thoại không hợp lệ",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone_number: undefined,
        }));
      }
    }
    else if (field === "parent_phone") {
      // Validation cho số điện thoại phụ huynh (không bắt buộc nhưng nếu có thì phải đúng format)
      if (value && !/^[0-9]{10,11}$/.test(value.replace(/\s/g, ''))) {
        setErrors((prev) => ({
          ...prev,
          parent_phone: "Số điện thoại phụ huynh không hợp lệ",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          parent_phone: undefined,
        }));
      }
    }
    else {
      // Validate form in real-time for other fields
      const newFormData = {
        ...formData,
        [field]: value,
      };
      setFormData(newFormData);
      validateFormRealtime(newFormData);
      return;
    }

    // Cập nhật formData
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Họ và tên là bắt buộc';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    }
    else if (!/^[0-9]{10,11}$/.test(formData.phone_number.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.input_level) {
      newErrors.level = 'Trình độ là bắt buộc';
    }

    if (!formData.status) {
      newErrors.status = 'Trạng thái là bắt buộc';
    }

    // Validation cho parent_phone (không bắt buộc nhưng nếu có thì phải đúng format)
    if (formData.parent_phone && !/^[0-9]{10,11}$/.test(formData.parent_phone.replace(/\s/g, ''))) {
      newErrors.parent_phone = 'Số điện thoại phụ huynh không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedStudent: UserUpdate = {
        ...student,
        ...formData,
        updatedAt: new Date().toLocaleDateString('vi-VN'),
      } as UserUpdate;

      onSave(updatedStudent);
      onClose();
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='h-12 w-12 flex-shrink-0'>
              <img
                className='h-12 w-12 rounded-full object-cover'
                src={
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                }
                alt={formData.name}
              />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Chỉnh sửa thông tin học viên
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <User size={20} className='text-blue-500' />
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Nhập họ và tên'
                  />
                  {errors.name && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
                      value={formData.date_of_birth?.split('T')[0]}
                      onChange={(e) =>
                        handleInputChange('date_of_birth', e.target.value)
                      }
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
                <Phone size={20} className='text-green-500' />
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Nhập email'
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder='Nhập số điện thoại'
                  />
                  {errors.phone_number && (
                    <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
                      <AlertCircle size={14} />
                      {errors.phone_number}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
              <BookOpen size={20} className='text-purple-500' />
              Thông tin học tập
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Trình độ *
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
                {errors.input_level && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='active'>Đang học</option>
                  <option value='inactive'>Tạm nghỉ</option>
                  <option value='suspended'>Tạm đình chỉ</option>
                  <option value='graduated'>Đã tốt nghiệp</option>
                </select>
                {errors.status && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
              <AlertCircle size={20} className='text-red-500' />
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Nhập số điện thoại'
                />
                {errors.parent_phone && (
                  <p className='text-red-500 text-sm mt-1 flex items-center gap-1'>
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
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={Object.values(errors).some(Boolean)}
            >
              <Save size={16} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
