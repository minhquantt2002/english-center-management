'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, User } from 'lucide-react';
import { ClassData } from '@/types';
import { useStaffApi } from '../../_hooks/use-api';

interface EditClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassData | null;
  onSave: (updatedClassroom: ClassData) => void;
}

const timeSlots = [
  '08:00 - 09:30',
  '09:45 - 11:15',
  '13:30 - 15:00',
  '15:15 - 16:45',
  '18:00 - 19:30',
  '19:45 - 21:15',
];

const daysOfWeek = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' },
];

const courseLevels = [
  { value: 'beginner', label: 'Sơ cấp' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung cấp' },
  { value: 'upper-intermediate', label: 'Trung cao cấp' },
  { value: 'advanced', label: 'Cao cấp' },
  { value: 'proficiency', label: 'Thành thạo' },
];

export default function EditClassroomModal({
  isOpen,
  onClose,
  classroom,
  onSave,
}: EditClassroomModalProps) {
  const [formData, setFormData] = useState<Partial<ClassData>>({
    name: '',
    level: 'intermediate',
    teacher: { id: '', name: '' },
    students: 0,
    maxStudents: 20,
    schedule: { days: '', time: '' },
    room: '',
    status: 'active',
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getTeachers, getRooms } = useStaffApi();

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teachersData, roomsData] = await Promise.all([
          getTeachers(),
          getRooms(),
        ]);
        setTeachers(teachersData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, getTeachers, getRooms]);

  useEffect(() => {
    if (classroom) {
      setFormData({
        ...classroom,
        schedule: { ...classroom.schedule },
        teacher: { ...classroom.teacher },
      });
      // Parse days from schedule.days if it exists
      if (classroom.schedule.days) {
        setSelectedDays(
          classroom.schedule.days.split(',').map((day) => day.trim())
        );
      }
    }
  }, [classroom]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScheduleChange = (field: 'days' | 'time', value: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule!,
        [field]: value,
      },
    }));
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      const newDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];

      // Update form data
      setFormData((prev) => ({
        ...prev,
        schedule: {
          ...prev.schedule!,
          days: newDays.join(', '),
        },
      }));

      return newDays;
    });
  };

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      setFormData((prev) => ({
        ...prev,
        teacher: { id: teacher.id, name: teacher.name },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classroom && formData) {
      const updatedClassroom: ClassData = {
        ...classroom,
        ...formData,
        schedule: {
          days: selectedDays.join(', '),
          time: formData.schedule?.time || classroom.schedule.time,
        },
      };
      onSave(updatedClassroom);
      onClose();
    }
  };

  if (!isOpen || !classroom) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Chỉnh sửa lớp học
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>
              Thông tin cơ bản
            </h3>

            {/* Class Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tên lớp học
              </label>
              <input
                type='text'
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                placeholder='Nhập tên lớp học'
                required
              />
            </div>

            {/* Course Level */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trình độ
              </label>
              <select
                value={formData.level || 'intermediate'}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                {courseLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Giáo viên
              </label>
              <select
                value={formData.teacher?.id || ''}
                onChange={(e) => handleTeacherChange(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                <option value=''>Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>
              Lịch học
            </h3>

            {/* Days of Week */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày học trong tuần
              </label>
              <div className='grid grid-cols-4 gap-2'>
                {daysOfWeek.map((day) => (
                  <label
                    key={day.value}
                    className='flex items-center space-x-2 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={selectedDays.includes(day.value)}
                      onChange={() => handleDayToggle(day.value)}
                      className='rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
                    />
                    <span className='text-sm text-gray-700'>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Thời gian học
              </label>
              <select
                value={formData.schedule?.time || ''}
                onChange={(e) => handleScheduleChange('time', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                <option value=''>Chọn thời gian</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room and Capacity */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>
              Phòng học và sĩ số
            </h3>

            {/* Room */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Phòng học
              </label>
              <select
                value={formData.room || ''}
                onChange={(e) => handleInputChange('room', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                required
              >
                <option value=''>Chọn phòng học</option>
                {rooms
                  .filter(
                    (room) =>
                      room.status === 'available' || room.status === 'occupied'
                  )
                  .map((room) => (
                    <option key={room.id} value={room.name}>
                      {room.name} - Sức chứa: {room.capacity}
                    </option>
                  ))}
              </select>
            </div>

            {/* Max Students */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sĩ số tối đa
              </label>
              <input
                type='number'
                value={formData.maxStudents || 20}
                onChange={(e) =>
                  handleInputChange('maxStudents', parseInt(e.target.value))
                }
                min='1'
                max='50'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              />
            </div>

            {/* Current Students */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Số học viên hiện tại
              </label>
              <input
                type='number'
                value={formData.students || 0}
                onChange={(e) =>
                  handleInputChange('students', parseInt(e.target.value))
                }
                min='0'
                max={formData.maxStudents || 20}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Status */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>
              Trạng thái
            </h3>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái lớp học
              </label>
              <select
                value={formData.status || 'active'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                <option value='active'>Đang hoạt động</option>
                <option value='inactive'>Tạm dừng</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-6 border-t'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors'
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
