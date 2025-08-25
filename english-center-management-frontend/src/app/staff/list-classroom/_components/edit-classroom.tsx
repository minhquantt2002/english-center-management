'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  User,
  BookOpen,
  Save,
  Edit as EditIcon,
} from 'lucide-react';
import { useStaffTeacherApi } from '../../_hooks';
import {
  ClassroomResponse,
  ClassroomUpdate,
  TeacherResponse,
} from '../../../../types/staff';

interface EditClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomResponse;
  onSave: (updatedClassroom: Partial<ClassroomUpdate>) => void;
}

const EditClassroomModal: React.FC<EditClassroomModalProps> = ({
  isOpen,
  onClose,
  classroom,
  onSave,
}) => {
  const [formData, setFormData] = useState<ClassroomUpdate>({
    class_name: '',
    course_id: '',
    teacher_id: '',
    status: 'active',
    start_date: '',
    end_date: '',
    room: '',
  });
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
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, getTeachers]);

  // Map classroom data to state
  useEffect(() => {
    if (classroom) {
      setFormData({
        class_name: classroom.class_name || '',
        course_id: classroom.course_id || '',
        teacher_id: classroom.teacher_id || '',
        status: classroom.status || 'active',
        start_date: classroom.start_date || '',
        end_date: classroom.end_date || '',
        room: classroom.room || '',
      });
    }
  }, [classroom]);

  const handleInputChange = (
    field: keyof ClassroomUpdate,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    let valid = true;
    if (!formData.class_name.trim()) {
      newErrors.class_name = 'Tên lớp không được để trống';
    }
    if (!formData.teacher_id) {
      newErrors.teacher_id = 'Vui lòng chọn giáo viên';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Vui lòng chọn ngày bắt đầu';
    }
    if (!formData.end_date) {
      newErrors.end_date = 'Vui lòng chọn ngày kết thúc';
    }
    if (!formData.room) {
      newErrors.room = 'Vui lòng chọn phòng học';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedClassroom: Partial<ClassroomUpdate> & {
      id: string;
    } = {
      ...formData,
      room: formData.room,
      status: formData.status,
      teacher_id: formData.teacher_id,
      course_id: formData.course_id,
      class_name: formData.class_name,
      id: classroom.id,
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]'>
      <div className='bg-white rounded-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='bg-cyan-50 px-6 py-4 rounded-t-2xl'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-cyan-500 p-2 rounded-lg'>
                <EditIcon className='w-5 h-5 text-white' />
              </div>
              <h2 className='text-xl font-bold text-cyan-700'>
                Chỉnh sửa lớp học
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
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-6'
        >
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
                placeholder='Nhập tên phòng học'
              />
              {errors.room && (
                <p className='text-red-500 text-sm mt-1'>{errors.room}</p>
              )}
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
                  <option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className='text-red-500 text-sm mt-1'>{errors.teacher_id}</p>
              )}
            </div>
            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              >
                <option value='active'>Đang hoạt động</option>
                <option value='completed'>Đã hoàn thành</option>
                <option value='cancelled'>Đã huỷ</option>
              </select>
            </div>

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
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassroomModal;
