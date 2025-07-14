import React from 'react';
import { Plus } from 'lucide-react';

interface ScheduleSession {
  id: string;
  date: string;
  day: string;
  time: string;
  topic: string;
  status: 'completed' | 'upcoming' | 'cancelled';
  attendance: number;
  totalStudents: number;
}

interface ClassScheduleProps {
  sessions: ScheduleSession[];
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ sessions }) => {
  const renderScheduleItem = (session: ScheduleSession) => (
    <div
      key={session.id}
      className='bg-white rounded-lg border border-gray-200 p-4'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <div
            className={`w-3 h-3 rounded-full ${
              session.status === 'completed'
                ? 'bg-green-500'
                : session.status === 'upcoming'
                ? 'bg-blue-500'
                : 'bg-gray-400'
            }`}
          />
          <div>
            <h4 className='text-sm font-semibold text-gray-900'>
              {session.day}
            </h4>
            <p className='text-xs text-gray-500'>{session.date}</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-sm font-medium text-gray-900'>{session.time}</p>
          <p className='text-xs text-gray-500'>
            {session.attendance}/{session.totalStudents} học viên
          </p>
        </div>
      </div>
      <p className='text-sm text-gray-700 mb-3'>{session.topic}</p>
      <div className='flex items-center justify-between'>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            session.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : session.status === 'upcoming'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {session.status === 'completed'
            ? 'Đã hoàn thành'
            : session.status === 'upcoming'
            ? 'Sắp tới'
            : 'Đã hủy'}
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
