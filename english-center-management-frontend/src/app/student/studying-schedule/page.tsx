'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  XCircle,
  Eye,
  Info,
} from 'lucide-react';
import { useStudentApi } from '../_hooks/use-api';
import { ScheduleResponse } from '../../../types/student';

const StudyingSchedule: React.FC = () => {
  const { loading, error, getStudentSchedule } = useStudentApi();
  const [currentWeek, setCurrentWeek] = useState(new Date(2024, 0, 22)); // January 22, 2024
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleResponse | null>(null);
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesData = await getStudentSchedule();
        setSchedules(schedulesData);
      } catch (err) {
        console.error('Error fetching schedules:', err);
      }
    };

    fetchSchedules();
  }, [getStudentSchedule]);

  // Time slots for the timetable
  const timeSlots = [
    { id: '1', startTime: '07:00', endTime: '08:30', label: '07:00 - 08:30' },
    { id: '2', startTime: '08:30', endTime: '10:00', label: '08:30 - 10:00' },
    { id: '3', startTime: '10:00', endTime: '11:30', label: '10:00 - 11:30' },
    { id: '4', startTime: '14:00', endTime: '15:30', label: '14:00 - 15:30' },
    { id: '5', startTime: '15:30', endTime: '17:00', label: '15:30 - 17:00' },
    { id: '6', startTime: '17:00', endTime: '18:30', label: '17:00 - 18:30' },
    { id: '7', startTime: '18:30', endTime: '20:00', label: '18:30 - 20:00' },
    { id: '8', startTime: '20:00', endTime: '21:30', label: '20:00 - 21:30' },
  ];

  const dayNames = {
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
    Saturday: 'Thứ 7',
    Sunday: 'Chủ nhật',
  };

  // Get week range for current week
  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (d: Date) => {
      return d.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' });
    };

    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  };

  // Get week number
  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Navigate between weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Get schedules for current week
  const weekSchedules = useMemo(() => {
    // Map weekday string to JS day index (Monday=1, Sunday=0)
    const startOfWeek = new Date(currentWeek);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Helper to get date for a given weekday string
    function getDateOfWeekday(weekday: string) {
      const weekdayMap: Record<string, number> = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0,
      };
      const dayIdx = weekdayMap[weekday.toLowerCase()];
      const date = new Date(startOfWeek);
      date.setDate(
        startOfWeek.getDate() + ((dayIdx + 7 - startOfWeek.getDay()) % 7)
      );
      return date;
    }

    // Attach a computed date field for filtering
    return schedules
      .map((sch) => ({
        ...sch,
        _date: getDateOfWeekday(sch.weekday),
      }))
      .filter((schedule) => {
        return schedule._date >= startOfWeek && schedule._date <= endOfWeek;
      });
  }, [currentWeek, schedules]);

  // Helper function to get session for a specific day and time slot
  const getSessionForSlot = (
    day: string,
    timeSlot: { startTime: string; endTime: string }
  ) => {
    // Map UI day to backend weekday
    const dayMap: Record<string, string> = {
      Monday: 'monday',
      Tuesday: 'tuesday',
      Wednesday: 'wednesday',
      Thursday: 'thursday',
      Friday: 'friday',
      Saturday: 'saturday',
      Sunday: 'sunday',
    };
    return weekSchedules.find((schedule) => {
      return (
        schedule.weekday === dayMap[day] &&
        schedule.start_time === timeSlot.startTime &&
        schedule.end_time === timeSlot.endTime
      );
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case 'class':
        return 'Lớp học';
      case 'exam':
        return 'Kiểm tra';
      case 'extra':
        return 'Luyện tập';
      default:
        return 'Khác';
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-500';
      case 'exam':
        return 'bg-red-500';
      case 'extra':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Loading state */}
        {loading && (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Lịch học của tôi
          </h1>
          <p className='text-gray-600'>
            Xem lịch học hàng tuần và theo dõi tiến độ học tập
          </p>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
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
              <div className='text-sm text-gray-500'>
                Tuần {getWeekNumber(currentWeek)}
              </div>
            </div>

            <button
              onClick={() => navigateWeek('next')}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>

          {/* Today Button */}
          <button
            onClick={() => setCurrentWeek(new Date())}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2'
          >
            <Calendar className='w-4 h-4' />
            Hôm nay
          </button>
        </div>

        {/* Timetable */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Thời khóa biểu tuần
            </h3>
          </div>

          <div className='overflow-x-auto'>
            <div className='min-w-[800px]'>
              {/* Header Row */}
              <div className='grid grid-cols-8 gap-1 mb-2'>
                <div className='p-3 bg-gray-100 font-medium text-gray-700 text-center text-sm'>
                  Thời gian
                </div>
                {Object.entries(dayNames).map(([key, value]) => (
                  <div
                    key={key}
                    className='p-3 bg-gray-100 font-medium text-gray-700 text-center text-sm'
                  >
                    {value}
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot.id} className='grid grid-cols-8 gap-1 mb-1'>
                  <div className='p-3 bg-gray-50 text-gray-600 text-sm font-medium text-center border border-gray-200'>
                    {timeSlot.label}
                  </div>
                  {Object.keys(dayNames).map((day) => {
                    const session = getSessionForSlot(day, timeSlot);
                    return (
                      <div
                        key={day}
                        className='p-2 border border-gray-200 min-h-[80px] relative'
                      >
                        {session ? (
                          <div className='h-full'>
                            <div className='h-full flex flex-col'>
                              <div className='flex items-start justify-between mb-1'>
                                <div className='text-xs font-medium text-gray-900 truncate'>
                                  {session.classroom?.class_name || 'Lớp học'}
                                </div>
                                <button
                                  onClick={() => setSelectedSchedule(session)}
                                  className='text-blue-600 hover:text-blue-800 text-xs ml-1'
                                >
                                  <Eye className='w-3 h-3' />
                                </button>
                              </div>
                              <div className='text-xs text-gray-600 mb-1'>
                                {session.classroom?.room || ''}
                              </div>
                              <div className='text-xs text-gray-600 mb-1'>
                                {''}
                              </div>
                              <div className='flex items-center gap-1 mb-1'>
                                {/* Type info not available in ScheduleResponse */}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className='h-full flex items-center justify-center text-gray-400 text-xs'>
                            Trống
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
          <h3 className='font-medium text-gray-900 mb-3'>Chú thích</h3>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-blue-500 rounded'></div>
              <span className='text-sm text-gray-700'>Lớp học thường</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-red-500 rounded'></div>
              <span className='text-sm text-gray-700'>Kiểm tra</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-green-500 rounded'></div>
              <span className='text-sm text-gray-700'>Luyện tập thêm</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-blue-100 border border-blue-200 rounded'></div>
              <span className='text-sm text-gray-700'>Sắp tới</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-green-100 border border-green-200 rounded'></div>
              <span className='text-sm text-gray-700'>Đã hoàn thành</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 bg-red-100 border border-red-200 rounded'></div>
              <span className='text-sm text-gray-700'>Đã hủy</span>
            </div>
          </div>
        </div>

        {/* Schedule Detail Modal */}
        {selectedSchedule && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4'>
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Chi tiết lịch học
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    Thông tin chi tiết về buổi học
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className='text-gray-400 hover:text-gray-600 transition-colors'
                >
                  <XCircle className='w-6 h-6' />
                </button>
              </div>

              {/* Content */}
              <div className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <BookOpen className='w-5 h-5 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-600'>Tên lớp</p>
                      <p className='font-medium text-gray-900'>
                        {selectedSchedule.classroom?.class_name || 'Lớp học'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <Clock className='w-5 h-5 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-600'>Thời gian</p>
                      <p className='font-medium text-gray-900'>
                        {selectedSchedule.start_time} -{' '}
                        {selectedSchedule.end_time}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <Calendar className='w-5 h-5 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-600'>Ngày</p>
                      <p className='font-medium text-gray-900'>
                        {Object.entries(dayNames).find(
                          ([k, v]) =>
                            k.toLowerCase() === selectedSchedule.weekday
                        )?.[1] || selectedSchedule.weekday}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <MapPin className='w-5 h-5 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-600'>Phòng học</p>
                      <p className='font-medium text-gray-900'>
                        {selectedSchedule.classroom?.room || ''}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <User className='w-5 h-5 text-gray-500' />
                    <div>
                      <p className='text-sm text-gray-600'>Giáo viên</p>
                      <p className='font-medium text-gray-900'>{''}</p>
                    </div>
                  </div>

                  {/* Topic info not available in ScheduleResponse */}

                  {/* Type info not available in ScheduleResponse */}

                  {/* Status info not available in ScheduleResponse */}
                </div>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50'>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyingSchedule;
