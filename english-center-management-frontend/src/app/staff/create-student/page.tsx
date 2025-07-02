'use client';

import React, { useState } from 'react';
import {
  User,
  Calendar,
  Phone,
  Mail,
  GraduationCap,
  FileText,
  X,
  Save,
} from 'lucide-react';

export default function AddStudentForm() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    phoneNumber: '',
    email: '',
    level: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <button
          onClick={() => setIsOpen(true)}
          className='bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium'
        >
          Mở Form Thêm Học Viên
        </button>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-teal-500 text-white px-6 py-6 rounded-t-lg text-center'>
          <div className='bg-white text-teal-500 inline-block px-4 py-2 rounded-full font-semibold text-lg mb-3'>
            Zenlish
          </div>
          <h2 className='text-xl font-semibold mb-1'>Thêm học viên mới</h2>
          <p className='text-teal-100 text-sm'>Điền thông tin học viên</p>
        </div>

        {/* Form Content */}
        <div className='p-6 space-y-5'>
          {/* Họ và tên */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <User className='w-4 h-4 text-teal-500' />
              <span>
                Họ và tên <span className='text-red-500'>*</span>
              </span>
            </label>
            <input
              type='text'
              placeholder='Nhập họ và tên học viên'
              className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          {/* Ngày sinh */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <Calendar className='w-4 h-4 text-teal-500' />
              <span>Ngày sinh</span>
            </label>
            <div className='relative'>
              <input
                type='text'
                placeholder='nn/mm/yyyy'
                className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
              <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <Phone className='w-4 h-4 text-teal-500' />
              <span>
                Số điện thoại <span className='text-red-500'>*</span>
              </span>
            </label>
            <input
              type='tel'
              placeholder='0123 456 789'
              className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <Mail className='w-4 h-4 text-teal-500' />
              <span>Email</span>
            </label>
            <input
              type='email'
              placeholder='example@email.com'
              className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          {/* Trình độ đầu vào */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <GraduationCap className='w-4 h-4 text-teal-500' />
              <span>Trình độ đầu vào</span>
            </label>
            <select
              className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700'
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
            >
              <option value='' className='text-gray-400'>
                Chọn trình độ
              </option>
              <option value='beginner'>Beginner - Cơ bản</option>
              <option value='elementary'>Elementary - Sơ cấp</option>
              <option value='intermediate'>Intermediate - Trung cấp</option>
              <option value='upper-intermediate'>
                Upper Intermediate - Trung cấp cao
              </option>
              <option value='advanced'>Advanced - Nâng cao</option>
              <option value='proficiency'>Proficiency - Thành thạo</option>
            </select>
          </div>

          {/* Ghi chú */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <FileText className='w-4 h-4 text-teal-500' />
              <span>Ghi chú</span>
            </label>
            <textarea
              placeholder='Thông tin bổ sung về học viên...'
              rows={4}
              className='w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400 resize-none'
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3'>
          <button
            onClick={handleCancel}
            className='flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2'
          >
            <X className='w-4 h-4' />
            <span>Hủy</span>
          </button>
          <button
            onClick={handleSubmit}
            className='flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center space-x-2'
          >
            <Save className='w-4 h-4' />
            <span>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
