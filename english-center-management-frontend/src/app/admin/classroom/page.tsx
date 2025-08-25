'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Search,
} from 'lucide-react';
import { useClassroomApi } from '../_hooks';
import { CreateClassroomModal, EditClassroomModal } from './_components';
import { ClassroomResponse } from '../../../types/admin';
import { levels } from '../course/_components/create-course';
import { toast } from 'react-toastify';

const ClassManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomResponse | null>(null);

  const {
    loading,
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
      case 'A2 - Sơ cấp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B1 - Trung cấp thấp':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B2 - Trung cấp cao':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'C1 - Nâng cao':
        return 'bg-blue-50 text-blue-700 border-blue-200';
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
      toast.success('Lớp học mới đã được tạo thành công!');
    } catch (err) {
      console.error('Failed to create classroom:', err);
      toast.error('Có lỗi xảy ra khi tạo lớp học mới!');
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
  const getStatusDisplayInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Đang hoạt động',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'completed':
        return {
          text: 'Đã hoàn thành',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'cancelled':
        return {
          text: 'Đã huỷ',
          className: 'bg-red-50 text-red-700 border-red-200',
        };
      default:
        return {
          text: 'Không xác định',
          className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
  };
  // Filter classrooms based on search term
  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classroom.course?.course_name &&
        classroom.course.course_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (classroom.teacher?.name &&
        classroom.teacher.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (loading && classrooms.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2
            className='animate-spin'
            size={24}
          />
          <span className='text-gray-600'>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900 mb-1'>
            Quản lý lớp học
          </h1>
          <p className='text-gray-600'>
            Quản lý và tổ chức tất cả các lớp học trong hệ thống đào tạo Zenlish
          </p>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Tổng lớp học
                </p>
                <p className='text-3xl font-bold text-gray-900'>
                  {filteredClassrooms.length}
                </p>
              </div>
              <div className='p-3 bg-blue-100 rounded-xl'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Đang hoạt động
                </p>
                <p className='text-3xl font-bold text-green-600'>
                  {
                    filteredClassrooms.filter(
                      (classroom) => classroom.status === 'active'
                    ).length
                  }
                </p>
              </div>
              <div className='p-3 bg-green-100 rounded-xl'>
                <BarChart3 className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Đã hoàn thành
                </p>
                <p className='text-3xl font-bold text-purple-600'>
                  {
                    filteredClassrooms.filter(
                      (classroom) => classroom.status === 'completed'
                    ).length
                  }
                </p>
              </div>
              <div className='p-3 bg-purple-100 rounded-xl'>
                <Calendar className='w-6 h-6 text-purple-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Tổng học viên
                </p>
                <p className='text-3xl font-bold text-orange-600'>
                  {filteredClassrooms.reduce(
                    (total, classroom) =>
                      total + (classroom.enrollments?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className='p-3 bg-orange-100 rounded-xl'>
                <Users className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            {/* Search */}
            <div className='flex-1 relative'>
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                size={20}
              />
              <input
                type='text'
                placeholder='Tìm kiếm lớp học theo tên, khóa học hoặc giáo viên...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            {/* Add Class Button */}
            <button
              onClick={handleAddClass}
              disabled={loading}
              className='px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium'
            >
              {loading ? (
                <Loader2
                  className='animate-spin'
                  size={16}
                />
              ) : (
                <Plus size={16} />
              )}
              Thêm lớp học
            </button>
          </div>
        </div>

        {/* Classes Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
          {/* Table Header */}
          <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
            <div className='grid grid-cols-12 gap-4 text-sm font-medium text-gray-500'>
              <div className='col-span-2'>Tên lớp</div>
              <div className='col-span-2'>Cấp độ</div>
              <div className='col-span-2'>Giáo viên phụ trách</div>
              <div className='col-span-1'>Học viên</div>
              <div className='col-span-2'>Trạng thái</div>
              <div className='col-span-2'>Thời gian học</div>
              <div className='col-span-1'>Thao tác</div>
            </div>
          </div>

          {/* Table Body */}
          <div className='divide-y divide-gray-200'>
            {filteredClassrooms.length === 0 ? (
              <div className='px-6 py-12 text-center'>
                <BookOpen className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Không tìm thấy lớp học
                </h3>
                <p className='text-gray-600 mb-6'>
                  {searchTerm
                    ? 'Thử thay đổi từ khóa tìm kiếm'
                    : 'Bắt đầu bằng cách thêm lớp học mới'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleAddClass}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
                  >
                    Thêm lớp học đầu tiên
                  </button>
                )}
              </div>
            ) : (
              filteredClassrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className='px-6 py-4 hover:bg-gray-50 transition-colors duration-150'
                >
                  <div className='grid grid-cols-12 gap-4 items-center'>
                    {/* Class Name */}
                    <div className='col-span-2'>
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
                          ? levels.find(
                              (v) => v.value === classroom.course.level
                            )?.label
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
                    {/* Status */}
                    <div className='col-span-2'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getStatusDisplayInfo(classroom.status).className
                        }`}
                      >
                        {getStatusDisplayInfo(classroom.status).text}
                      </span>
                    </div>

                    {/* Schedule */}
                    <div className='col-span-2'>
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
              ))
            )}
          </div>
        </div>

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
    </>
  );
};

export default ClassManagement;
