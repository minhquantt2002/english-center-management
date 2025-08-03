'use client';

import React from 'react';
import { AlertCircle, LogOut } from 'lucide-react';

interface TokenExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenExpirationModal: React.FC<TokenExpirationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Phiên đăng nhập đã hết hạn
            </h3>
            <p className="text-sm text-gray-600">
              Vui lòng đăng nhập lại để tiếp tục
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              // Redirect to login page
              window.location.href = '/auth/login';
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng nhập lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpirationModal; 