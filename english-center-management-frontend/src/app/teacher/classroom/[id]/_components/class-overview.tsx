import React from 'react';

interface ClassDetails {
  id: string;
  name: string;
  level: string;
  teacher: string;
  room: string;
  building: string;
  schedule: string;
  totalStudents: number;
  maxStudents: number;
  currentUnit: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  levelColor: string;
}

interface ClassOverviewProps {
  classDetails: ClassDetails;
}

const ClassOverview: React.FC<ClassOverviewProps> = ({ classDetails }) => {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Thông tin lớp học
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Tên lớp:</span>
              <span className='text-sm font-medium text-gray-900'>
                {classDetails.name}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Trình độ:</span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${classDetails.levelColor}`}
              >
                {classDetails.level}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Giáo viên:</span>
              <span className='text-sm font-medium text-gray-900'>
                {classDetails.teacher}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Phòng học:</span>
              <span className='text-sm font-medium text-gray-900'>
                {classDetails.room}, {classDetails.building}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Lịch học:</span>
              <span className='text-sm font-medium text-gray-900'>
                {classDetails.schedule}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-500'>Bài học hiện tại:</span>
              <span className='text-sm font-medium text-gray-900'>
                {classDetails.currentUnit}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Mô tả khóa học
          </h3>
          <p className='text-sm text-gray-700 leading-relaxed'>
            {classDetails.description}
          </p>
          <div className='mt-4 space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Ngày bắt đầu:</span>
              <span className='font-medium text-gray-900'>
                {new Date(classDetails.startDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-gray-500'>Ngày kết thúc:</span>
              <span className='font-medium text-gray-900'>
                {new Date(classDetails.endDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
