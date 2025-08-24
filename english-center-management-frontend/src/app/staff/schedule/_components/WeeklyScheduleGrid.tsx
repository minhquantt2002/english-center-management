'use client';

import React from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { ScheduleResponse, ClassroomResponse } from '../../../../types/staff';

interface WeeklyScheduleGridProps {
  schedules: ScheduleResponse[];
  classrooms: ClassroomResponse[];
}

const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  schedules,
  classrooms,
}) => {
  // Các ngày trong tuần
  const weekdays = [
    { key: 'monday', label: 'Thứ Hai' },
    { key: 'tuesday', label: 'Thứ Ba' },
    { key: 'wednesday', label: 'Thứ Tư' },
    { key: 'thursday', label: 'Thứ Năm' },
    { key: 'friday', label: 'Thứ Sáu' },
    { key: 'saturday', label: 'Thứ Bảy' },
    { key: 'sunday', label: 'Chủ Nhật' },
  ];

  // Khung giờ học
  const timeSlots = [
    { start: '14:00', end: '16:00', label: '14:00 - 16:00' },
    { start: '16:00', end: '18:00', label: '16:00 - 18:00' },
    { start: '18:00', end: '20:00', label: '18:00 - 20:00' },
    { start: '20:00', end: '22:00', label: '20:00 - 22:00' },
  ];

  // Lấy lịch học cho một ngày và khung giờ cụ thể
  const getScheduleForSlot = (weekday: string, timeSlot: any) => {
    return schedules.filter((schedule) => {
      return (
        schedule.weekday === weekday &&
        schedule.start_time === timeSlot.start &&
        schedule.end_time === timeSlot.end
      );
    });
  };

  // Lấy thông tin lớp học từ schedule
  const getClassroomInfo = (schedule: ScheduleResponse) => {
    return classrooms.find((classroom) => classroom.id === schedule.class_id);
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {/* Table Header */}
      <div className='grid grid-cols-8 bg-gray-50 border-b border-gray-200'>
        <div className='p-4 font-semibold text-gray-700 border-r border-gray-200'>
          Khung giờ
        </div>
        {weekdays.map((day) => (
          <div
            key={day.key}
            className='p-4 font-semibold text-gray-700 text-center border-r border-gray-200 last:border-r-0'
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* Schedule Rows */}
      {timeSlots.map((timeSlot, timeIndex) => (
        <div
          key={timeSlot.label}
          className={`grid grid-cols-8 border-b border-gray-200 last:border-b-0 ${
            timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
          }`}
        >
          {/* Time Slot */}
          <div className='p-4 font-medium text-gray-600 border-r border-gray-200 flex items-center'>
            <Clock
              size={16}
              className='mr-2 text-gray-400'
            />
            {timeSlot.label}
          </div>

          {/* Days */}
          {weekdays.map((day) => {
            const daySchedules = getScheduleForSlot(day.key, timeSlot);
            return (
              <div
                key={day.key}
                className='p-2 border-r border-gray-200 last:border-r-0 min-h-[80px]'
              >
                {daySchedules.length > 0 ? (
                  <div className='space-y-1'>
                    {daySchedules.map((schedule) => {
                      const classroom = getClassroomInfo(schedule);
                      return (
                        <div
                          key={schedule.id}
                          className='bg-cyan-100 border border-cyan-200 rounded-lg p-2 text-xs hover:bg-cyan-200 transition-colors cursor-pointer'
                        >
                          <div className='font-semibold text-cyan-800 truncate'>
                            {classroom?.class_name || 'N/A'}
                          </div>
                          <div className='text-cyan-600 flex items-center mt-1'>
                            <Users
                              size={12}
                              className='mr-1'
                            />
                            <span className='truncate'>
                              {classroom?.teacher?.name || 'N/A'}
                            </span>
                          </div>
                          {classroom?.room && (
                            <div className='text-cyan-600 flex items-center mt-1'>
                              <MapPin
                                size={12}
                                className='mr-1'
                              />
                              <span className='truncate'>{classroom.room}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='h-full flex items-center justify-center text-gray-400'>
                    <span className='text-xs'>Trống</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WeeklyScheduleGrid;
