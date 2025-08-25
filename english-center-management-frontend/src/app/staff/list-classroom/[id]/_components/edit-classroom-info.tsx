'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import {
  ClassroomResponse,
  CourseLevel,
  TeacherResponse,
} from '../../../../../types/staff';
import { useStaffTeacherApi } from '../../../_hooks';

interface EditClassroomInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomResponse | null;
  onSave: (updatedClassroom: ClassroomResponse) => void;
}

export default function EditClassroomInfoModal({
  isOpen,
  onClose,
  classroom,
  onSave,
}: EditClassroomInfoModalProps) {
  const [formData, setFormData] = useState<Partial<ClassroomResponse>>({
    class_name: '',
    course_id: '',
    teacher_id: '',
    room: '',
    course_level: 'B1',
    status: 'active',
    start_date: '',
    end_date: '',
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const { getTeachers } = useStaffTeacherApi();

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = await getTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, getTeachers]);

  const courseLevels: { value: CourseLevel; label: string }[] = [
    { value: 'A1', label: 'A1 - Mất gốc (TOEIC 0–250)' },
    { value: 'A2', label: 'A2 - Sơ cấp (TOEIC 250–450)' },
    { value: 'B1', label: 'B1 - Trung cấp thấp (TOEIC 450–600)' },
    { value: 'B2', label: 'B2 - Trung cấp cao (TOEIC 600–850)' },
    { value: 'C1', label: 'C1 - Nâng cao (TOEIC SW 250+)' },
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

  const rooms = [
    'Phòng 101',
    'Phòng 102',
    'Phòng 103',
    'Phòng 201',
    'Phòng 202',
    'Phòng 203',
    'Phòng 301',
    'Phòng 302',
  ];

  useEffect(() => {
    if (classroom) {
      setFormData({
        ...classroom,
        teacher: { ...classroom.teacher },
      });

      // Fill schedule data if available
      if (classroom.schedules && classroom.schedules.length > 0) {
        const schedule = classroom.schedules[0];
        setSelectedTimeSlot(`${schedule.start_time} - ${schedule.end_time}`);

        // Extract days from schedules
        const days = classroom.schedules.map((s) => s.weekday);
        setSelectedDays(days);
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

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) => {
      const newDays = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day];
      return newDays;
    });
  };

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      setFormData((prev) => ({
        ...prev,
        teacher: {
          id: teacher.id,
          name: teacher.name,
          email: teacher.email || '',
        },
        teacher_id: teacherId,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.class_name?.trim()) {
      newErrors.class_name = 'Tên lớp không được để trống';
    }

    if (!formData.teacher?.id) {
      newErrors.teacher = 'Vui lòng chọn giáo viên';
    }

    if (!formData.room) {
      newErrors.room = 'Vui lòng chọn phòng học';
    }

    if (selectedDays.length === 0) {
      newErrors.scheduleDays = 'Vui lòng chọn ít nhất một ngày học';
    }

    if (!selectedTimeSlot) {
      newErrors.start_time = 'Vui lòng chọn thời gian học';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !classroom) {
      return;
    }

    // Create updated schedules
    const [startTime, endTime] = selectedTimeSlot.split(' - ');
    const updatedSchedules = selectedDays.map((day) => ({
      id:
        classroom.schedules?.find((s) => s.weekday === day)?.id || `new-${day}`,
      weekday: day,
      start_time: startTime,
      end_time: endTime,
    }));

    const updatedClassroom: ClassroomResponse = {
      ...classroom,
      ...formData,
      teacher: formData.teacher!,
      schedules: updatedSchedules,
    };

    onSave(updatedClassroom);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setSelectedDays([]);
    setSelectedTimeSlot('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>
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
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-6'
        >
          {/* Class Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-2'>
              Tên lớp học
            </label>
            <input
              type='text'
              value={formData.class_name || ''}
              onChange={(e) => handleInputChange('class_name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.class_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='Nhập tên lớp học'
            />
            {errors.class_name && (
              <p className='mt-1 text-sm text-red-600'>{errors.class_name}</p>
            )}
          </div>

          {/* Level and Teacher */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Trình độ
              </label>
              <select
                value={formData.course_level || 'B1'}
                onChange={(e) =>
                  handleInputChange('course_level', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                {courseLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
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
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
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
            <label className='block text-sm font-semibold text-gray-800 mb-3'>
              Lịch học
            </label>
            <div className='space-y-4'>
              {/* Days */}
              <div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {daysOfWeek.map((day) => (
                    <label
                      key={day.value}
                      className='flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      <input
                        type='checkbox'
                        checked={selectedDays.includes(day.value)}
                        onChange={() => handleDayToggle(day.value)}
                        className='rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        {day.label}
                      </span>
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
                <label className='block text-sm font-semibold text-gray-800 mb-2'>
                  Thời gian
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.start_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn thời gian</option>
                  {timeSlots.map((time) => (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  ))}
                </select>
                {errors.start_time && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.start_time}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Room */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-2'>
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
              {rooms.map((room) => (
                <option
                  key={room}
                  value={room}
                >
                  {room}
                </option>
              ))}
            </select>
            {errors.room && (
              <p className='mt-1 text-sm text-red-600'>{errors.room}</p>
            )}
          </div>

          {/* Course Dates */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Ngày bắt đầu
              </label>
              <input
                type='date'
                value={formData.start_date || ''}
                onChange={(e) =>
                  handleInputChange('start_date', e.target.value)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-2'>
                Ngày kết thúc
              </label>
              <input
                type='date'
                value={formData.end_date || ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-2'>
              Trạng thái
            </label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
            >
              <option value='active'>Đang hoạt động</option>
              <option value='cancelled'>Đã huỷ</option>
              <option value='completed'>Đã hoàn thành</option>
            </select>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-2.5 text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg flex items-center space-x-2 transition-colors'
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
