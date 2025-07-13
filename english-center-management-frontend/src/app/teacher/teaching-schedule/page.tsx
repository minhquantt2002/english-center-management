import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Lịch giảng dạy
          </h1>
          <p className='text-gray-600 text-base'>
            Quản lý và xem lịch giảng dạy hàng tuần
          </p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className='flex items-center'>
                  <div className={`p-2 rounded-lg bg-white shadow-sm mr-3`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className='text-2xl font-bold text-gray-900 mb-1'>
                      {stat.value}
                    </p>
                    <p className='text-sm font-medium text-gray-600'>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Week Navigation */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center space-x-3'>
            <button className='p-2 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200'>
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>
            <h2 className='text-lg font-semibold text-gray-900'>
              {currentWeek}
            </h2>
            <button className='p-2 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200'>
              <ChevronRight className='w-5 h-5 text-gray-600' />
            </button>
          </div>
          <div className='flex items-center space-x-2'>
            <button className='inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200'>
              Xem theo tuần
              <ChevronDown className='w-4 h-4 ml-1.5' />
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          {/* Header Row */}
          <div className='grid grid-cols-8 border-b border-gray-200 bg-gray-50'>
            <div className='p-4 text-sm font-semibold text-gray-700'>Giờ</div>
            {days.map((day) => (
              <div
                key={day.name}
                className='p-4 text-center border-l border-gray-200'
              >
                <div className='text-base font-semibold text-gray-900 mb-1'>
                  {day.name}
                </div>
                <div className='text-sm text-gray-500'>{day.date}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <div
              key={timeSlot}
              className={`grid grid-cols-8 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                timeIndex === timeSlots.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {/* Time Column */}
              <div className='p-4 text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200 flex items-center'>
                {timeSlot}
              </div>

              {/* Day Columns */}
              {days.map((day) => {
                const classes = getClassesForTimeSlot(day.name, timeSlot);
                return (
                  <div
                    key={`${day.name}-${timeSlot}`}
                    className='p-3 border-l border-gray-200 min-h-[80px] flex flex-col gap-1.5'
                  >
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className={`${classItem.bgColor} ${classItem.color} border-l-4 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]`}
                      >
                        <div className='text-xs font-semibold text-gray-900 mb-1'>
                          {classItem.title}
                        </div>
                        <div className='flex items-center justify-between text-xs text-gray-600'>
                          <span className='flex items-center'>
                            <Users className='w-3 h-3 mr-1' />
                            {classItem.room}
                          </span>
                          <span className='flex items-center'>
                            <Clock className='w-3 h-3 mr-1' />
                            {classItem.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    {classes.length === 0 && (
                      <div className='text-gray-400 text-xs text-center py-2'>
                        Không có lớp
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Class Legend */}
        <div className='mt-6 p-3 bg-white rounded-xl shadow-sm border border-gray-200'>
          <h3 className='text-base font-semibold text-gray-900 mb-2'>
            Chú thích
          </h3>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-blue-50 border-l-4 border-blue-400 rounded-r mr-2'></div>
              <span className='text-xs font-medium text-gray-700'>
                English 101
              </span>
            </div>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-green-50 border-l-4 border-green-400 rounded-r mr-2'></div>
              <span className='text-xs font-medium text-gray-700'>
                Conversation
              </span>
            </div>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-purple-50 border-l-4 border-purple-400 rounded-r mr-2'></div>
              <span className='text-xs font-medium text-gray-700'>Grammar</span>
            </div>
            <div className='flex items-center'>
              <div className='w-4 h-4 bg-orange-50 border-l-4 border-orange-400 rounded-r mr-2'></div>
              <span className='text-xs font-medium text-gray-700'>Writing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingSchedule;
