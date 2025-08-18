import React from 'react';
import { Users, Clock, MapPin, Book } from 'lucide-react';

interface ClassStatsProps {
  totalStudents: number;
  room: string;
  currentUnit: string;
}

const ClassStats: React.FC<ClassStatsProps> = ({ totalStudents, room }) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
      <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='flex items-center'>
          <div className='p-3 bg-blue-50 rounded-lg'>
            <Users className='w-6 h-6 text-blue-600' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Học viên</p>
            <p className='text-2xl font-semibold text-gray-900'>
              {totalStudents}
            </p>
          </div>
        </div>
        {/* <div className='flex items-center'>
          <div className='p-3 bg-green-50 rounded-lg'>
            <Clock className='w-6 h-6 text-green-600' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Thời gian</p>
            <p className='text-2xl font-semibold text-gray-900'>90 phút</p>
          </div>
        </div> */}
        <div className='flex items-center'>
          <div className='p-3 bg-purple-50 rounded-lg'>
            <MapPin className='w-6 h-6 text-purple-600' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Phòng học</p>
            <p className='text-2xl font-semibold text-gray-900'>{room}</p>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='p-3 bg-orange-50 rounded-lg'>
            <Book className='w-6 h-6 text-orange-600' />
          </div>
          <div className='ml-4'>
            <p className='text-sm font-medium text-gray-500'>Bài học</p>
            <p className='text-2xl font-semibold text-gray-900'>Unit 3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassStats;
