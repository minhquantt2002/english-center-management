'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  XCircle,
  Eye,
} from 'lucide-react';
import { useStudentApi } from '../_hooks/use-api';
import {
  dayNames,
  timeSlots,
} from '../../staff/list-teacher/_components/teaching-schedule-modal';

const StudyingSchedule = () => {
  const { loading, getStudentSchedule } = useStudentApi();
  const [currentWeek, setCurrentWeek] = useState(new Date()); // January 22, 2024
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedulesData = await getStudentSchedule();
        console.log('schedulesData: ', schedulesData);
        setSchedules(schedulesData);
      } catch (err) {
        console.error('Error fetching schedules:', err);
      }
    };

    fetchSchedules();
  }, [getStudentSchedule]);

  // Get week range for current week
  const getWeekRange = (date) => {
    const start = new Date(date);
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
    start.setDate(diff);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (d) => {
      return d.toLocaleDateString('vi-VN', { month: 'long', day: 'numeric' });
    };

    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  };

  // Get week number
  const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  // Navigate between weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // Get schedules for current week
  const weekSchedules = useMemo(() => {
    const startOfWeek = new Date(currentWeek);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    function getDateOfWeekday(weekday) {
      const weekdayMap = {
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

    return schedules
      .map((sch) => ({
        ...sch,
        _date: getDateOfWeekday(sch.weekday),
      }))
      .filter((schedule) => {
        // Kiểm tra tuần hiện tại có nằm trong khoảng thời gian của lớp học không
        const classStartDate = new Date(schedule.classroom.start_date);
        const classEndDate = new Date(schedule.classroom.end_date);

        // Kiểm tra xem tuần hiện tại có giao nhau với thời gian của lớp học không
        const weekInRange =
          startOfWeek <= classEndDate && endOfWeek >= classStartDate;

        return (
          schedule._date >= startOfWeek &&
          schedule._date <= endOfWeek &&
          weekInRange
        );
      });
  }, [currentWeek, schedules]);

  // Helper function to check if two time ranges overlap or match
  const timeRangesMatch = (scheduleStart, scheduleEnd, slotStart, slotEnd) => {
    // Convert time strings to minutes for easier comparison
    const timeToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const schedStartMin = timeToMinutes(scheduleStart);
    const schedEndMin = timeToMinutes(scheduleEnd);
    const slotStartMin = timeToMinutes(slotStart);
    const slotEndMin = timeToMinutes(slotEnd);

    // Check if the schedule overlaps with the slot
    return schedStartMin < slotEndMin && schedEndMin > slotStartMin;
  };

  // Helper function to get session for a specific day and time slot
  const getSessionForSlot = (day, timeSlot) => {
    const dayMap = {
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
        timeRangesMatch(
          schedule.start_time,
          schedule.end_time,
          timeSlot.startTime + ':00',
          timeSlot.endTime + ':00'
        )
      );
    });
  };

  // Get dates for the current week
  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDates = {};
    Object.keys(dayNames).forEach((day, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + index);
      weekDates[day] = currentDate;
    });

    return weekDates;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Remove seconds from HH:MM:SS
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto'>
        {/* Loading state */}
        {loading && (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
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
          <div className='overflow-x-auto'>
            <div className='min-w-[800px]'>
              {/* Header Row */}
              <div className='grid grid-cols-8 gap-1 mb-2'>
                <div className='p-3 bg-gray-100 font-medium text-gray-700 text-center text-sm'>
                  Thời gian
                </div>
                {Object.entries(dayNames).map(([key, value]) => {
                  const dayDate = weekDates[key];
                  const isTodayColumn = isToday(dayDate);
                  return (
                    <div
                      key={key}
                      className={`p-3 font-medium text-center text-sm ${
                        isTodayColumn
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div>{value}</div>
                      <div className='text-xs mt-1 font-normal'>
                        {dayDate.getDate()}/{dayDate.getMonth() + 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots Rows */}
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot.id}
                  className='grid grid-cols-8 gap-1 mb-1'
                >
                  <div className='p-3 bg-gray-50 text-gray-600 text-sm font-medium text-center border border-gray-200'>
                    {timeSlot.label}
                  </div>
                  {Object.keys(dayNames).map((day) => {
                    const session = getSessionForSlot(day, timeSlot);
                    const dayDate = weekDates[day];
                    const isTodayColumn = isToday(dayDate);
                    return (
                      <div
                        key={day}
                        className={`p-2 border border-gray-200 min-h-[100px] relative ${
                          isTodayColumn ? 'bg-purple-50' : ''
                        }`}
                      >
                        {session ? (
                          <div
                            className={`h-full border-l-4 rounded p-2 ${
                              isTodayColumn
                                ? 'bg-purple-100 border-purple-500'
                                : 'bg-blue-50 border-blue-500'
                            }`}
                          >
                            <div className='h-full flex flex-col'>
                              <div className='flex items-start justify-between mb-2'>
                                <div
                                  className={`text-xs font-semibold line-clamp-2 ${
                                    isTodayColumn
                                      ? 'text-purple-900'
                                      : 'text-blue-900'
                                  }`}
                                >
                                  {session.classroom?.class_name || 'Lớp học'}
                                </div>
                                <button
                                  onClick={() => setSelectedSchedule(session)}
                                  className={`hover:opacity-80 text-xs ml-1 flex-shrink-0 ${
                                    isTodayColumn
                                      ? 'text-purple-600'
                                      : 'text-blue-600'
                                  }`}
                                >
                                  <Eye className='w-3 h-3' />
                                </button>
                              </div>
                              <div
                                className={`text-xs mb-1 flex items-center gap-1 ${
                                  isTodayColumn
                                    ? 'text-purple-700'
                                    : 'text-blue-700'
                                }`}
                              >
                                <MapPin className='w-3 h-3' />
                                {session.classroom?.room || 'N/A'}
                              </div>
                              <div
                                className={`text-xs flex items-center gap-1 ${
                                  isTodayColumn
                                    ? 'text-purple-600'
                                    : 'text-blue-600'
                                }`}
                              >
                                <Clock className='w-3 h-3' />
                                {formatTime(session.start_time)} -{' '}
                                {formatTime(session.end_time)}
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
                        {formatTime(selectedSchedule.start_time)} -{' '}
                        {formatTime(selectedSchedule.end_time)}
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
                        {selectedSchedule.classroom?.room || 'Chưa xác định'}
                      </p>
                    </div>
                  </div>
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
