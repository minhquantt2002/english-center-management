'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useClassroomApi } from '../_hooks';
import { CreateClassroomModal, EditClassroomModal } from './_components';
import { ClassroomResponse } from '../../../types/admin';
import { levels } from '../course/_components/create-course';

const ClassManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomResponse | null>(null);

  const {
    loading,
    error,
    getClassrooms,
    createClassroom,
    updateClassroom,
    deleteClassroom,
  } = useClassroomApi();

  // Fetch classrooms on component mount
  useEffect(() => {
    fetchClassrooms();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data);
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Cơ bản':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Trung cấp':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Nâng cao':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleAddClass = () => {
    setShowCreateModal(true);
  };

  const handleEditClass = (classroom: ClassroomResponse) => {
    setSelectedClassroom(classroom);
    setShowEditModal(true);
  };

  const handleDeleteClass = async (classId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await deleteClassroom(classId);
        await fetchClassrooms(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete classroom:', err);
      }
    }
  };

  const handleCreateClassroom = async (classroomData: any) => {
    try {
      await createClassroom(classroomData);
      setShowCreateModal(false);
      await fetchClassrooms(); // Refresh the list
      alert('Lớp học mới đã được tạo thành công!');
    } catch (err) {
      console.error('Failed to create classroom:', err);
      alert('Có lỗi xảy ra khi tạo lớp học mới!');
    }
  };

  const handleUpdateClassroom = async (classroomData: any) => {
    if (!selectedClassroom) return;

    try {
      await updateClassroom(selectedClassroom.id, classroomData);
      setShowEditModal(false);
      setSelectedClassroom(null);
      await fetchClassrooms(); // Refresh the list
    } catch (err) {
      console.error('Failed to update classroom:', err);
    }
  };

  if (loading && classrooms.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='animate-spin' size={24} />
          <span className='text-gray-600'>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Quản lý lớp học
          </h1>
          <p className='text-gray-600'>
            Quản lý và tổ chức tất cả các lớp học trong hệ thống đào tạo Zenlish
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-red-700'>{error}</p>
          </div>
        )}

        {/* Filters and Add Button */}
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8'>
          {/* Add Class Button */}
          <button
            onClick={handleAddClass}
            disabled={loading}
            className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium'
          >
            {loading ? (
              <Loader2 className='animate-spin' size={16} />
            ) : (
              <Plus size={16} />
            )}
            Thêm lớp học
          </button>
        </div>

        {/* Classes Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          {/* Table Header */}
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <div className='grid grid-cols-12 gap-4 text-sm font-medium text-gray-500'>
              <div className='col-span-3'>Tên lớp</div>
              <div className='col-span-2'>Cấp độ</div>
              <div className='col-span-2'>Giáo viên phụ trách</div>
              <div className='col-span-1'>Học viên</div>
              <div className='col-span-3'>Thời gian học</div>
              <div className='col-span-1'>Thao tác</div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-200'>
            {classrooms.map((classroom) => (
              <div
                key={classroom.id}
                className='px-6 py-4 hover:bg-gray-50 transition-colors duration-150'
              >
                <div className='grid grid-cols-12 gap-4 items-center'>
                  {/* Class Name */}
                  <div className='col-span-3'>
                    <p className='font-medium text-gray-900'>
                      {classroom.class_name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {classroom.course?.course_name || 'Không tồn tại'}
                    </p>
                  </div>

                  {/* Level */}
                  <div className='col-span-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(
                        classroom.course?.level
                          ? levels.find(
                              (v) => v.value === classroom.course.level
                            )?.label
                          : 'Không tồn tại'
                      )}`}
                    >
                      {classroom.course?.level
                        ? levels.find((v) => v.value === classroom.course.level)
                            ?.label
                        : 'Không tồn tại'}
                    </span>
                  </div>

                  {/* Assigned Teacher */}
                  <div className='col-span-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                        <span className='text-blue-600 font-medium text-sm'>
                          {classroom.teacher?.name?.charAt(0) ||
                            'Không tồn tại'}
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-700 font-medium'>
                          {classroom.teacher?.name || 'Không tồn tại'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Students */}
                  <div className='col-span-1'>
                    <span className='text-gray-900 font-medium'>
                      {classroom.enrollments.length}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className='col-span-3'>
                    <div className='text-sm'>
                      <p className='text-gray-900 font-medium'>
                        {formatDate(classroom.start_date)} -{' '}
                        {formatDate(classroom.end_date)}
                      </p>
                      <p className='text-gray-500'>
                        {classroom.schedules.length} buổi
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='col-span-1'>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleEditClass(classroom)}
                        disabled={loading}
                        className='p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150 disabled:opacity-50'
                        title='Sửa lớp học'
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classroom.id)}
                        disabled={loading}
                        className='p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150 disabled:opacity-50'
                        title='Xóa lớp học'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (if no classes) */}
        {classrooms.length === 0 && !loading && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center'>
            <div className='text-gray-400 mb-4'>
              <Plus size={48} className='mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy lớp học nào
            </h3>
            <p className='text-gray-500 mb-6'>
              Bắt đầu bằng cách tạo lớp học đầu tiên của bạn.
            </p>
            <button
              onClick={handleAddClass}
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors duration-200'
            >
              Thêm lớp học
            </button>
          </div>
        )}

        {/* Create Classroom Modal */}
        <CreateClassroomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClassroom}
          loading={loading}
        />

        {/* Edit Classroom Modal */}
        <EditClassroomModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClassroom(null);
          }}
          onSubmit={handleUpdateClassroom}
          classroom={selectedClassroom}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ClassManagement;
