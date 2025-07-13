'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { useClassroomApi } from './_hooks/use-api';

interface Classroom {
  id: string;
  name: string;
  level: string;
  teacher: {
    name: string;
    avatar: string;
  };
  students: number;
  schedule: {
    days: string;
    time: string;
  };
}

const ClassManagement: React.FC = () => {
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [teacherFilter, setTeacherFilter] = useState('All Teachers');
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );

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
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data);
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
    }
  };

  const getLevel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Sơ cấp';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Cao cấp';
      case 'upper-intermediate':
        return 'Cao cấp';
      default:
        return 'Sơ cấp';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Sơ cấp':
        return 'bg-green-100 text-green-700';
      case 'Trung cấp':
        return 'bg-blue-100 text-blue-700';
      case 'Cao cấp':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddClass = () => {
    setShowCreateModal(true);
  };

  const handleEditClass = (classroom: Classroom) => {
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
    } catch (err) {
      console.error('Failed to create classroom:', err);
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

  // Filter classrooms based on selected filters
  const filteredClassrooms = classrooms.filter((classroom) => {
    const levelMatch =
      levelFilter === 'All Levels' || classroom.level === levelFilter;
    const teacherMatch =
      teacherFilter === 'All Teachers' ||
      classroom.teacher.name === teacherFilter;
    return levelMatch && teacherMatch;
  });

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
          <div className='flex flex-col sm:flex-row gap-4'>
            {/* Level Filter */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Lọc theo cấp độ
              </label>
              <div className='relative'>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]'
                >
                  <option>Tất cả cấp độ</option>
                  <option>Sơ cấp</option>
                  <option>Trung cấp</option>
                  <option>Cao cấp</option>
                </select>
                <ChevronDown
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
              </div>
            </div>

            {/* Teacher Filter */}
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Lọc theo giáo viên
              </label>
              <div className='relative'>
                <select
                  value={teacherFilter}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]'
                >
                  <option>Tất cả giáo viên</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                  <option>Emma Wilson</option>
                </select>
                <ChevronDown
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400'
                  size={16}
                />
              </div>
            </div>
          </div>

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
              <div className='col-span-3'>Lịch học</div>
              <div className='col-span-1'>Thao tác</div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-200'>
            {filteredClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className='px-6 py-4 hover:bg-gray-50 transition-colors duration-150'
              >
                <div className='grid grid-cols-12 gap-4 items-center'>
                  {/* Class Name */}
                  <div className='col-span-3'>
                    <p className='font-medium text-gray-900'>
                      {classroom.name}
                    </p>
                  </div>

                  {/* Level */}
                  <div className='col-span-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(
                        classroom.level || ''
                      )}`}
                    >
                      {classroom.level}
                    </span>
                  </div>

                  {/* Assigned Teacher */}
                  <div className='col-span-2'>
                    <div className='flex items-center gap-2'>
                      <img
                        src={classroom.teacher.avatar}
                        alt={classroom.teacher.name}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                      <span className='text-gray-700'>
                        {classroom.teacher.name}
                      </span>
                    </div>
                  </div>

                  {/* Students */}
                  <div className='col-span-1'>
                    <span className='text-gray-900 font-medium'>
                      {classroom.students}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className='col-span-3'>
                    <div className='text-sm'>
                      <p className='text-gray-900 font-medium'>
                        {classroom.schedule.days}
                      </p>
                      <p className='text-gray-500'>{classroom.schedule.time}</p>
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
        {filteredClassrooms.length === 0 && !loading && (
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

        {/* Create Modal Placeholder */}
        {showCreateModal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Tạo lớp học mới</h2>
              <p className='text-gray-600 mb-4'>
                Modal tạo lớp học sẽ được implement ở đây
              </p>
              <div className='flex gap-2 justify-end'>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal Placeholder */}
        {showEditModal && selectedClassroom && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 w-full max-w-md'>
              <h2 className='text-xl font-bold mb-4'>Sửa lớp học</h2>
              <p className='text-gray-600 mb-4'>
                Modal sửa lớp học sẽ được implement ở đây
              </p>
              <div className='flex gap-2 justify-end'>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClassroom(null);
                  }}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClassroom(null);
                  }}
                  className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;
