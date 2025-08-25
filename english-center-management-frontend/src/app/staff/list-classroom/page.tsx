'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  User,
  Edit,
  UserPlus,
  Plus,
  Users,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import EditClassroomModal from './_components/edit-classroom';
import CreateClassroomModal from './_components/create-classroom';
import AssignStudentModal from './_components/assign-student';
import { useStaffClassroomApi } from '../_hooks';
import { ClassroomCreate, ClassroomResponse } from '../../../types/staff';
import { toast } from 'react-toastify';
import { formatDays } from './[id]/page';

export default function EnglishCourseInterface() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomResponse | null>(null);
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { getClassrooms, createClassroom, updateClassroom } =
    useStaffClassroomApi();

  // Fetch classrooms on component mount
  useEffect(() => {
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
      setIsLoading(false);
    }
  };

  // Use classrooms data from API
  const courses = classrooms.map((classItem: ClassroomResponse) => {
    return {
      id: classItem.id,
      name: classItem.class_name || 'Lớp học',
      level: classItem.course?.level || 'Chưa xác định',
      status: classItem.status,
      statusText:
        classItem.status === 'active'
          ? 'Đang hoạt động'
          : classItem.status === 'completed'
          ? 'Đã hoàn thành'
          : 'Đã huỷ',
      day:
        classItem.schedules.length > 0
          ? formatDays(classItem.schedules.map((schedule) => schedule.weekday))
          : 'Chưa có lịch học',
      instructor: classItem.teacher.name,
      room: classItem.room || 'Phòng A101',
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 font-semibold';
      case 'completed':
        return 'bg-green-100 text-green-800 font-semibold';
      case 'cancelled':
        return 'bg-red-100 text-red-800 font-semibold';
      default:
        return 'bg-gray-100 text-gray-800 font-semibold';
    }
  };

  const handleEditClassroom = (classroom: ClassroomResponse) => {
    setSelectedClassroom(classroom);
    setIsEditModalOpen(true);
  };

  const handleSaveClassroom = async (updatedClassroom: ClassroomResponse) => {
    try {
      await updateClassroom(updatedClassroom.id, updatedClassroom);
      setIsEditModalOpen(false);
      setSelectedClassroom(null);
      await fetchClassrooms(); // Refresh the list
      toast.success('Thông tin lớp học đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating classroom:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin lớp học!');
    }
  };

  const handleCreateClassroom = async (classData: ClassroomCreate) => {
    try {
      await createClassroom(classData);
      setIsCreateModalOpen(false);
      await fetchClassrooms(); // Refresh the list
      toast.success('Lớp học mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast.error('Có lỗi xảy ra khi tạo lớp học mới!');
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='text-gray-600'>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full w-full'>
      <main className='mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Danh sách lớp học
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors'
          >
            <Plus className='w-4 h-4' />
            Tạo lớp mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Tổng số lớp</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {classrooms.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-cyan-600' />
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Đang hoạt động
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {classrooms.filter((c) => c.status === 'active').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <PlayCircle className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Đã hoàn thành
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {classrooms.filter((c) => c.status === 'completed').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <CheckCircle2 className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Đã hủy</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {classrooms.filter((c) => c.status === 'cancelled').length}
                </p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                <XCircle className='w-6 h-6 text-red-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {courses
            .slice((currentPage - 1) * 6, currentPage * 6)
            .map((course) => (
              <div
                key={course.id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
              >
                {/* Card Header */}
                <div className='p-6 pb-4'>
                  <div className='flex items-center space-x-1.5 mb-3'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {course.name}
                      </h3>
                      <p className='text-sm text-gray-500 mt-1'>
                        Cấp độ: {course.level}
                      </p>
                    </div>
                    <div
                      className={`p-2 font-medium text-center rounded-full text-xs ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {course.statusText}
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <Calendar className='w-4 h-4' />
                      <span>{course.day}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <User className='w-4 h-4' />
                      <span>{course.instructor}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-600'>
                      <MapPin className='w-4 h-4' />
                      <span>{course.room}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className='px-6 py-4 bg-gray-50 border-t'>
                  <button
                    onClick={() =>
                      router.push(`/staff/list-classroom/${course.id}`)
                    }
                    className='w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-medium transition-colors'
                  >
                    Xem chi tiết lớp
                  </button>
                  <div className='flex justify-between mt-3 text-xs text-gray-500'>
                    <button
                      onClick={() => {
                        const originalClassroom = classrooms.find(
                          (cls) => cls.id === course.id
                        );
                        if (originalClassroom) {
                          setSelectedClassroom(originalClassroom);
                          setIsAssignModalOpen(true);
                        }
                      }}
                      className='text-cyan-600 hover:text-cyan-800 transition-colors flex items-center space-x-1'
                    >
                      <UserPlus className='w-3 h-3' />
                      <span>Thêm học viên</span>
                    </button>
                    <button
                      onClick={() => {
                        const originalClassroom = classrooms.find(
                          (cls) => cls.id === course.id
                        );
                        if (originalClassroom) {
                          handleEditClassroom(originalClassroom);
                        }
                      }}
                      className='text-cyan-600 hover:text-cyan-800 transition-colors flex items-center space-x-1'
                    >
                      <Edit className='w-3 h-3' />
                      <span>Chỉnh sửa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination Controls */}
        {courses.length > 6 && (
          <div className='flex justify-center items-center mt-8'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='px-4 py-2 mx-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Trước
            </button>
            <span className='px-4 py-2 mx-1'>
              Trang {currentPage} / {Math.ceil(courses.length / 6)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(courses.length / 6))
                )
              }
              disabled={currentPage >= Math.ceil(courses.length / 6)}
              className='px-4 py-2 mx-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Sau
            </button>
          </div>
        )}
      </main>

      {/* Create Classroom Modal */}
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateClassroom}
      />

      {/* Edit Classroom Modal */}
      {selectedClassroom && (
        <EditClassroomModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClassroom(null);
          }}
          classroom={selectedClassroom}
          onSave={handleSaveClassroom}
        />
      )}

      {/* Assign Student Modal */}
      <AssignStudentModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedClassroom(null);
        }}
        classroom={selectedClassroom}
      />
    </div>
  );
}
