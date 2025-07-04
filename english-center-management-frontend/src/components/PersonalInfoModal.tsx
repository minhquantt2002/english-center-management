'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
} from 'lucide-react';

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'staff' | 'student' | 'teacher';
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  joinDate: string;
  level?: string;
  specialization?: string;
  studentId?: string;
  employeeId?: string;
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  isOpen,
  onClose,
  userRole = 'student',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name:
      userRole === 'student'
        ? 'Sarah Johnson'
        : userRole === 'teacher'
        ? 'Mr. Anderson'
        : userRole === 'admin'
        ? 'John Smith'
        : 'Emily Davis',
    email:
      userRole === 'student'
        ? 'sarah.j@email.com'
        : userRole === 'teacher'
        ? 'anderson@zenlish.edu'
        : userRole === 'admin'
        ? 'john.smith@zenlish.edu'
        : 'emily.d@zenlish.edu',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
    dateOfBirth: '1995-06-15',
    joinDate: userRole === 'student' ? '2024-09-01' : '2023-01-15',
    level: userRole === 'student' ? 'Intermediate' : undefined,
    specialization:
      userRole === 'teacher' ? 'English Literature & Grammar' : undefined,
    studentId: userRole === 'student' ? 'STU-2024-001' : undefined,
    employeeId: userRole !== 'student' ? 'EMP-2023-015' : undefined,
  });

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  if (!isOpen) return null;

  const getThemeColors = () => {
    switch (userRole) {
      case 'admin':
        return {
          primary: 'blue',
          accent: 'purple',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
        };
      case 'staff':
        return {
          primary: 'green',
          accent: 'blue',
          bg: 'bg-green-50',
          text: 'text-green-600',
          button: 'bg-green-500 hover:bg-green-600',
        };
      case 'student':
        return {
          primary: 'purple',
          accent: 'pink',
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          button: 'bg-purple-500 hover:bg-purple-600',
        };
      case 'teacher':
        return {
          primary: 'orange',
          accent: 'red',
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          button: 'bg-orange-500 hover:bg-orange-600',
        };
      default:
        return {
          primary: 'blue',
          accent: 'purple',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          button: 'bg-blue-500 hover:bg-blue-600',
        };
    }
  };

  const theme = getThemeColors();

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]'>
      <div className='bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className={`${theme.bg} px-6 py-4 rounded-t-2xl`}>
          <div className='flex items-center justify-between'>
            <h2 className={`text-xl font-bold ${theme.text}`}>
              Thông tin cá nhân
            </h2>
            <div className='flex items-center space-x-2'>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-2 ${theme.button} text-white rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <Edit2 className='w-4 h-4' />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className={`p-2 ${theme.button} text-white rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <Save className='w-4 h-4' />
                </button>
              )}
              <button
                onClick={onClose}
                className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Profile Picture */}
          <div className='flex items-center space-x-4'>
            <div
              className={`w-20 h-20 ${theme.button} rounded-full flex items-center justify-center text-white text-2xl font-bold`}
            >
              {personalInfo.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-900'>
                {personalInfo.name}
              </h3>
              <p className={`${theme.text} font-medium`}>
                {userRole === 'student' && `Học viên ${personalInfo.level}`}
                {userRole === 'teacher' && 'Giáo viên tiếng Anh'}
                {userRole === 'admin' && 'Quản trị viên hệ thống'}
                {userRole === 'staff' && 'Nhân viên nhân sự'}
              </p>
              {(personalInfo.studentId || personalInfo.employeeId) && (
                <p className='text-gray-500 text-sm'>
                  ID: {personalInfo.studentId || personalInfo.employeeId}
                </p>
              )}
            </div>
          </div>

          {/* Information Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <User className='w-4 h-4 inline mr-2' />
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type='text'
                  value={personalInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>{personalInfo.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Mail className='w-4 h-4 inline mr-2' />
                Địa chỉ email
              </label>
              {isEditing ? (
                <input
                  type='email'
                  value={personalInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>{personalInfo.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Phone className='w-4 h-4 inline mr-2' />
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type='tel'
                  value={personalInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>{personalInfo.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='w-4 h-4 inline mr-2' />
                Ngày sinh
              </label>
              {isEditing ? (
                <input
                  type='date'
                  value={personalInfo.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange('dateOfBirth', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>
                  {new Date(personalInfo.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Address */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 inline mr-2' />
                Địa chỉ
              </label>
              {isEditing ? (
                <textarea
                  value={personalInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>{personalInfo.address}</p>
              )}
            </div>

            {/* Role-specific fields */}
            {userRole === 'student' && personalInfo.level && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Trình độ tiếng Anh
                </label>
                {isEditing ? (
                  <select
                    value={personalInfo.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    <option value='Sơ cấp'>Sơ cấp</option>
                    <option value='Trung cấp'>Trung cấp</option>
                    <option value='Nâng cao'>Nâng cao</option>
                  </select>
                ) : (
                  <p className='text-gray-900'>{personalInfo.level}</p>
                )}
              </div>
            )}

            {userRole === 'teacher' && personalInfo.specialization && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Chuyên môn
                </label>
                {isEditing ? (
                  <input
                    type='text'
                    value={personalInfo.specialization}
                    onChange={(e) =>
                      handleInputChange('specialization', e.target.value)
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                ) : (
                  <p className='text-gray-900'>{personalInfo.specialization}</p>
                )}
              </div>
            )}

            {/* Join Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='w-4 h-4 inline mr-2' />
                {userRole === 'student' ? 'Ngày đăng ký' : 'Ngày tham gia'}
              </label>
              <p className='text-gray-900'>
                {new Date(personalInfo.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className='px-6 py-4 border-t border-gray-200 flex justify-end space-x-3'>
            <button
              onClick={() => setIsEditing(false)}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg transition-colors`}
            >
              Lưu thay đổi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoModal;
