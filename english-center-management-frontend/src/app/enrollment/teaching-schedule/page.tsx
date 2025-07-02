import React from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { mockTeachers, mockClassSessions } from '../../../data';
import { ClassSession as TeacherClassSession } from '../../../types';

export default function TeachingSchedule() {
  const currentWeek = '23/12/2024 - 29/12/2024';

  // Use first teacher from mock data
  const teacher = mockTeachers[0]
    ? {
        name: mockTeachers[0].name,
        subject: 'Giáo viên tiếng Anh',
        id: mockTeachers[0].id,
        status: 'Đang hoạt động',
      }
    : {
        name: 'Giáo viên',
        subject: 'Giáo viên tiếng Anh',
        id: 'GV001',
        status: 'Đang hoạt động',
      };

  // Use mock class sessions
  const sessions = mockClassSessions
    .slice(0, 5)
    .map((session: TeacherClassSession, index: number) => ({
      id: session.id,
      name: session.title,
      room: session.room,
      type: (index % 7 === 0
        ? 'basic'
        : index % 7 === 1
        ? 'ielts'
        : index % 7 === 2
        ? 'business'
        : index % 7 === 3
        ? 'conversation'
        : index % 7 === 4
        ? 'toeic'
        : index % 7 === 5
        ? 'kids'
        : 'advanced') as
        | 'basic'
        | 'ielts'
        | 'business'
        | 'conversation'
        | 'toeic'
        | 'kids'
        | 'advanced',
      time: session.time.split(' - ')[0], // Extract start time
      day: (index % 6) + 2, // Distribute across days 2-7
    }));

  const typeColors = {
    basic: 'bg-blue-100 text-blue-800 border-blue-200',
    ielts: 'bg-green-100 text-green-800 border-green-200',
    business: 'bg-purple-100 text-purple-800 border-purple-200',
    conversation: 'bg-orange-100 text-orange-800 border-orange-200',
    toeic: 'bg-red-100 text-red-800 border-red-200',
    kids: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-pink-100 text-pink-800 border-pink-200',
  };

  const timeSlots = ['8:00', '9:00', '10:00', '14:00', '15:00', '19:00'];
  const days = [
    { name: 'Giờ', date: '' },
    { name: 'Thứ 2', date: '23/12' },
    { name: 'Thứ 3', date: '24/12' },
    { name: 'Thứ 4', date: '25/12' },
    { name: 'Thứ 5', date: '26/12' },
    { name: 'Thứ 6', date: '27/12' },
    { name: 'Thứ 7', date: '28/12' },
  ];

  const getSessionsForTimeAndDay = (time: string, day: number) => {
    return sessions.filter(
      (session) => session.time === time && session.day === day
    );
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-4'>
              <button className='flex items-center gap-2 text-gray-600 hover:text-gray-800'>
                <ArrowLeft className='w-4 h-4' />
                <span>Trở lại danh sách</span>
              </button>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold text-blue-600'>Zenlish</span>
              <span className='text-gray-500'>Lịch Giảng Dạy</span>
            </div>
          </div>

          {/* Teacher Info */}
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
              <span className='text-gray-600 font-semibold'>SJ</span>
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                {teacher.name}
              </h2>
              <p className='text-gray-600'>{teacher.subject}</p>
              <div className='flex items-center gap-4 mt-1'>
                <span className='text-sm text-gray-500'>ID: {teacher.id}</span>
                <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                  {teacher.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <ChevronLeft className='w-5 h-5' />
              </button>
              <span className='font-semibold text-gray-900'>
                Tuần {currentWeek}
              </span>
              <button className='p-2 hover:bg-gray-100 rounded-full'>
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>
            <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'>
              Hôm nay
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='grid grid-cols-7 gap-0 border-b'>
            {days.slice(1).map((day, index) => (
              <div
                key={index}
                className='p-4 bg-gray-50 border-r last:border-r-0'
              >
                <div className='text-center'>
                  <div className='font-semibold text-gray-900'>{day.name}</div>
                  <div className='text-sm text-gray-500 mt-1'>{day.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-rows-6'>
            {timeSlots.map((time, timeIndex) => (
              <div
                key={timeIndex}
                className='grid grid-cols-7 min-h-20 border-b last:border-b-0'
              >
                {Array.from({ length: 6 }, (_, dayIndex) => {
                  const dayNumber = dayIndex + 2;
                  const sessionsInSlot = getSessionsForTimeAndDay(
                    time,
                    dayNumber
                  );

                  return (
                    <div
                      key={dayIndex}
                      className='border-r last:border-r-0 p-2 min-h-20'
                    >
                      {dayIndex === 0 && (
                        <div className='font-medium text-gray-700 text-center'>
                          {time}
                        </div>
                      )}
                      {sessionsInSlot.map((session) => (
                        <div
                          key={session.id}
                          className={`p-2 rounded border-l-4 text-xs ${
                            typeColors[session.type]
                          }`}
                        >
                          <div className='font-medium'>{session.name}</div>
                          <div className='text-gray-600'>{session.room}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
