'use client';

import React, { useState } from 'react';
import {
  X,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  CalendarDays,
} from 'lucide-react';

export default function CreateScheduleModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    className: '',
    startDate: '',
    sessionsPerWeek: '',
    startTime: '',
    endTime: '',
    room: '',
    instructor: '',
    selectedDays: {
      thu2: false,
      thu3: false,
      thu4: false,
      thu5: false,
      thu6: false,
      thu7: false,
      cn: false,
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: {
        ...prev.selectedDays,
        [day]: checked,
      },
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
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium'
        >
          Mở Modal Tạo Thời Khóa Biểu
        </button>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-blue-500 text-white px-6 py-4 rounded-t-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold'>Tạo Thời Khóa Biểu</h2>
              <p className='text-blue-100 text-sm'>Trung tâm Zenlish</p>
            </div>
            <button
              onClick={handleCancel}
              className='text-white hover:text-gray-200 transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className='p-6 space-y-6'>
          {/* Chọn Lớp Học */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <Users className='w-4 h-4 text-blue-500' />
              <span>Chọn Lớp Học</span>
            </label>
            <select
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={formData.className}
              onChange={(e) => handleInputChange('className', e.target.value)}
            >
              <option value=''>-- Chọn lớp học --</option>
              <option value='adv-001'>
                ADV-001 - Tiếng Anh giao tiếp nâng cao
              </option>
              <option value='adv-002'>
                ADV-002 - Tiếng Anh giao tiếp nâng cao
              </option>
              <option value='int-001'>
                INT-001 - Tiếng Anh giao tiếp trung cấp
              </option>
              <option value='beg-001'>
                BEG-001 - Tiếng Anh giao tiếp cơ bản
              </option>
            </select>
          </div>

          {/* Ngày Bắt Đầu và Số Buổi/Tuần */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='w-4 h-4 text-blue-500' />
                <span>Ngày Bắt Đầu</span>
              </label>
              <input
                type='text'
                placeholder='nn/mm/yyyy'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                <CalendarDays className='w-4 h-4 text-blue-500' />
                <span>Số Buổi/Tuần</span>
              </label>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.sessionsPerWeek}
                onChange={(e) =>
                  handleInputChange('sessionsPerWeek', e.target.value)
                }
              >
                <option value=''>-- Chọn số buổi --</option>
                <option value='2'>2 buổi/tuần</option>
                <option value='3'>3 buổi/tuần</option>
                <option value='4'>4 buổi/tuần</option>
                <option value='5'>5 buổi/tuần</option>
              </select>
            </div>
          </div>

          {/* Giờ Học và Phòng Học */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                <Clock className='w-4 h-4 text-blue-500' />
                <span>Giờ Học</span>
              </label>
              <input
                type='text'
                placeholder='--:-- --'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 mb-2 block opacity-0'>
                Đến
              </label>
              <input
                type='text'
                placeholder='--:-- --'
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>

            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 text-blue-500' />
                <span>Phòng Học</span>
              </label>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
              >
                <option value=''>-- Chọn phòng học --</option>
                <option value='A101'>Phòng A101</option>
                <option value='A201'>Phòng A201</option>
                <option value='B105'>Phòng B105</option>
                <option value='B203'>Phòng B203</option>
              </select>
            </div>
          </div>

          {/* Chọn Ngày Học */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
              <CalendarDays className='w-4 h-4 text-blue-500' />
              <span>Chọn Ngày Học</span>
            </label>
            <div className='grid grid-cols-7 gap-2'>
              {[
                { key: 'thu2', label: 'T2' },
                { key: 'thu3', label: 'T3' },
                { key: 'thu4', label: 'T4' },
                { key: 'thu5', label: 'T5' },
                { key: 'thu6', label: 'T6' },
                { key: 'thu7', label: 'T7' },
                { key: 'cn', label: 'CN' },
              ].map((day) => (
                <label
                  key={day.key}
                  className='flex flex-col items-center cursor-pointer'
                >
                  <input
                    type='checkbox'
                    className='mb-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    checked={
                      formData.selectedDays[
                        day.key as keyof typeof formData.selectedDays
                      ]
                    }
                    onChange={(e) => handleDayChange(day.key, e.target.checked)}
                  />
                  <span className='text-sm text-gray-600'>{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chọn Giáo Viên */}
          <div>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2'>
              <User className='w-4 h-4 text-blue-500' />
              <span>Chọn Giáo Viên</span>
            </label>
            <select
              className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={formData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
            >
              <option value=''>-- Chọn giáo viên --</option>
              <option value='ms-sarah'>Ms. Sarah Johnson</option>
              <option value='mr-david'>Mr. David Wilson</option>
              <option value='ms-emily'>Ms. Emily Chen</option>
              <option value='mr-james'>Mr. James Brown</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className='px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3'>
          <button
            onClick={handleCancel}
            className='flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Tạo Thời Khóa Biểu
          </button>
        </div>
      </div>
    </div>
  );
}
