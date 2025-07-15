import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  X,
} from 'lucide-react';
import { useStaffTeacherApi } from '../../_hooks';

interface TeachingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  teacherName: string;
}

export default function TeachingScheduleModal({
  isOpen,
  onClose,
  teacherId,
  teacherName,
}: TeachingScheduleModalProps) {
  const [schedule, setSchedule] = useState<any[]>([]);
  const { getTeacherSchedule } = useStaffTeacherApi();

  // Fetch teacher schedule when modal opens
  useEffect(() => {
    if (isOpen && teacherId) {
      const fetchTeacherSchedule = async () => {
        try {
          const scheduleData = await getTeacherSchedule(teacherId);
          setSchedule(scheduleData.schedule || []);
        } catch (error) {
          console.error('Error fetching teacher schedule:', error);
        }
      };

      fetchTeacherSchedule();
    }
  }, [isOpen, teacherId, getTeacherSchedule]);

  const currentWeek = '23/12/2024 - 29/12/2024';

  // Teacher info from props
  const teacherInfo = {
    name: teacherName,
    specialization: 'Giáo viên tiếng Anh',
    id: teacherId,
    status: 'active' as const,
  };

  // Convert schedules to session format for display
  const sessions = schedule.map((scheduleItem: any) => {
    const typeMap = {
      'English Basics A1': 'basic',
      'Grammar Fundamentals': 'grammar',
      'Conversation Skills B1': 'conversation',
      'English 201 - Intermediate': 'intermediate',
      'Business English B2': 'business',
      'IELTS Preparation': 'ielts',
    } as const;

    const type =
      typeMap[scheduleItem.className as keyof typeof typeMap] || 'basic';

    return {
      id: scheduleItem.id,
      name: scheduleItem.className,
      room: scheduleItem.room,
      type: type,
      time: scheduleItem.timeSlot?.startTime || '9:00',
      day: scheduleItem.day || 2,
      endTime: scheduleItem.timeSlot?.endTime || '10:30',
    };
  });

  const typeColors = {
    basic:
      'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-l-4 border-blue-500',
    grammar:
      'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-l-4 border-purple-500',
    conversation:
      'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-l-4 border-green-500',
    intermediate:
      'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-l-4 border-orange-500',
    business:
      'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-l-4 border-red-500',
    ielts:
      'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
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
    { name: 'Chủ nhật', date: '29/12' },
  ];

  const getSessionsForTimeAndDay = (time: string, day: number) => {
    return sessions.filter(
      (session) => session.time === time && session.day === day
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='p-2 bg-white bg-opacity-20 rounded-full'>
                <Calendar className='w-6 h-6' />
              </div>
              <div>
                <h2 className='text-2xl font-bold'>Lịch giảng dạy</h2>
                <p className='text-blue-100 flex items-center gap-2 mt-1'>
                  <span className='font-medium'>{teacherInfo.name}</span>
                  <span>•</span>
                  <span>{teacherInfo.specialization}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(90vh-120px)]'>
          {/* Week Navigation */}
          <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <button className='p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200'>
                  <ChevronLeft className='w-5 h-5 text-gray-600' />
                </button>
                <div className='flex items-center gap-3'>
                  <Calendar className='w-5 h-5 text-blue-600' />
                  <span className='font-semibold text-gray-900 text-lg'>
                    Tuần {currentWeek}
                  </span>
                </div>
                <button className='p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200'>
                  <ChevronRight className='w-5 h-5 text-gray-600' />
                </button>
              </div>
              <button className='px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl'>
                Hôm nay
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className='bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200'>
            {/* Header Row */}
            <div className='grid grid-cols-7 gap-0 border-b border-gray-200'>
              {days.slice(1).map((day, index) => (
                <div
                  key={index}
                  className='p-4 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 last:border-r-0'
                >
                  <div className='text-center'>
                    <div className='font-bold text-gray-900 text-lg'>
                      {day.name}
                    </div>
                    <div className='text-sm text-gray-500 mt-1 font-medium'>
                      {day.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className='grid grid-rows-6'>
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={timeIndex}
                  className='grid grid-cols-7 min-h-24 border-b border-gray-200 last:border-b-0'
                >
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const dayNumber = dayIndex + 2;
                    const sessionsInSlot = getSessionsForTimeAndDay(
                      time,
                      dayNumber
                    );

                    return (
                      <div
                        key={dayIndex}
                        className='border-r border-gray-200 last:border-r-0 p-3 min-h-24 hover:bg-gray-50 transition-colors'
                      >
                        {dayIndex === 0 && (
                          <div className='font-bold text-gray-700 text-center mb-2 flex items-center justify-center gap-1'>
                            <Clock className='w-4 h-4 text-blue-600' />
                            <span>{time}</span>
                          </div>
                        )}
                        {sessionsInSlot.map((session) => (
                          <div
                            key={session.id}
                            className={`p-3 rounded-lg text-sm mb-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                              typeColors[
                                session.type as keyof typeof typeColors
                              ]
                            }`}
                          >
                            <div className='font-bold mb-1 line-clamp-2'>
                              {session.name}
                            </div>
                            <div className='flex items-center gap-1 text-xs opacity-80 mb-1'>
                              <MapPin className='w-3 h-3' />
                              <span>{session.room}</span>
                            </div>
                            <div className='text-xs opacity-70 font-medium'>
                              {session.time} - {session.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {schedule.length > 0 && (
            <div className='bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-200'>
              <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                <div className='w-2 h-8 bg-blue-600 rounded-full'></div>
                Tóm tắt lịch giảng dạy
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {schedule.map((scheduleItem) => (
                  <div
                    key={scheduleItem.id}
                    className='border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-gray-50 to-white'
                  >
                    <h4 className='font-bold text-gray-900 mb-2 text-lg'>
                      {scheduleItem.className}
                    </h4>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <MapPin className='w-4 h-4 text-blue-600' />
                        <span>{scheduleItem.room}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Clock className='w-4 h-4 text-green-600' />
                        <span>
                          {scheduleItem.timeSlot?.startTime} -{' '}
                          {scheduleItem.timeSlot?.endTime}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Calendar className='w-4 h-4 text-purple-600' />
                        <span>{scheduleItem.sessionsPerWeek} buổi/tuần</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
