'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Save } from 'lucide-react';
import { useStaffClassroomApi } from '../../_hooks';
import {
  ScheduleCreate,
  ClassroomResponse,
  Weekday,
} from '../../../../types/staff';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduleData: ScheduleCreate) => Promise<void>;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ScheduleCreate>({
    class_id: '',
    weekday: 'monday' as Weekday,
    start_time: '',
    end_time: '',
  });

  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getClassrooms } = useStaffClassroomApi();

  const weekdays = [
    { value: 'monday', label: 'Thứ Hai' },
    { value: 'tuesday', label: 'Thứ Ba' },
    { value: 'wednesday', label: 'Thứ Tư' },
    { value: 'thursday', label: 'Thứ Năm' },
    { value: 'friday', label: 'Thứ Sáu' },
    { value: 'saturday', label: 'Thứ Bảy' },
    { value: 'sunday', label: 'Chủ Nhật' },
  ];

  const timeSlots = [
    { start: '14:00', end: '16:00' },
    { start: '16:00', end: '18:00' },
    { start: '18:00', end: '20:00' },
    { start: '20:00', end: '22:00' },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchClassrooms();
    }
  }, [isOpen]);

  const fetchClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleInputChange = (field: keyof ScheduleCreate, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleTimeSlotChange = (timeSlot: { start: string; end: string }) => {
    setFormData((prev) => ({
      ...prev,
      start_time: timeSlot.start,
      end_time: timeSlot.end,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.class_id) {
      newErrors.class_id = 'Vui lòng chọn lớp học';
    }

    if (!formData.weekday) {
      newErrors.weekday = 'Vui lòng chọn ngày trong tuần';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Vui lòng chọn giờ bắt đầu';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'Vui lòng chọn giờ kết thúc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      class_id: '',
      weekday: 'monday' as Weekday,
      start_time: '',
      end_time: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>Thêm lịch học</h2>
            <p className='text-sm text-gray-600 mt-1'>
              Tạo lịch học mới cho lớp
            </p>
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-4'
        >
          {/* Classroom Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Lớp học <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.class_id}
              onChange={(e) => handleInputChange('class_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.class_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value=''>Chọn lớp học</option>
              {classrooms.map((classroom) => (
                <option
                  key={classroom.id}
                  value={classroom.id}
                >
                  {classroom.class_name} - {classroom.teacher?.name || 'N/A'}
                </option>
              ))}
            </select>
            {errors.class_id && (
              <p className='text-red-500 text-sm mt-1'>{errors.class_id}</p>
            )}
          </div>

          {/* Weekday Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Ngày trong tuần <span className='text-red-500'>*</span>
            </label>
            <select
              value={formData.weekday}
              onChange={(e) => handleInputChange('weekday', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                errors.weekday ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {weekdays.map((day) => (
                <option
                  key={day.value}
                  value={day.value}
                >
                  {day.label}
                </option>
              ))}
            </select>
            {errors.weekday && (
              <p className='text-red-500 text-sm mt-1'>{errors.weekday}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Khung giờ <span className='text-red-500'>*</span>
            </label>
            <div className='grid grid-cols-2 gap-2'>
              {timeSlots.map((slot) => (
                <button
                  key={`${slot.start}-${slot.end}`}
                  type='button'
                  onClick={() => handleTimeSlotChange(slot)}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    formData.start_time === slot.start &&
                    formData.end_time === slot.end
                      ? 'bg-cyan-100 border-cyan-300 text-cyan-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Clock
                    size={14}
                    className='inline mr-1'
                  />
                  {slot.start} - {slot.end}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-end gap-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white rounded-lg transition-colors flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Tạo lịch học
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
