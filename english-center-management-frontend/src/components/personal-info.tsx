import React, { useState } from 'react';
import { Camera, Calendar, Edit } from 'lucide-react';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    fullName: 'Emma Johnson',
    dateOfBirth: '15/03/1998',
    email: 'emma.johnson@email.com',
    phoneNumber: '+1 (555) 123-4567',
    currentClass: 'Trung cấp B2',
    enrollmentStatus: 'Đang học',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log('Saving data:', formData);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-sm p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-8'>
            Thông tin cá nhân
          </h1>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            {/* Profile Photo Section */}
            <div className='lg:col-span-1 flex flex-col items-center space-y-4'>
              <div className='relative'>
                <img
                  src='https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
                  alt='Ảnh đại diện'
                  className='w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg'
                />
              </div>
              <button className='bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2'>
                <Camera className='w-4 h-4' />
                <span>Đổi ảnh</span>
              </button>
            </div>

            {/* Form Fields */}
            <div className='lg:col-span-3'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Full Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type='text'
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                    />
                  ) : (
                    <div className='w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium'>
                      {formData.fullName}
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Ngày sinh
                  </label>
                  <div className='relative'>
                    {isEditing ? (
                      <input
                        type='text'
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange('dateOfBirth', e.target.value)
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                        placeholder='DD/MM/YYYY'
                      />
                    ) : (
                      <div className='w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium flex items-center justify-between'>
                        <span>{formData.dateOfBirth}</span>
                        <Calendar className='w-5 h-5 text-gray-400' />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Địa chỉ email
                  </label>
                  {isEditing ? (
                    <input
                      type='email'
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                    />
                  ) : (
                    <div className='w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium'>
                      {formData.email}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type='tel'
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange('phoneNumber', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                    />
                  ) : (
                    <div className='w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium'>
                      {formData.phoneNumber}
                    </div>
                  )}
                </div>

                {/* Current Class */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Lớp hiện tại
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.currentClass}
                      onChange={(e) =>
                        handleInputChange('currentClass', e.target.value)
                      }
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                    >
                      <option value='Sơ cấp A1'>Sơ cấp A1</option>
                      <option value='Cơ bản A2'>Cơ bản A2</option>
                      <option value='Trung cấp B1'>Trung cấp B1</option>
                      <option value='Trung cấp B2'>Trung cấp B2</option>
                      <option value='Trung cấp cao C1'>Trung cấp cao C1</option>
                      <option value='Nâng cao C2'>Nâng cao C2</option>
                    </select>
                  ) : (
                    <div className='w-full px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium'>
                      {formData.currentClass}
                    </div>
                  )}
                </div>

                {/* Enrollment Status */}
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Trạng thái hiện tại
                  </label>
                  <div className='flex items-center space-x-3'>
                    {isEditing ? (
                      <select
                        value={formData.enrollmentStatus}
                        onChange={(e) =>
                          handleInputChange('enrollmentStatus', e.target.value)
                        }
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none'
                      >
                        <option value='Đang học'>Đang học</option>
                        <option value='Ngừng học'>Ngừng học</option>
                        <option value='Tạm dừng'>Tạm dừng</option>
                        <option value='Đã tốt nghiệp'>Đã tốt nghiệp</option>
                      </select>
                    ) : (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                        {formData.enrollmentStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end space-x-4 mt-8'>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                  >
                    Hủy
                  </button>
                )}
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className='px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2'
                  >
                    Lưu thay đổi
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className='px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2'
                  >
                    <Edit className='w-4 h-4' />
                    <span>Chỉnh sửa hồ sơ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
