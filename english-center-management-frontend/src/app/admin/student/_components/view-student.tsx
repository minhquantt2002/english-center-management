'use client';

import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { StudentResponse } from '../../../../types/admin';
import { getInitials } from '../../../staff/list-teacher/page';

interface ViewStudentModalProps {
  student: StudentResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-red-100 text-red-700';
      case 'A2':
        return 'bg-orange-100 text-orange-700';
      case 'B1':
        return 'bg-yellow-100 text-yellow-700';
      case 'B2':
        return 'bg-blue-100 text-blue-700';
      case 'C1':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='h-12 w-12 flex-shrink-0'>
              <div className='w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                {getInitials(student.name.charAt(0))}
              </div>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {student.name}
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

        {/* Content */}
        <div className='p-6 space-y-6'>
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

              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Họ và tên
                  </label>
                  <p className='text-sm text-gray-900 mt-1'>{student.name}</p>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Ngày sinh
                  </label>
                  <div className='flex items-center gap-2 mt-1'>
                    <Calendar
                      size={16}
                      className='text-gray-400'
                    />
                    <p className='text-sm text-gray-900'>
                      {student.date_of_birth
                        ? formatDate(student.date_of_birth)
                        : 'Chưa cập nhật'}
                      {student.date_of_birth &&
                        calculateAge(student.date_of_birth) && (
                          <span className='text-gray-500 ml-2'>
                            ({calculateAge(student.date_of_birth)} tuổi)
                          </span>
                        )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Địa chỉ
                  </label>
                  <div className='flex items-start gap-2 mt-1'>
                    <MapPin
                      size={16}
                      className='text-gray-400 mt-0.5'
                    />
                    <p className='text-sm text-gray-900'>
                      {student.address || 'Chưa cập nhật'}
                    </p>
                  </div>
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

              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Email
                  </label>
                  <div className='flex items-center gap-2 mt-1'>
                    <Mail
                      size={16}
                      className='text-gray-400'
                    />
                    <p className='text-sm text-gray-900'>{student.email}</p>
                  </div>
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    Số điện thoại
                  </label>
                  <div className='flex items-center gap-2 mt-1'>
                    <Phone
                      size={16}
                      className='text-gray-400'
                    />
                    <p className='text-sm text-gray-900'>
                      {student.phone_number}
                    </p>
                  </div>
                </div>

                {student.parent_name && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Liên hệ phụ huynh
                    </label>
                    <div className='flex items-center gap-2 mt-1'>
                      <Phone
                        size={16}
                        className='text-gray-400'
                      />
                      <p className='text-sm text-gray-900'>
                        {student.parent_name}
                      </p>
                    </div>
                  </div>
                )}
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

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <label className='text-sm font-medium text-gray-500'>
                  Trình độ
                </label>
                <div className='mt-2'>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getLevelBadgeColor(
                      student.input_level
                    )}`}
                  >
                    {student.input_level === 'A1'
                      ? 'A1 - Mất gốc'
                      : student.input_level === 'A2'
                      ? 'A2 - Sơ cấp'
                      : student.input_level === 'B1'
                      ? 'B1 - Trung cấp thấp'
                      : student.input_level === 'B2'
                      ? 'B2 - Trung cấp cao'
                      : student.input_level === 'C1'
                      ? 'C1 - Nâng cao'
                      : student.input_level || 'A2'}
                  </span>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <label className='text-sm font-medium text-gray-500'>
                  Trạng thái
                </label>
                <div className='mt-2'>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(
                      student.status || 'active'
                    )}`}
                  >
                    {(student.status || 'active') === 'active'
                      ? 'Đang học'
                      : 'Không hoạt động'}
                  </span>
                </div>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <label className='text-sm font-medium text-gray-500'>
                  Ngày đăng ký
                </label>
                <div className='flex items-center gap-2 mt-2'>
                  <Clock
                    size={16}
                    className='text-gray-400'
                  />
                  <p className='text-sm text-gray-900'>
                    {formatDate(student.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {student.parent_name && (
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900 flex items-center gap-2'>
                <AlertCircle
                  size={20}
                  className='text-red-500'
                />
                Liên hệ phụ huynh
              </h3>

              <div className='bg-red-50 p-4 rounded-lg'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Tên
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {student.parent_name}
                    </p>
                  </div>

                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      Số điện thoại
                    </label>
                    <p className='text-sm text-gray-900 mt-1'>
                      {student.parent_phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end gap-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;
