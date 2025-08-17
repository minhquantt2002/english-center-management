'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Save,
  Plus,
} from 'lucide-react';
import { useStaffCourseApi, useStaffTeacherApi } from '../../_hooks';
import {
  ClassroomCreate,
  CourseLevel,
  CourseResponse,
  TeacherResponse,
} from '../../../../types/staff';

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: Partial<ClassroomCreate>) => void;
}

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ClassroomCreate>({
    class_name: '',
    course_id: '',
    teacher_id: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const { getCourses } = useStaffCourseApi();
  const [schedules, setSchedules] = useState([
    { weekday: '', start_time: '', end_time: '' },
  ]);
  const [scheduleErrors, setScheduleErrors] = useState<string[]>([]);
  const { getTeachers } = useStaffTeacherApi();

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersData, coursesData] = await Promise.all([
          getTeachers(),
          getCourses(),
        ]);
        setTeachers(teachersData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, getTeachers, getCourses]);

  const handleInputChange = (
    field: keyof ClassroomCreate,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleScheduleChange = (idx: number, field: string, value: string) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
    // Clear error for this schedule
    setScheduleErrors((prev) => {
      const newErrs = [...prev];
      newErrs[idx] = '';
      return newErrs;
    });
  };

  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { weekday: '', start_time: '', end_time: '' },
    ]);
    setScheduleErrors((prev) => [...prev, '']);
  };

  const handleRemoveSchedule = (idx: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== idx));
    setScheduleErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!formData.class_name.trim()) {
      newErrors.class_name = 'Tên lớp không được để trống';
    }

    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Vui lòng chọn giáo viên';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Vui lòng chọn thời gian học';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'Vui lòng chọn phòng học';
    }

    // Validate schedules
    const newScheduleErrors: string[] = [];
    schedules.forEach((sch, idx) => {
      if (!sch.weekday || !sch.start_time || !sch.end_time) {
        newScheduleErrors[idx] = 'Vui lòng chọn đủ thông tin cho lịch học';
        valid = false;
      } else {
        newScheduleErrors[idx] = '';
      }
    });
    setScheduleErrors(newScheduleErrors);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const classData: Partial<ClassroomCreate> & { schedules: any[] } = {
      class_name: formData.class_name,
      course_id: formData.course_id,
      teacher_id: formData.teacher_id,
      status: formData.status,
      room: formData.room,
      start_date: formData.start_date,
      end_date: formData.end_date,
      schedules: schedules.map((sch) => ({
        weekday: sch.weekday,
        start_time: sch.start_time,
        end_time: sch.end_time,
      })),
    };

    onSubmit(classData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      class_name: '',
      course_id: '',
      teacher_id: '',
      status: 'active',
    });
    setErrors({});
    setSchedules([{ weekday: '', start_time: '', end_time: '' }]);
    setScheduleErrors([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]'>
      <div className='bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-cyan-50 px-6 py-4 rounded-t-2xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-cyan-500 p-2 rounded-lg'>
                <Plus className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-xl font-bold text-cyan-700'>
                Tạo lớp học mới
              </h2>
            </div>
            <button
              onClick={handleClose}
              className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Class Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <BookOpen className='w-4 h-4 inline mr-2' />
                Tên lớp học *
              </label>
              <input
                type='text'
                value={formData.class_name}
                onChange={(e) =>
                  handleInputChange('class_name', e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.class_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Ví dụ: Tiếng Anh Cơ Bản A1'
              />
              {errors.class_name && (
                <p className='text-red-500 text-sm mt-1'>{errors.class_name}</p>
              )}
            </div>

            {/* Room */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 inline mr-2' />
                Phòng học *
              </label>
              <input
                type='text'
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.room ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Ví dụ: Tiếng Anh Cơ Bản A1'
              />
              {errors.room && (
                <p className='text-red-500 text-sm mt-1'>{errors.room}</p>
              )}
            </div>

            {/* Course Level */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Users className='w-4 h-4 inline mr-2' />
                Trình độ
              </label>
              <select
                value={formData.course_id}
                onChange={(e) =>
                  handleInputChange('course_id', e.target.value as CourseLevel)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                <option value='A1'>A1 - Mất gốc</option>
                <option value='A2'>A2 - Sơ cấp</option>
                <option value='B1'>B1 - Trung cấp thấp</option>
                <option value='B2'>B2 - Trung cấp cao</option>
                <option value='C1'>C1 - Nâng cao</option>
              </select>
            </div>

            {/* Teacher */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <User className='w-4 h-4 inline mr-2' />
                Giáo viên phụ trách *
              </label>
              <select
                value={formData.teacher_id}
                onChange={(e) =>
                  handleInputChange('teacher_id', e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.teacher_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value=''>Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className='text-red-500 text-sm mt-1'>{errors.teacher_id}</p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <BookOpen className='w-4 h-4 inline mr-2' />
                Khóa học
              </label>
              <select
                value={formData.course_id}
                onChange={(e) => handleInputChange('course_id', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                <option value=''>Chọn khóa học (tùy chọn)</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleInputChange(
                    'status',
                    e.target.value as 'active' | 'inactive'
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                <option value='active'>Đang hoạt động</option>
                <option value='inactive'>Tạm ngưng</option>
              </select>
            </div>
          </div>

          {/* Schedule Information */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <Calendar className='w-5 h-5 mr-2' />
              Lịch học
            </h3>
            <div className='space-y-4'>
              {schedules.map((sch, idx) => (
                <div
                  key={idx}
                  className='grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-4 rounded-lg relative bg-gray-50'
                >
                  {/* Weekday */}
                  <div className='md:col-span-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Thứ *
                    </label>
                    <select
                      value={sch.weekday}
                      onChange={(e) =>
                        handleScheduleChange(idx, 'weekday', e.target.value)
                      }
                      className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                    >
                      <option value=''>Chọn thứ</option>
                      <option value='monday'>Thứ Hai</option>
                      <option value='tuesday'>Thứ Ba</option>
                      <option value='wednesday'>Thứ Tư</option>
                      <option value='thursday'>Thứ Năm</option>
                      <option value='friday'>Thứ Sáu</option>
                      <option value='saturday'>Thứ Bảy</option>
                      <option value='sunday'>Chủ Nhật</option>
                    </select>
                  </div>
                  {/* Start time */}
                  <div className='md:col-span-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Giờ bắt đầu *
                    </label>
                    <input
                      type='time'
                      value={sch.start_time}
                      onChange={(e) =>
                        handleScheduleChange(idx, 'start_time', e.target.value)
                      }
                      className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                    />
                  </div>
                  {/* End time */}
                  <div className='md:col-span-4'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Giờ kết thúc *
                    </label>
                    <input
                      type='time'
                      value={sch.end_time}
                      onChange={(e) =>
                        handleScheduleChange(idx, 'end_time', e.target.value)
                      }
                      className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                    />
                  </div>
                  {/* Remove button */}
                  <div className='flex items-center justify-end md:col-span-12'>
                    {schedules.length > 1 && (
                      <button
                        type='button'
                        onClick={() => handleRemoveSchedule(idx)}
                        className='text-red-500 hover:text-red-700 px-2 py-1 rounded-lg border border-red-200 bg-white ml-2'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                  {/* Error message */}
                  {scheduleErrors[idx] && (
                    <div className='col-span-12 text-red-500 text-sm mt-1'>
                      {scheduleErrors[idx]}
                    </div>
                  )}
                </div>
              ))}
              <button
                type='button'
                onClick={handleAddSchedule}
                className='mt-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg flex items-center hover:bg-cyan-200'
              >
                <Plus className='w-4 h-4 mr-1' /> Thêm lịch học
              </button>
            </div>
          </div>

          {/* Date Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
            {/* Start Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày bắt đầu *
              </label>
              <input
                type='date'
                value={formData.start_date || ''}
                onChange={(e) =>
                  handleInputChange('start_date', e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.start_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.start_date && (
                <p className='text-red-500 text-sm mt-1'>{errors.start_date}</p>
              )}
            </div>
            {/* End Date */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Ngày kết thúc *
              </label>
              <input
                type='date'
                value={formData.end_date || ''}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.end_date ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.end_date && (
                <p className='text-red-500 text-sm mt-1'>{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='border-t pt-6 flex justify-end space-x-3'>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center space-x-2 transition-colors'
            >
              <Save className='w-4 h-4' />
              <span>Tạo lớp học</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassroomModal;
