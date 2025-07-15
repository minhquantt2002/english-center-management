import React from 'react';
import { Plus } from 'lucide-react';
import { ScheduleNested } from '../../../../../types/teacher';

interface ClassScheduleProps {
  sessions: ScheduleNested[];
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ sessions }) => {
  const renderScheduleItem = (session: ScheduleNested) => (
    <div
      key={session.id}
      className='bg-white rounded-lg border border-gray-200 p-4'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <div className={`w-3 h-3 rounded-full bg-gray-400`} />
          <div>
            <h4 className='text-sm font-semibold text-gray-900'>
              {session.weekday}
            </h4>
            <p className='text-xs text-gray-500'>{session.start_time}</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-sm font-medium text-gray-900'>
            {session.end_time}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <span
          className={`text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700`}
        >
          Lịch học
        </span>
        <button className='text-xs text-blue-600 hover:text-blue-700 font-medium'>
          Chi tiết
        </button>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Lịch học tuần này
        </h3>
        <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <Plus className='w-4 h-4 mr-2' />
          Thêm lịch học
        </button>
      </div>
      <div className='space-y-4'>{sessions.map(renderScheduleItem)}</div>
    </div>
  );
};

export default ClassSchedule;
