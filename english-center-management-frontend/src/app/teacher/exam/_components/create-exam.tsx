import React, { useEffect, useState } from 'react';
import { X, Clock, BookOpen, Users } from 'lucide-react';
import { ExamCreate, useExam } from '../../_hooks/use-exam';
import { useTeacherApi } from '../../_hooks/use-api';
import { toast } from 'react-toastify';

interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

const ExamCreateModal: React.FC<ExamCreateModalProps> = ({
  isOpen,
  onClose,
  refetch,
}) => {
  const { createExam } = useExam();
  const { getClassrooms } = useTeacherApi();
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const data = await getClassrooms();
      setClassrooms(data);
    };

    fetchClassrooms();
  }, [getClassrooms]);

  const [formData, setFormData] = useState<ExamCreate>({
    exam_name: '',
    description: '',
    class_id: '',
    start_time: '',
    duration: 60,
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const finalValue = name === 'duration' ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name as keyof ExamCreate]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.exam_name.trim()) {
      newErrors.exam_name = 'Tên exam là bắt buộc';
    } else if (formData.exam_name.length > 255) {
      newErrors.exam_name = 'Tên exam không được vượt quá 255 ký tự';
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = 'Mô tả không được vượt quá 255 ký tự';
    }

    if (!formData.class_id) {
      newErrors.class_id = 'Vui lòng chọn lớp học';
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Thời gian bắt đầu là bắt buộc';
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Thời lượng phải lớn hơn 0';
    } else if (formData.duration > 600) {
      newErrors.duration = 'Thời lượng không được vượt quá 600 phút';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // onSubmit(formData);
      try {
        await createExam(formData);
        toast.success('Tạo bài thi thành công!');
        handleClose();
        refetch();
      } catch (error) {
        console.error('Error creating exam:', error);
        toast.error(error.message || 'Đã xảy ra lỗi khi tạo bài thi!');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      exam_name: '',
      description: '',
      class_id: '',
      start_time: '',
      duration: 60,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div
        className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className='flex min-h-full items-center justify-center p-4'>
        <div className='relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
            <h3 className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
              <BookOpen className='h-5 w-5 text-blue-600' />
              Tạo mới bài thi
            </h3>
            <button
              onClick={handleClose}
              className='rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <div className='px-6 py-4'>
            <div className='space-y-4'>
              {/* Tên Exam - Full width */}
              <div className='col-span-2'>
                <label
                  htmlFor='exam_name'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Tên bài thi <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='exam_name'
                  name='exam_name'
                  value={formData.exam_name}
                  onChange={handleInputChange}
                  className={`w-full h-[42px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.exam_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập tên bài thi...'
                  maxLength={255}
                />
                {errors.exam_name && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.exam_name}
                  </p>
                )}
              </div>

              {/* Lớp học */}
              <div>
                <label
                  htmlFor='class_id'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Lớp học <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <select
                    id='class_id'
                    name='class_id'
                    value={formData.class_id}
                    onChange={handleInputChange}
                    className={`w-full h-[42px] pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.class_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value=''>Chọn lớp học</option>
                    {classrooms.map((cls) => (
                      <option
                        key={cls.id}
                        value={cls.id}
                      >
                        {cls.class_name} - {cls.room}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.class_id && (
                  <p className='mt-1 text-sm text-red-600'>{errors.class_id}</p>
                )}
              </div>

              {/* Grid 2 cột */}
              <div className='grid grid-cols-2 gap-4'>
                {/* Thời lượng */}
                <div>
                  <label
                    htmlFor='duration'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Thời lượng (phút) <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <Clock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <input
                      type='number'
                      id='duration'
                      name='duration'
                      min='1'
                      max='600'
                      value={formData.duration}
                      onChange={handleInputChange}
                      className={`w-full h-[42px] pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='60'
                    />
                  </div>
                  {errors.duration && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.duration}
                    </p>
                  )}
                </div>

                {/* Thời gian bắt đầu */}
                <div>
                  <label
                    htmlFor='start_time'
                    className='block text-sm font-medium text-gray-700 mb-1'
                  >
                    Thời gian bắt đầu <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type='datetime-local'
                      id='start_time'
                      name='start_time'
                      value={formData.start_time}
                      onChange={handleInputChange}
                      className={`w-full h-[42px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.start_time ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.start_time && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.start_time}
                    </p>
                  )}
                </div>
              </div>

              {/* Mô tả - Full width */}
              <div>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Mô tả
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Nhập mô tả bài thi (tùy chọn)...'
                  maxLength={255}
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex justify-end gap-3 border-t border-gray-200 px-6 py-4'>
            <button
              type='button'
              onClick={handleClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Tạo bài thi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreateModal;
