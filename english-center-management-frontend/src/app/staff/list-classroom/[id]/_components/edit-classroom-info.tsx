'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, User, Save } from 'lucide-react';
import { ClassData, CourseLevel } from '../../../../../types';
import { useStaffApi } from '../../../_hooks/use-api';

interface EditClassroomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassData | null;
  onSave: (updatedClassroom: ClassData) => void;
}

export default function EditClassroomInfoModal({
  isOpen,
  onClose,
  classroom,
  onSave,
}: EditClassroomInfoModalProps) {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const courseLevels: { value: CourseLevel; label: string }[] = [
    { value: 'beginner', label: 'Cơ bản (Beginner)' },
    { value: 'elementary', label: 'Sơ cấp (Elementary)' },
    { value: 'intermediate', label: 'Trung cấp (Intermediate)' },
    {
      value: 'upper-intermediate',
      label: 'Trung cao cấp (Upper-Intermediate)',
    },
    { value: 'advanced', label: 'Cao cấp (Advanced)' },
    { value: 'proficiency', label: 'Thành thạo (Proficiency)' },
  ];

  const timeSlots = [
    '8:00 AM - 9:30 AM',
    '9:00 AM - 10:30 AM',
    '10:00 AM - 11:30 AM',
    '2:00 PM - 3:30 PM',
    '3:00 PM - 4:30 PM',
    '6:00 PM - 7:30 PM',
    '7:00 PM - 8:30 PM',
  ];

  const daysOfWeek = [
    { value: 'Mon', label: 'Thứ 2' },
    { value: 'Tue', label: 'Thứ 3' },
    { value: 'Wed', label: 'Thứ 4' },
    { value: 'Thu', label: 'Thứ 5' },
    { value: 'Fri', label: 'Thứ 6' },
    { value: 'Sat', label: 'Thứ 7' },
    { value: 'Sun', label: 'Chủ nhật' },
  ];

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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên lớp không được để trống';
    }

    if (!formData.teacher?.id) {
      newErrors.teacher = 'Vui lòng chọn giáo viên';
    }

    if (!formData.schedule?.days?.trim()) {
      newErrors.scheduleDays = 'Vui lòng chọn ngày học';
    }

    if (!formData.schedule?.time) {
      newErrors.scheduleTime = 'Vui lòng chọn thời gian học';
    }

    if (!formData.room) {
      newErrors.room = 'Vui lòng chọn phòng học';
    }

    if (formData.maxStudents && formData.maxStudents < 1) {
      newErrors.maxStudents = 'Số học viên tối đa phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !classroom) {
      return;
    }

    const updatedClassroom: ClassData = {
      ...classroom,
      ...formData,
      schedule: formData.schedule!,
      teacher: formData.teacher!,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedClassroom);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Chỉnh sửa thông tin lớp học
          </h2>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Class Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Tên lớp học
            </label>
            <input
              type='text'
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Nhập tên lớp học'
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </div>

          {/* Level and Teacher */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Giáo viên
              </label>
              <select
                value={formData.teacher?.id || ''}
                onChange={(e) => handleTeacherChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.teacher ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacher && (
                <p className='mt-1 text-sm text-red-600'>{errors.teacher}</p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Lịch học
            </label>
            <div className='space-y-4'>
              {/* Days */}
              <div>
                <label className='block text-sm text-gray-600 mb-2'>
                  Ngày học
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
                {errors.scheduleDays && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.scheduleDays}
                  </p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className='block text-sm text-gray-600 mb-2'>
                  Thời gian
                </label>
                <select
                  value={formData.schedule?.time || ''}
                  onChange={(e) => handleScheduleChange('time', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.scheduleTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn thời gian</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.scheduleTime && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.scheduleTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Room and Max Students */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Phòng học
              </label>
              <select
                value={formData.room || ''}
                onChange={(e) => handleInputChange('room', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.room ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.room && (
                <p className='mt-1 text-sm text-red-600'>{errors.room}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Số học viên tối đa
              </label>
              <input
                type='number'
                value={formData.maxStudents || ''}
                onChange={(e) =>
                  handleInputChange('maxStudents', parseInt(e.target.value))
                }
                min='1'
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.maxStudents ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder='20'
              />
              {errors.maxStudents && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.maxStudents}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Trạng thái
            </label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
            >
              <option value='active'>Đang hoạt động</option>
              <option value='inactive'>Không hoạt động</option>
            </select>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center space-x-2 transition-colors'
            >
              <Save className='w-4 h-4' />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
