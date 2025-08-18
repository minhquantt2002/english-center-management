import React from 'react';
import { ClassDetails } from '../../../../../types/teacher';

interface ClassOverviewProps {
  classDetails: ClassDetails;
}

const ClassOverview: React.FC<ClassOverviewProps> = ({ classDetails }) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
      case 'cơ bản':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
      case 'trung cấp':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
      case 'nâng cao':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSchedule = (schedules: any[]) => {
    const mapDays: Record<string, string> = {
      monday: 'Thứ 2',
      tuesday: 'Thứ 3',
      wednesday: 'Thứ 4',
      thursday: 'Thứ 5',
      friday: 'Thứ 6',
      saturday: 'Thứ 7',
      sunday: 'CN',
    };

    const orderDays: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    const sorted = [...schedules].sort(
      (a, b) => orderDays[a.weekday] - orderDays[b.weekday]
    );

    const grouped: Record<string, string[]> = {};
    sorted.forEach((s) => {
      const time =
        s.start_time && s.end_time
          ? `${s.start_time.slice(0, 5)} - ${s.end_time.slice(0, 5)}`
          : '';
      if (!grouped[time]) grouped[time] = [];
      grouped[time].push(s.weekday);
    });

    return Object.entries(grouped)
      .map(([time, days]) => {
        const formattedDays = days
          .sort((a, b) => orderDays[a] - orderDays[b])
          .map((d) => mapDays[d])
          .join(', ');
        return time ? `${formattedDays} (${time})` : formattedDays;
      })
      .join('; ');
  };

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
        {/* Class Information Card */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
                <div className='w-2 h-2 bg-blue-500 rounded-full mr-3'></div>
                Thông tin lớp học
              </h3>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between py-3 border-b border-gray-50'>
                <span className='text-sm font-medium text-gray-600'>
                  Tên lớp:
                </span>
                <span className='text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg'>
                  {classDetails.class_name}
                </span>
              </div>

              <div className='flex items-center justify-between py-3 border-b border-gray-50'>
                <span className='text-sm font-medium text-gray-600'>
                  Trình độ:
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getLevelColor(
                    classDetails.course.level
                  )}`}
                >
                  {classDetails.course.level}
                </span>
              </div>

              <div className='flex items-center justify-between py-3 border-b border-gray-50'>
                <span className='text-sm font-medium text-gray-600'>
                  Giáo viên:
                </span>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs font-semibold'>
                      {classDetails.teacher.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-gray-900'>
                    {classDetails.teacher.name}
                  </span>
                </div>
              </div>

              <div className='flex items-center justify-between py-3 border-b border-gray-50'>
                <span className='text-sm font-medium text-gray-600'>
                  Phòng học:
                </span>
                <span className='text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg'>
                  {classDetails.room}
                </span>
              </div>

              <div className='flex items-start justify-between py-3 border-b border-gray-50'>
                <span className='text-sm font-medium text-gray-600'>
                  Lịch học:
                </span>
                <span className='text-sm font-medium text-gray-900 text-right max-w-xs'>
                  {formatSchedule(classDetails.schedules)}
                </span>
              </div>

              <div className='flex items-center justify-between py-3'>
                <span className='text-sm font-medium text-gray-600'>
                  Sĩ số:
                </span>
                <span className='text-sm font-semibold text-gray-900 px-3 py-1 rounded-lg'>
                  {classDetails.enrollments.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Description Card */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-gray-900 flex items-center'>
                <div className='w-2 h-2 bg-green-500 rounded-full mr-3'></div>
                Thông tin khóa học
              </h3>
            </div>

            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Mô tả khóa học:
              </h4>
              <div className='bg-gray-50 rounded-lg p-4'>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {classDetails.course.course_name}
                </p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-green-700'>
                    Ngày bắt đầu:
                  </span>
                  <span className='text-sm font-bold text-green-800'>
                    {new Date(classDetails.start_date).toLocaleDateString(
                      'vi-VN'
                    )}
                  </span>
                </div>
              </div>

              <div className='bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-red-700'>
                    Ngày kết thúc:
                  </span>
                  <span className='text-sm font-bold text-red-800'>
                    {new Date(classDetails.end_date).toLocaleDateString(
                      'vi-VN'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassOverview;
