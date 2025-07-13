'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Edit,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { ClassData } from '../../../../../types/admin';
import { TimeSlot } from '../../../../../types/common';
import CreateScheduleModal from './create-schedule';
import { useStaffApi } from '../../../_hooks/use-api';

interface StudyingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassData | null;
  onUpdateSchedule?: (schedule: any) => void;
}

interface ScheduleSession {
  id: string;
  day: string;
  timeSlot: TimeSlot;
  room: string;
  teacher: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

const dayNames = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};

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

const rooms = [
  'Phòng 101',
  'Phòng 102',
  'Phòng 103',
  'Phòng 201',
  'Phòng 202',
  'Phòng 203',
  'Phòng Lab 1',
  'Phòng Lab 2',
  'Online',
];

export default function StudyingScheduleModal({
  isOpen,
  onClose,
  classroom,
  onUpdateSchedule,
}: StudyingScheduleModalProps) {
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduleSession | null>(
    null
  );
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);

  const {
    loading,
    error,
    getClassroomSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useStaffApi();

  useEffect(() => {
    if (classroom && isOpen) {
      loadSchedules();
    }
  }, [classroom, isOpen]);

  const loadSchedules = async () => {
    if (!classroom?.id) return;

    try {
      const response = await getClassroomSchedules(classroom.id);
      const scheduleSessions: ScheduleSession[] = response.map(
        (schedule: any) => ({
          id: schedule.id,
          day: schedule.weekday,
          timeSlot: {
            startTime: schedule.start_time,
            endTime: schedule.end_time,
          },
          room: schedule.room?.name || 'Chưa phân công',
          teacher: classroom.teacher.name,
          status: schedule.status,
          notes: schedule.notes,
        })
      );
      setSessions(scheduleSessions);
    } catch (err) {
      console.error('Error loading schedules:', err);
    }
  };

  const handleCreateSchedule = () => {
    setIsCreateScheduleOpen(true);
  };

  const handleScheduleCreated = async (newSchedule: ScheduleSession) => {
    if (!classroom?.id) return;

    try {
      const scheduleData = {
        class_id: classroom.id,
        room_id: newSchedule.room, // This is room ID from the form
        weekday: newSchedule.day,
        start_time: newSchedule.timeSlot.startTime,
        end_time: newSchedule.timeSlot.endTime,
        title: newSchedule.notes,
        description: newSchedule.notes,
        status: newSchedule.status,
        notes: newSchedule.notes,
      };

      await createSchedule(scheduleData);
      await loadSchedules(); // Reload schedules
      setIsCreateScheduleOpen(false);
    } catch (err) {
      console.error('Error creating schedule:', err);
    }
  };

  const handleCreateScheduleClose = () => {
    setIsCreateScheduleOpen(false);
  };

  const handleEditSession = (session: ScheduleSession) => {
    setEditingSession(session);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;

    try {
      // For now, we'll keep the room name as is since we don't have room ID mapping
      // In a real implementation, you'd want to map room names to IDs
      const scheduleData = {
        status: editingSession.status,
        notes: editingSession.notes,
      };

      await updateSchedule(editingSession.id, scheduleData);
      await loadSchedules(); // Reload schedules
      setEditingSession(null);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSchedule(sessionId);
      await loadSchedules(); // Reload schedules
    } catch (err) {
      console.error('Error deleting schedule:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Đã lên lịch';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Helper function to get session for a specific day and time slot
  const getSessionForSlot = (day: string, timeSlot: TimeSlot) => {
    return sessions.find(
      (session) =>
        session.day === day &&
        session.timeSlot.startTime === timeSlot.startTime &&
        session.timeSlot.endTime === timeSlot.endTime
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Lịch học - {classroom?.name}
            </h2>
            <p className='text-gray-600 mt-1'>
              Quản lý lịch học và lịch trình của lớp
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
          {/* Loading and Error States */}
          {loading && (
            <div className='text-center py-4'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto'></div>
              <p className='text-gray-600 mt-2'>Đang tải...</p>
            </div>
          )}

          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
              <p>Lỗi: {error}</p>
            </div>
          )}

          {/* Class Info */}
          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center space-x-3'>
                <User className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Giáo viên</p>
                  <p className='font-medium text-gray-900'>
                    {classroom?.teacher.name}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <Calendar className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Lịch học</p>
                  <p className='font-medium text-gray-900'>
                    {classroom?.schedule.days} - {classroom?.schedule.time}
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-5 h-5 text-gray-500' />
                <div>
                  <p className='text-sm text-gray-600'>Phòng học</p>
                  <p className='font-medium text-gray-900'>
                    {classroom?.room || 'Chưa phân công'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add Session Button */}
          <div className='mb-6'>
            <button
              onClick={handleCreateSchedule}
              disabled={loading}
              className='bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium'
            >
              <Plus className='w-5 h-5' />
              <span>Tạo lịch học</span>
            </button>
          </div>

          {/* Create Schedule Modal */}
          <CreateScheduleModal
            isOpen={isCreateScheduleOpen}
            onClose={handleCreateScheduleClose}
            classroom={classroom}
            onScheduleCreated={handleScheduleCreated}
          />

          {/* Timetable */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Thời khóa biểu
            </h3>

            {/* Timetable Grid */}
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
                  <div
                    key={timeSlot.id}
                    className='grid grid-cols-8 gap-1 mb-1'
                  >
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
                              {isEditing &&
                              editingSession?.id === session.id ? (
                                <div className='space-y-2'>
                                  <select
                                    value={editingSession.room}
                                    onChange={(e) =>
                                      setEditingSession((prev) =>
                                        prev
                                          ? { ...prev, room: e.target.value }
                                          : null
                                      )
                                    }
                                    className='w-full text-xs px-1 py-1 border border-gray-300 rounded'
                                  >
                                    {rooms.map((room) => (
                                      <option key={room} value={room}>
                                        {room}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    value={editingSession.status}
                                    onChange={(e) =>
                                      setEditingSession((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              status: e.target.value as any,
                                            }
                                          : null
                                      )
                                    }
                                    className='w-full text-xs px-1 py-1 border border-gray-300 rounded'
                                  >
                                    <option value='scheduled'>
                                      Đã lên lịch
                                    </option>
                                    <option value='completed'>
                                      Đã hoàn thành
                                    </option>
                                    <option value='cancelled'>Đã hủy</option>
                                  </select>
                                  <div className='flex space-x-1'>
                                    <button
                                      onClick={handleSaveEdit}
                                      disabled={loading}
                                      className='text-xs bg-green-500 text-white px-1 py-1 rounded disabled:bg-gray-400'
                                    >
                                      ✓
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsEditing(false);
                                        setEditingSession(null);
                                      }}
                                      className='text-xs bg-gray-500 text-white px-1 py-1 rounded'
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className='h-full flex flex-col'>
                                  <div className='text-xs font-medium text-gray-900 mb-1'>
                                    {session.teacher}
                                  </div>
                                  <div className='text-xs text-gray-600 mb-1'>
                                    {session.room}
                                  </div>
                                  <span
                                    className={`text-xs px-1 py-0.5 rounded-full ${getStatusColor(
                                      session.status
                                    )}`}
                                  >
                                    {getStatusText(session.status)}
                                  </span>
                                  <div className='absolute top-1 right-1 flex space-x-1'>
                                    <button
                                      onClick={() => handleEditSession(session)}
                                      disabled={loading}
                                      className='text-blue-600 hover:text-blue-800 text-xs disabled:text-gray-400'
                                    >
                                      <Edit className='w-3 h-3' />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteSession(session.id)
                                      }
                                      disabled={loading}
                                      className='text-red-600 hover:text-red-800 text-xs disabled:text-gray-400'
                                    >
                                      <Trash2 className='w-3 h-3' />
                                    </button>
                                  </div>
                                </div>
                              )}
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
          <div className='bg-gray-50 rounded-lg p-4'>
            <h4 className='font-medium text-gray-900 mb-3'>Chú thích</h4>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 bg-blue-100 border border-blue-200 rounded'></div>
                <span className='text-sm text-gray-700'>Đã lên lịch</span>
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
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Đóng
          </button>
          <button
            onClick={() => {
              console.log('Saving schedule changes:', sessions);
              onClose();
            }}
            className='px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
