'use client';

import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { formatTokenTimeRemaining } from '../utils/tokenUtils';
import { useSession } from 'next-auth/react';

interface TokenWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenWarningModal: React.FC<TokenWarningModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  
  if (!isOpen) return null;

  const timeRemaining = session?.accessToken 
    ? formatTokenTimeRemaining(session.accessToken)
    : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Phiên đăng nhập sắp hết hạn
            </h3>
            <p className="text-sm text-gray-600">
              Thời gian còn lại: <span className="font-semibold text-yellow-600">{timeRemaining}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Lưu ý:</p>
              <ul className="space-y-1">
                <li>• Lưu công việc đang làm</li>
                <li>• Đăng nhập lại để tiếp tục</li>
                <li>• Dữ liệu chưa lưu sẽ bị mất</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tiếp tục làm việc
          </button>
          <button
            onClick={() => {
              // Refresh page để lấy token mới
              window.location.reload();
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenWarningModal; 