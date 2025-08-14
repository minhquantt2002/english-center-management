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
    { start: '08:00', end: '09:30', label: '08:00 - 09:30' },
    { start: '09:45', end: '11:15', label: '09:45 - 11:15' },
    { start: '13:30', end: '15:00', label: '13:30 - 15:00' },
    { start: '15:15', end: '16:45', label: '15:15 - 16:45' },
    { start: '17:00', end: '18:30', label: '17:00 - 18:30' },
    { start: '18:45', end: '20:15', label: '18:45 - 20:15' },
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
            <Clock size={16} className='mr-2 text-gray-400' />
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
                            <Users size={12} className='mr-1' />
                            <span className='truncate'>
                              {classroom?.teacher?.name || 'N/A'}
                            </span>
                          </div>
                          {classroom?.room && (
                            <div className='text-cyan-600 flex items-center mt-1'>
                              <MapPin size={12} className='mr-1' />
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
