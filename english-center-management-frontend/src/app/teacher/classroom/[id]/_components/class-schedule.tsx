import React, { useState } from 'react';
import { Plus, Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import {
  ScheduleNested,
  TeacherClassroomResponse,
} from '../../../../../types/teacher';
import ViewScheduleModal from './view-schedule-modal';
import CreateScheduleModal from './create-schedule-modal';
import { useStaffScheduleApi } from '../../../../staff/_hooks';
import { toast } from 'react-toastify';

interface ClassScheduleProps {
  classroom: TeacherClassroomResponse;
  refetchData: any;
}

const weekdayColors: { [key: string]: string } = {
  'Thứ 2': 'bg-red-500',
  'Thứ 3': 'bg-orange-500',
  'Thứ 4': 'bg-yellow-500',
  'Thứ 5': 'bg-green-500',
  'Thứ 6': 'bg-blue-500',
  'Thứ 7': 'bg-indigo-500',
  'Chủ nhật': 'bg-purple-500',
};

const weekdayMap: Record<string, string> = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};

const weekdayEmojis: { [key: string]: string } = {
  'Thứ 2': '🔴',
  'Thứ 3': '🟠',
  'Thứ 4': '🟡',
  'Thứ 5': '🟢',
  'Thứ 6': '🔵',
  'Thứ 7': '🟣',
  'Chủ nhật': '🟣',
};

const ClassSchedule: React.FC<ClassScheduleProps> = ({
  classroom,
  refetchData,
}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);

  const { createSchedule } = useStaffScheduleApi();

  const getWeekdayColor = (weekday: string) => {
    return weekdayColors[weekday] || 'bg-gray-500';
  };

  const getWeekdayEmoji = (weekday: string) => {
    return weekdayEmojis[weekday] || '📅';
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      await createSchedule(scheduleData);

      setOpenCreate(false);

      refetchData();

      toast.success('Lịch học mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Có lỗi xảy ra khi tạo lịch học mới!');
    }
  };

  const renderScheduleItem = (session: ScheduleNested) => (
    <div
      key={session.id}
      className='group bg-white rounded-xl border-2 border-gray-100 p-6 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden'
    >
      <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full opacity-50'></div>

      <div className='flex items-center justify-between relative z-10'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <div
              className={`w-12 h-12 rounded-xl ${getWeekdayColor(
                weekdayMap[session.weekday]
              )} flex items-center justify-center shadow-lg`}
            >
              <span className='text-white text-lg font-bold'>
                {getWeekdayEmoji(weekdayMap[session.weekday])}
              </span>
            </div>
            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
              <div className='w-1.5 h-1.5 bg-white rounded-full'></div>
            </div>
          </div>

          <div className='flex-col items-center'>
            <h4 className='text-lg font-bold text-gray-900 mb-1'>
              {weekdayMap[session.weekday]}
            </h4>

            <div className='flex items-center'>
              <div className='flex items-center space-x-2 text-gray-700'>
                <Clock className='w-4 h-4' />
                <span className='font-medium'>
                  {session.start_time.substring(0, 5)}
                </span>
              </div>

              <div className='flex items-center space-x-2 ml-2 text-gray-700'>
                <ArrowRight className='w-4 h-4' />
                <span className='font-medium'>
                  {session.end_time.substring(0, 5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900'>
              Lịch học tuần này
            </h3>
            <p className='text-sm text-gray-600 mt-1'>
              {classroom.schedules.length} buổi học được lên lịch
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            className='flex items-center px-4 rounded-lg py-2 text-sm text-white bg-blue-600 hover:bg-blue-700'
            onClick={() => setOpenView(true)}
          >
            <Calendar className='w-4 h-4 mr-2' />
            Xem thời khoá biểu tuần
          </button>

          <button
            className='flex items-center px-4 rounded-lg py-2 text-sm text-white bg-blue-600 hover:bg-blue-700'
            onClick={() => setOpenCreate(true)}
          >
            <Plus className='w-4 h-4 mr-2' />
            Thêm lịch học
          </button>
        </div>
      </div>

      {classroom.schedules.length === 0 ? (
        <div className='text-center py-16'>
          <div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6'>
            <Calendar className='w-10 h-10 text-gray-400' />
          </div>
          <h4 className='text-xl font-semibold text-gray-900 mb-2'>
            Chưa có lịch học nào
          </h4>
          <p className='text-gray-600 mb-6'>
            Thêm lịch học để bắt đầu lên kế hoạch cho tuần này
          </p>
          <button className='inline-flex items-center px-6 py-3 border-2 border-blue-300 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all duration-200'>
            <Plus className='w-4 h-4 mr-2' />
            Thêm lịch học đầu tiên
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {classroom.schedules.map((v) => {
            return renderScheduleItem(v);
          })}
        </div>
      )}

      {classroom.schedules.length > 0 && (
        <div className='bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3'>
                <Calendar className='w-6 h-6 text-blue-600' />
              </div>
              <p className='text-2xl font-bold text-gray-900'>
                {classroom.schedules.length}
              </p>
              <p className='text-sm text-gray-600'>Buổi học</p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3'>
                <Clock className='w-6 h-6 text-green-600' />
              </div>
              <p className='text-2xl font-bold text-gray-900'>
                {classroom.schedules.length * 2}h
              </p>
              <p className='text-sm text-gray-600'>Thời lượng ước tính</p>
            </div>
            <div className='text-center'>
              <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3'>
                <BookOpen className='w-6 h-6 text-purple-600' />
              </div>
              <p className='text-2xl font-bold text-gray-900'>100%</p>
              <p className='text-sm text-gray-600'>Sẵn sàng</p>
            </div>
          </div>
        </div>
      )}

      {openView && (
        <ViewScheduleModal
          isOpen={openView}
          onClose={() => setOpenView(false)}
          classroom={classroom}
        />
      )}

      {openCreate && (
        <CreateScheduleModal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          classroomId={classroom.id}
          onSubmit={handleCreateSchedule}
        />
      )}
    </div>
  );
};

export default ClassSchedule;
