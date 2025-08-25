import React, { useState } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

interface ChangePasswordModalProps {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  onClose,
}) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = 'Mật khẩu cũ không được để trống';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới không được để trống';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }

    if (formData.oldPassword === formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới phải khác với mật khẩu cũ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await await api.post(`/auth/change-password/`, {
        old_password: formData.oldPassword.trim(),
        new_password: formData.newPassword.trim(),
      });
      toast.success('Đổi mật khẩu thành công!');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>Đổi mật khẩu</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
            type='button'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className='p-6 space-y-6'>
          {/* Old Password */}
          <div>
            <label
              htmlFor='oldPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Mật khẩu cũ <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='oldPassword'
                type={showPasswords.old ? 'text' : 'password'}
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange('oldPassword', e.target.value)
                }
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.oldPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Nhập mật khẩu cũ'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('old')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className='text-red-500 text-sm mt-1'>{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Mật khẩu mới <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='newPassword'
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange('newPassword', e.target.value)
                }
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.newPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Nhập mật khẩu mới'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('new')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className='text-red-500 text-sm mt-1'>{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Nhập lại mật khẩu mới <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300'
                }`}
                placeholder='Nhập lại mật khẩu mới'
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('confirm')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPasswords.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password requirements */}
          <div className='bg-gray-50 rounded-md p-3'>
            <p className='text-sm text-gray-600 font-medium mb-2'>
              Yêu cầu mật khẩu:
            </p>
            <ul className='text-sm text-gray-500 space-y-1'>
              <li className='flex items-center'>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    formData.newPassword.length >= 6
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
                Ít nhất 6 ký tự
              </li>
              <li className='flex items-center'>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${
                    formData.newPassword &&
                    formData.oldPassword !== formData.newPassword
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
                Khác với mật khẩu cũ
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium'
              disabled={isLoading}
            >
              Đóng
            </button>
            <button
              type='submit'
              onClick={handleSubmit}
              disabled={isLoading}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
