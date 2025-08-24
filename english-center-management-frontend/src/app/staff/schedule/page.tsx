'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Clock,
  Users,
  MapPin,
  School,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useStaffScheduleApi, useStaffClassroomApi } from '../_hooks';
import { ScheduleResponse, ClassroomResponse } from '../../../types/staff';
import CreateClassroomModal from '../list-classroom/_components/create-classroom';
import { CreateScheduleModal } from './_components';
import { toast } from 'react-toastify';

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const { getSchedules, createSchedule } = useStaffScheduleApi();
  const { getClassrooms, createClassroom } = useStaffClassroomApi();

  const weekdays = [
    { key: 'monday', label: 'Thứ Hai' },
    { key: 'tuesday', label: 'Thứ Ba' },
    { key: 'wednesday', label: 'Thứ Tư' },
    { key: 'thursday', label: 'Thứ Năm' },
    { key: 'friday', label: 'Thứ Sáu' },
    { key: 'saturday', label: 'Thứ Bảy' },
    { key: 'sunday', label: 'Chủ Nhật' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const classroomsData = await getClassrooms();
      setClassrooms(classroomsData || []);

      // Get today's schedules
      const schedulesData = await getSchedules({ date: getTodayString() });
      setSchedules(schedulesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSchedules([]);
      setClassrooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClassroom = async (classroomData: any) => {
    try {
      await createClassroom(classroomData);
      setShowCreateModal(false);
      await fetchData();
      toast.success('Lớp học mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast.error('Có lỗi xảy ra khi tạo lớp học mới!');
    }
  };

  const handleCreateSchedule = async (scheduleData: any) => {
    try {
      await createSchedule(scheduleData);
      setShowCreateScheduleModal(false);
      await fetchData();
      toast.success('Lịch học mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error('Có lỗi xảy ra khi tạo lịch học mới!');
    }
  };

  const getClassroomInfo = (schedule: ScheduleResponse) => {
    return classrooms.find((classroom) => classroom.id === schedule.class_id);
  };

  const getTodayString = () => {
    return new Date().toLocaleDateString('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  };

  return (
    <>
      {/* Header */}
      <div>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Thời khóa biểu</h1>
            <p className='text-gray-600 mt-1'>
              Xem lịch học hàng tuần và quản lý lớp học
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex gap-2'>
              <button
                onClick={() => setShowCreateScheduleModal(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
              >
                <Calendar size={20} />
                Thêm lịch học
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className='bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
              >
                <Plus size={20} />
                Thêm lớp học
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='mx-auto mt-8'>
        {isLoading ? (
          <div className='flex justify-center items-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600'></div>
          </div>
        ) : (
          <div>
            {/* Today's Schedule */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-4'>
              <div className='p-6 border-b border-gray-200 flex justify-between items-center'>
                <div>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Lịch học hôm nay
                  </h2>
                  <p className='text-gray-600 mt-1'>
                    Danh sách các lớp học diễn ra hôm nay (
                    {new Date().toLocaleDateString('vi-VN')})
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className='flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                >
                  <RefreshCw size={16} />
                  Làm mới
                </button>
              </div>
              <div className='p-6'>
                {schedules.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {schedules.map((schedule) => {
                      const classroom = getClassroomInfo(schedule);
                      return (
                        <div
                          key={schedule.id}
                          className='bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h3 className='font-semibold text-gray-900 mb-2'>
                                {classroom?.class_name || 'N/A'}
                              </h3>
                              <div className='space-y-2 text-sm text-gray-600'>
                                <div className='flex items-center'>
                                  <Clock
                                    size={14}
                                    className='mr-2 text-gray-400'
                                  />
                                  {schedule.start_time} - {schedule.end_time}
                                </div>
                                <div className='flex items-center'>
                                  <Users
                                    size={14}
                                    className='mr-2 text-gray-400'
                                  />
                                  {classroom?.teacher?.name || 'N/A'}
                                </div>
                                {classroom?.room && (
                                  <div className='flex items-center'>
                                    <MapPin
                                      size={14}
                                      className='mr-2 text-gray-400'
                                    />
                                    {classroom.room}
                                  </div>
                                )}
                                <div className='flex items-center'>
                                  <Calendar
                                    size={14}
                                    className='mr-2 text-gray-400'
                                  />
                                  {weekdays.find(
                                    (d) => d.key === schedule.weekday
                                  )?.label || schedule.weekday}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <Calendar className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                    <p className='text-gray-500'>
                      Không có lịch học nào hôm nay
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* All Classrooms */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-4'>
              <div className='p-6 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Tất cả lớp học
                </h2>
                <p className='text-gray-600 mt-1'>
                  Danh sách tất cả các lớp học trong hệ thống
                </p>
              </div>
              <div className='p-6'>
                {classrooms.length > 0 ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {classrooms.map((classroom) => (
                      <div
                        key={classroom.id}
                        className='bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            <h3 className='font-semibold text-gray-900 mb-2'>
                              {classroom.class_name}
                            </h3>
                            <div className='space-y-2 text-sm text-gray-600'>
                              <div className='flex items-center'>
                                <Users
                                  size={14}
                                  className='mr-2 text-gray-400'
                                />
                                {classroom.teacher?.name || 'Chưa có giáo viên'}
                              </div>
                              {classroom.room && (
                                <div className='flex items-center'>
                                  <MapPin
                                    size={14}
                                    className='mr-2 text-gray-400'
                                  />
                                  {classroom.room}
                                </div>
                              )}
                              <div className='flex items-center'>
                                <School
                                  size={14}
                                  className='mr-2 text-gray-400'
                                />
                                {classroom.course_level}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <School className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                    <p className='text-gray-500'>Chưa có lớp học nào</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className='mt-4 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors'
                    >
                      Tạo lớp học đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-cyan-100 rounded-lg'>
                <School className='w-6 h-6 text-cyan-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Tổng lớp học
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {classrooms.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <Calendar className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Lịch học tuần này
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {schedules.length}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Clock className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Khung giờ</p>
                <p className='text-2xl font-bold text-gray-900'>6</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateClassroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateClassroom}
      />

      <CreateScheduleModal
        isOpen={showCreateScheduleModal}
        onClose={() => setShowCreateScheduleModal(false)}
        onSubmit={handleCreateSchedule}
      />
    </>
  );
};

export default SchedulePage;
