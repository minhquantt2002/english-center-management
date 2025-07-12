import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Clock,
  Calendar,
  Users,
} from 'lucide-react';
import { mockClassSessions } from '../../../data';
import { ClassSession } from '../../../types';

interface ClassItem {
  id: string;
  title: string;
  room: string;
  time: string;
  color: string;
  bgColor: string;
}

interface DaySchedule {
  [key: string]: ClassItem[];
}

const TeachingSchedule = () => {
  const currentWeek = 'March 18 - 24, 2024';

  const timeSlots = ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const days = [
    { name: 'Mon', date: '18' },
    { name: 'Tue', date: '19' },
    { name: 'Wed', date: '20' },
    { name: 'Thu', date: '21' },
    { name: 'Fri', date: '22' },
    { name: 'Sat', date: '23' },
    { name: 'Sun', date: '24' },
  ];

  // Generate schedule from mock data
  const schedule: DaySchedule = {};

  // Initialize empty schedule
  days.forEach((day) => {
    timeSlots.forEach((time) => {
      const key = `${day.name}-${time}`;
      schedule[key] = [];
    });
  });

  // Populate schedule with mock class sessions
  mockClassSessions
    .slice(0, 10)
    .forEach((session: ClassSession, index: number) => {
      const dayIndex = index % 7;
      const timeIndex = index % timeSlots.length;
      const day = days[dayIndex];
      const timeSlot = timeSlots[timeIndex];
      const key = `${day.name}-${timeSlot}`;

      const colors = [
        { color: 'border-blue-400', bgColor: 'bg-blue-50' },
        { color: 'border-green-400', bgColor: 'bg-green-50' },
        { color: 'border-purple-400', bgColor: 'bg-purple-50' },
        { color: 'border-orange-400', bgColor: 'bg-orange-50' },
        { color: 'border-red-400', bgColor: 'bg-red-50' },
      ];

      const colorSet = colors[index % colors.length];

      if (schedule[key]) {
        schedule[key].push({
          id: session.id,
          title: session.title,
          room: session.room,
          time: session.time,
          color: colorSet.color,
          bgColor: colorSet.bgColor,
        });
      }
    });

  const stats = [
    {
      icon: Clock,
      label: 'Tổng giờ',
      value: mockClassSessions.length.toString(),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Calendar,
      label: 'Lớp học',
      value: mockClassSessions.length.toString(),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Users,
      label: 'Phòng sử dụng',
      value: '4',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  const getClassesForTimeSlot = (day: string, timeSlot: string) => {
    const key = `${day}-${timeSlot}`;
    return schedule[key] || [];
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
              Lịch giảng dạy
            </h1>
            <p className='text-gray-500'>
              Quản lý và xem lịch giảng dạy hàng tuần
            </p>
          </div>
          <button className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'>
            <Plus className='w-4 h-4 mr-2' />
            Thêm lớp
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}
              >
                <div className='flex items-center'>
                  <Icon className={`w-8 h-8 ${stat.iconColor} mr-3`} />
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {stat.value}
                    </p>
                    <p className='text-sm text-gray-600'>{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Week Navigation */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center space-x-4'>
            <button className='p-2 rounded-full hover:bg-gray-200 transition-colors'>
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>
            <h2 className='text-lg font-medium text-gray-900'>{currentWeek}</h2>
            <button className='p-2 rounded-full hover:bg-gray-200 transition-colors'>
              <ChevronRight className='w-5 h-5 text-gray-600' />
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <button className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
              Xem theo tuần
              <ChevronDown className='w-4 h-4 ml-1' />
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          {/* Header Row */}
          <div className='grid grid-cols-8 border-b border-gray-200'>
            <div className='p-4 text-sm font-medium text-gray-500 bg-gray-50'>
              Giờ
            </div>
            {days.map((day) => (
              <div
                key={day.name}
                className='p-4 text-center bg-gray-50 border-l border-gray-200'
              >
                <div className='text-sm font-medium text-gray-900'>
                  {day.name}
                </div>
                <div className='text-xs text-gray-500'>{day.date}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <div
              key={timeSlot}
              className={`grid grid-cols-8 border-b border-gray-200 ${
                timeIndex === timeSlots.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {/* Time Column */}
              <div className='p-4 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200'>
                {timeSlot}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const classes = getClassesForTimeSlot(day.name, timeSlot);
                return (
                  <div
                    key={`${day.name}-${timeSlot}`}
                    className='p-2 border-l border-gray-200 min-h-[80px]'
                  >
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className={`${classItem.bgColor} ${classItem.color} border-l-4 rounded-r-lg p-3 mb-2 hover:shadow-sm transition-shadow cursor-pointer`}
                      >
                        <div className='text-sm font-medium text-gray-900 mb-1'>
                          {classItem.title}
                        </div>
                        <div className='text-xs text-gray-600'>
                          {classItem.room}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {classItem.time}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Class Legend */}
        <div className='mt-6 flex flex-wrap gap-4'>
          <div className='flex items-center'>
            <div className='w-4 h-4 bg-blue-50 border-l-4 border-blue-400 rounded-r mr-2'></div>
            <span className='text-sm text-gray-600'>English 101</span>
          </div>
          <div className='flex items-center'>
            <div className='w-4 h-4 bg-green-50 border-l-4 border-green-400 rounded-r mr-2'></div>
            <span className='text-sm text-gray-600'>Conversation</span>
          </div>
          <div className='flex items-center'>
            <div className='w-4 h-4 bg-purple-50 border-l-4 border-purple-400 rounded-r mr-2'></div>
            <span className='text-sm text-gray-600'>Grammar</span>
          </div>
          <div className='flex items-center'>
            <div className='w-4 h-4 bg-orange-50 border-l-4 border-orange-400 rounded-r mr-2'></div>
            <span className='text-sm text-gray-600'>Writing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingSchedule;
