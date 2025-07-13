import React from 'react';
import { FileText, Plus } from 'lucide-react';

const MaterialsManagement: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Tài liệu học tập
        </h3>
        <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <Plus className='w-4 h-4 mr-2' />
          Thêm tài liệu
        </button>
      </div>
      <div className='bg-gray-50 rounded-lg p-6 text-center'>
        <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' />
        <h4 className='text-lg font-medium text-gray-900 mb-2'>
          Chưa có tài liệu
        </h4>
        <p className='text-gray-500 mb-4'>
          Tải lên tài liệu học tập để chia sẻ với học viên
        </p>
        <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <Plus className='w-4 h-4 mr-2' />
          Tải lên tài liệu
        </button>
      </div>
    </div>
  );
};

export default MaterialsManagement;
