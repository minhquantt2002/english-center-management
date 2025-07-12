'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import { mockStudentClasses } from '../../../data';
import { StudentClass } from '../../../types';

interface ClassEvent {
  id: string;
  title: string;
  room: string;
  instructor: string;
  startTime: string;
  endTime: string;
  day: number; // 0 = Monday, 1 = Tuesday, etc.
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const ClassSchedule: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date(2024, 11, 16)); // December 16, 2024
  const [selectedView, setSelectedView] = useState<'Day' | 'Week' | 'Month'>(
    'Week'
  );

  // Use mock student classes data
  const classEvents: ClassEvent[] = mockStudentClasses
    .slice(0, 3)
    .map((studentClass: StudentClass, index: number) => {
      const [startTime, endTime] = studentClass.schedule.time.split(' - ');
      return {
        id: studentClass.id,
        title: studentClass.name,
        room: studentClass.room,
        instructor: studentClass.teacher.name,
        startTime: startTime,
        endTime: endTime || '12:00 PM',
        day: index % 5, // Distribute across weekdays (0-4)
        color: (['blue', 'green', 'purple', 'orange', 'red'] as const)[
          index % 5
        ],
      };
    });

  const timeSlots = [
    '8:00 AM',
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM',
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekNumbers = [16, 17, 18, 19, 20, 21, 22];

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);

    const formatDate = (d: Date) => {
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 border-l-blue-500 text-blue-800',
      green: 'bg-green-100 border-l-green-500 text-green-800',
      purple: 'bg-purple-100 border-l-purple-500 text-purple-800',
      orange: 'bg-orange-100 border-l-orange-500 text-orange-800',
      red: 'bg-red-100 border-l-red-500 text-red-800',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const renderClassCard = (classEvent: ClassEvent) => (
    <div
      key={classEvent.id}
      className={`p-3 rounded-lg border-l-4 ${getColorClasses(
        classEvent.color
      )} cursor-pointer hover:shadow-md transition-shadow duration-200 h-32`}
    >
      <h4 className='font-semibold text-sm mb-1'>{classEvent.title}</h4>
      <p className='text-xs opacity-75 mb-1'>{classEvent.room}</p>
      <p className='text-xs opacity-75'>{classEvent.instructor}</p>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Lịch học</h1>
          <p className='text-gray-600'>
            Quản lý lịch học hàng tuần và kế hoạch học tập
          </p>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
          {/* View Toggle */}
          <div className='bg-white rounded-lg p-1 shadow-sm border border-gray-200'>
            {(['Day', 'Week', 'Month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === view
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Week Navigation */}
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigateWeek('prev')}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            <div className='text-center'>
              <div className='font-semibold text-gray-900'>
                {getWeekRange(currentWeek)}
              </div>
              <div className='text-sm text-gray-500'>Week 51</div>
            </div>

            <button
              onClick={() => navigateWeek('next')}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2'>
              <Plus className='w-4 h-4' />
              Thêm lớp
            </button>
            <button className='bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2'>
              <Download className='w-4 h-4' />
              Xuất
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {/* Header Row */}
          <div className='grid grid-cols-8 border-b border-gray-200'>
            <div className='p-4 bg-gray-50 font-medium text-gray-700 text-center'>
              Giờ
            </div>
            {weekDays.map((day, index) => (
              <div key={day} className='p-4 bg-gray-50 text-center'>
                <div className='font-medium text-gray-700'>{day}</div>
                <div className='text-2xl font-bold text-gray-900 mt-1'>
                  {weekNumbers[index]}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className='grid grid-cols-8'>
            {/* Time Column */}
            <div className='bg-gray-50'>
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className='p-4 border-b border-gray-200 h-20 flex items-center justify-center text-sm text-gray-600'
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div key={dayIndex} className='border-l border-gray-200'>
                {timeSlots.map((time, timeIndex) => {
                  const classForThisSlot = classEvents.find(
                    (event) =>
                      event.day === dayIndex && event.startTime === time
                  );

                  return (
                    <div
                      key={`${dayIndex}-${timeIndex}`}
                      className='border-b border-gray-200 h-20 p-2'
                    >
                      {classForThisSlot && renderClassCard(classForThisSlot)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <h3 className='font-medium text-gray-900 mb-3'>Loại lớp học</h3>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-blue-100 border-l-4 border-blue-500 rounded'></div>
              <span className='text-sm text-gray-600'>Lớp ngữ pháp</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded'></div>
              <span className='text-sm text-gray-600'>Luyện nói</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-purple-100 border-l-4 border-purple-500 rounded'></div>
              <span className='text-sm text-gray-600'>Lớp viết</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-orange-100 border-l-4 border-orange-500 rounded'></div>
              <span className='text-sm text-gray-600'>Lớp đọc</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 bg-red-100 border-l-4 border-red-500 rounded'></div>
              <span className='text-sm text-gray-600'>Luyện thi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
