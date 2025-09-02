'use client';

import React from 'react';
import { X, User, Phone, Mail } from 'lucide-react';
import { UserResponse } from '../../../../types/admin';
import { getInitials } from '../../../staff/list-teacher/page';

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: UserResponse | null;
}

export default function ViewStaffModal({
  isOpen,
  onClose,
  staff,
}: ViewStaffModalProps) {
  if (!isOpen || !staff) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
            <User className='w-6 h-6 text-teal-600' />
            Thông tin nhân viên
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Staff Header */}
          <div className='flex items-start gap-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg'>
            <div className='h-24 w-24 flex-shrink-0'>
              <div className='w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                {getInitials(staff.name.charAt(0))}
              </div>
            </div>
            <div className='flex-1'>
              <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                {staff.name}
              </h3>
              <p className='text-lg text-gray-600 mb-3'>{staff.role_name}</p>
              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <span className='flex items-center gap-1'>
                  <Mail className='w-4 h-4' />
                  {staff.email}
                </span>
                {staff.phone_number && (
                  <span className='flex items-center gap-1'>
                    <Phone className='w-4 h-4' />
                    {staff.phone_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
            <div className='bg-white p-6 rounded-lg border border-gray-200'>
              <h4 className='text-lg font-medium text-gray-900 mb-4 flex items-center gap-2'>
                <User className='w-5 h-5 text-teal-600' />
                Thông tin cá nhân
              </h4>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Họ và tên
                  </label>
                  <p className='text-gray-900'>{staff.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 flex items-center gap-1'>
                    <Mail className='w-4 h-4' />
                    Email
                  </label>
                  <p className='text-gray-900'>{staff.email}</p>
                </div>
                {staff.phone_number && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 flex items-center gap-1'>
                      <Phone className='w-4 h-4' />
                      Số điện thoại
                    </label>
                    <p className='text-gray-900'>{staff.phone_number}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between p-6 border-t border-gray-200'>
          <div className='text-sm text-gray-500'>
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={onClose}
              className='px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors'
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
