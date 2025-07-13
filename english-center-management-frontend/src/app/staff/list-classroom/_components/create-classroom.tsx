'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  MapPin,
  Calendar,
  User,
  BookOpen,
  Clock,
  Save,
  Plus,
} from 'lucide-react';
import { ClassData, CourseLevel } from '../../../../types';
import { useStaffApi } from '../../_hooks/use-api';

interface CreateClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: Partial<ClassData>) => void;
}

interface FormData {
  name: string;
  level: CourseLevel;
  teacherId: string;
  teacherName: string;
  maxStudents: number;
  scheduleDays: string;
  scheduleTime: string;
  room: string;
  courseId: string;
  status: 'active' | 'inactive';
}

const CreateClassroomModal: React.FC<CreateClassroomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    level: 'beginner',
    teacherId: '',
    teacherName: '',
    maxStudents: 20,
    scheduleDays: '',
    scheduleTime: '',
    room: '',
    courseId: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getTeachers, getRooms, getCourses } = useStaffApi();

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teachersData, roomsData, coursesData] = await Promise.all([
          getTeachers(),
          getRooms(),
          getCourses(),
        ]);
        setTeachers(teachersData);
        setRooms(roomsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, getTeachers, getRooms, getCourses]);

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

  const handleInputChange = (field: keyof FormData, value: string | number) => {
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên lớp không được để trống';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Vui lòng chọn giáo viên';
    }

    if (!formData.scheduleDays.trim()) {
      newErrors.scheduleDays = 'Vui lòng chọn ngày học';
    }

    if (!formData.scheduleTime) {
      newErrors.scheduleTime = 'Vui lòng chọn thời gian học';
    }

    if (!formData.room) {
      newErrors.room = 'Vui lòng chọn phòng học';
    }

    if (formData.maxStudents < 1) {
      newErrors.maxStudents = 'Số học viên tối đa phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);

    const classData: Partial<ClassData> = {
      name: formData.name,
      level: formData.level,
      teacher: {
        id: formData.teacherId,
        name: selectedTeacher?.name || '',
      },
      students: 0,
      maxStudents: formData.maxStudents,
      schedule: {
        days: formData.scheduleDays,
        time: formData.scheduleTime,
      },
      room: formData.room,
      courseId: formData.courseId,
      status: formData.status,
    };

    onSubmit(classData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      level: 'beginner',
      teacherId: '',
      teacherName: '',
      maxStudents: 20,
      scheduleDays: '',
      scheduleTime: '',
      room: '',
      courseId: '',
      status: 'active',
    });
    setErrors({});
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
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Ví dụ: Tiếng Anh Cơ Bản A1'
              />
              {errors.name && (
                <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
              )}
            </div>

            {/* Course Level */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Users className='w-4 h-4 inline mr-2' />
                Trình độ
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  handleInputChange('level', e.target.value as CourseLevel)
                }
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
                <User className='w-4 h-4 inline mr-2' />
                Giáo viên phụ trách *
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => handleInputChange('teacherId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.teacherId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value=''>Chọn giáo viên</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className='text-red-500 text-sm mt-1'>{errors.teacherId}</p>
              )}
            </div>

            {/* Max Students */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <Users className='w-4 h-4 inline mr-2' />
                Số học viên tối đa
              </label>
              <input
                type='number'
                min='1'
                value={formData.maxStudents}
                onChange={(e) =>
                  handleInputChange(
                    'maxStudents',
                    parseInt(e.target.value) || 0
                  )
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.maxStudents ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.maxStudents && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.maxStudents}
                </p>
              )}
            </div>
          </div>

          {/* Schedule Information */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <Calendar className='w-5 h-5 mr-2' />
              Lịch học
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Schedule Days */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Ngày học trong tuần *
                </label>
                <input
                  type='text'
                  value={formData.scheduleDays}
                  onChange={(e) =>
                    handleInputChange('scheduleDays', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.scheduleDays ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Ví dụ: Mon, Wed, Fri'
                />
                {errors.scheduleDays && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.scheduleDays}
                  </p>
                )}
              </div>

              {/* Schedule Time */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Clock className='w-4 h-4 inline mr-2' />
                  Thời gian học *
                </label>
                <select
                  value={formData.scheduleTime}
                  onChange={(e) =>
                    handleInputChange('scheduleTime', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.scheduleTime ? 'border-red-300' : 'border-gray-300'
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
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.scheduleTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location and Course */}
          <div className='border-t pt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
              <MapPin className='w-5 h-5 mr-2' />
              Thông tin khác
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Room */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <MapPin className='w-4 h-4 inline mr-2' />
                  Phòng học *
                </label>
                <select
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.room ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value=''>Chọn phòng học</option>
                  {rooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                {errors.room && (
                  <p className='text-red-500 text-sm mt-1'>{errors.room}</p>
                )}
              </div>

              {/* Course */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <BookOpen className='w-4 h-4 inline mr-2' />
                  Khóa học
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) =>
                    handleInputChange('courseId', e.target.value)
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
                >
                  <option value=''>Chọn khóa học (tùy chọn)</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
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
