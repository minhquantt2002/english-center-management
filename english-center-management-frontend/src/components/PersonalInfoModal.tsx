'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Loader2,
} from 'lucide-react';
import { useUserInfo } from './UserInfoContext';
import { toast } from 'react-toastify';

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
  bio?: string;
  education?: string;
  experienceYears?: number;
  parentName?: string;
  parentPhone?: string;
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({
  isOpen,
  onClose,
  userRole = 'student',
}) => {
  const { userInfo, updateUserInfo, loading } = useUserInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    joinDate: '',
    level: '',
    specialization: '',
    studentId: '',
    employeeId: '',
    bio: '',
    education: '',
    experienceYears: 0,
    parentName: '',
    parentPhone: '',
  });

  // Update personal info when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setPersonalInfo({
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone_number || '',
        address: userInfo.address || '',
        dateOfBirth: userInfo.date_of_birth || '',
        joinDate: userInfo.created_at || '',
        level: userInfo.level || userInfo.input_level || '',
        specialization: userInfo.specialization || '',
        studentId: userInfo.student_id || '',
        employeeId: '',
        bio: userInfo.bio || '',
        education: userInfo.education || '',
        experienceYears: userInfo.experience_years || 0,
        parentName: userInfo.parent_name || '',
        parentPhone: userInfo.parent_phone || '',
      });
    }
  }, [userInfo]);

  const handleInputChange = (
    field: keyof PersonalInfo,
    value: string | number
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userInfo) return;

    setIsSaving(true);
    try {
      const updateData: any = {
        name: personalInfo.name,
        phone_number: personalInfo.phone,
        address: personalInfo.address,
        date_of_birth: personalInfo.dateOfBirth,
        bio: personalInfo.bio,
      };

      // Add role-specific fields
      if (userRole === 'student') {
        updateData.level = personalInfo.level;
        updateData.parent_name = personalInfo.parentName;
        updateData.parent_phone = personalInfo.parentPhone;
      } else if (userRole === 'teacher') {
        updateData.specialization = personalInfo.specialization;
        updateData.education = personalInfo.education;
        updateData.experience_years = personalInfo.experienceYears;
      }

      if (personalInfo.dateOfBirth.trim() === '') {
        delete updateData.date_of_birth;
      }

      await updateUserInfo(updateData);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
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

  if (loading) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]'>
        <div className='bg-white rounded-2xl p-8'>
          <div className='flex items-center space-x-3'>
            <Loader2 className='w-6 h-6 animate-spin' />
            <span>Đang tải thông tin...</span>
          </div>
        </div>
      </div>
    );
  }

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
                  disabled={isSaving}
                  className={`p-2 ${theme.button} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  {isSaving ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <Save className='w-4 h-4' />
                  )}
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
              {personalInfo.name.charAt(0)}
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
              <p className='text-gray-900'>{personalInfo.email}</p>
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
                <p className='text-gray-900'>
                  {personalInfo.phone || 'Chưa cập nhật'}
                </p>
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
                  {personalInfo.dateOfBirth
                    ? new Date(personalInfo.dateOfBirth).toLocaleDateString(
                        'vi-VN'
                      )
                    : 'Chưa cập nhật'}
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
                <p className='text-gray-900'>
                  {personalInfo.address || 'Chưa cập nhật'}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Giới thiệu
              </label>
              {isEditing ? (
                <textarea
                  value={personalInfo.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              ) : (
                <p className='text-gray-900'>
                  {personalInfo.bio || 'Chưa cập nhật'}
                </p>
              )}
            </div>

            {/* Role-specific fields */}
            {userRole === 'student' && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Trình độ tiếng Anh
                  </label>
                  {isEditing ? (
                    <select
                      value={personalInfo.level}
                      onChange={(e) =>
                        handleInputChange('level', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value=''>Chọn trình độ</option>
                      <option value='Beginner'>Sơ cấp</option>
                      <option value='Elementary'>Cơ bản</option>
                      <option value='Intermediate'>Trung cấp</option>
                      <option value='Upper Intermediate'>Trung cấp cao</option>
                      <option value='Advanced'>Nâng cao</option>
                    </select>
                  ) : (
                    <p className='text-gray-900'>
                      {personalInfo.level || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Tên phụ huynh
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={personalInfo.parentName}
                      onChange={(e) =>
                        handleInputChange('parentName', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900'>
                      {personalInfo.parentName || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    SĐT phụ huynh
                  </label>
                  {isEditing ? (
                    <input
                      type='tel'
                      value={personalInfo.parentPhone}
                      onChange={(e) =>
                        handleInputChange('parentPhone', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900'>
                      {personalInfo.parentPhone || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </>
            )}

            {userRole === 'teacher' && (
              <>
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
                    <p className='text-gray-900'>
                      {personalInfo.specialization || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Học vấn
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={personalInfo.education}
                      onChange={(e) =>
                        handleInputChange('education', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900'>
                      {personalInfo.education || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Số năm kinh nghiệm
                  </label>
                  {isEditing ? (
                    <input
                      type='number'
                      value={personalInfo.experienceYears}
                      onChange={(e) =>
                        handleInputChange(
                          'experienceYears',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  ) : (
                    <p className='text-gray-900'>
                      {personalInfo.experienceYears || 0} năm
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Join Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Calendar className='w-4 h-4 inline mr-2' />
                {userRole === 'student' ? 'Ngày đăng ký' : 'Ngày tham gia'}
              </label>
              <p className='text-gray-900'>
                {personalInfo.joinDate
                  ? new Date(personalInfo.joinDate).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className='px-6 py-4 border-t border-gray-200 flex justify-end space-x-3'>
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 ${theme.button} text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2`}
            >
              {isSaving && <Loader2 className='w-4 h-4 animate-spin' />}
              <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoModal;
