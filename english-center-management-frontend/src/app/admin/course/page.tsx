'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  BarChart3,
  Users,
  Calendar,
  BookOpen,
} from 'lucide-react';
import {
  CourseCreate,
  CourseResponse,
  CourseUpdate,
} from '../../../types/admin';
import CreateCourseModal from './_components/create-course';
import EditCourseModal from './_components/edit-course';
import ViewCourseModal from './_components/view-course';
import { useCourseApi } from '../_hooks';
import { toast } from 'react-toastify';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  );
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const { createCourse, updateCourse, deleteCourse, getCourses } =
    useCourseApi();

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const getLevel = (level: string) => {
    switch (level) {
      case 'A1':
        return 'A1 - Mất gốc';
      case 'A2':
        return 'A2 - Sơ cấp';
      case 'B1':
        return 'B1 - Trung cấp thấp';
      case 'B2':
        return 'B2 - Trung cấp cao';
      case 'C1':
        return 'C1 - Nâng cao';
      default:
        return 'A2 - Sơ cấp';
    }
  };

  // Use courses data from API
  const coursesWithDisplay = courses.map((course: CourseResponse) => ({
    ...course,
    name: course.course_name || 'Không có tên',
    displayLevel: getLevel(course.level || 'A2'),
    displayDuration: course.total_weeks
      ? `${course.total_weeks} tuần`
      : 'Không có thông tin',
  }));

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A1 - Mất gốc':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'A2 - Sơ cấp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B1 - Trung cấp thấp':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'B2 - Trung cấp cao':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'C1 - Nâng cao':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'C2 - Thành thạo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredCourses = coursesWithDisplay.filter((course) => {
    const courseName = course.course_name || course.name || '';
    const matchesSearch = courseName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleCreateCourse = async (courseData: CourseCreate) => {
    try {
      await createCourse(courseData as CourseCreate);
      setIsCreateModalOpen(false);
      await fetchCourses(); // Refresh the list
      toast.success('Khóa học đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Có lỗi xảy ra khi tạo khóa học!');
    }
  };

  const handleViewCourse = (course: any) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCourse(null);
  };

  const handleUpdateCourse = async (
    courseId: string,
    courseData: CourseUpdate
  ) => {
    try {
      await updateCourse(courseId, courseData);
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      await fetchCourses(); // Refresh the list
      toast.success('Khóa học đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Có lỗi xảy ra khi cập nhật khóa học!');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
      try {
        await deleteCourse(courseId);
        await fetchCourses(); // Refresh the list
        toast.success('Khóa học đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Có lỗi xảy ra khi xóa khóa học!');
      }
    }
  };

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-1'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Quản lý khóa học
              </h1>
            </div>
            <p className='text-gray-600 text-lg'>
              Quản lý và tổ chức tất cả các khóa học đào tạo trong hệ thống
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium'
            >
              <Plus size={20} />
              Thêm khóa học mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Tổng khóa học
                </p>
                <p className='text-3xl font-bold text-gray-900'>
                  {courses.length}
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
                    courses.filter((course) => course.level === 'elementary')
                      .length
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
                <p className='text-sm font-medium text-gray-600'>Sắp diễn ra</p>
                <p className='text-3xl font-bold text-purple-600'>
                  {
                    courses.filter((course) => course.level === 'intermediate')
                      .length
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
                  Đã hoàn thành
                </p>
                <p className='text-3xl font-bold text-gray-600'>
                  {
                    courses.filter((course) => course.level === 'advanced')
                      .length
                  }
                </p>
              </div>
              <div className='p-3 bg-gray-100 rounded-xl'>
                <Users className='w-6 h-6 text-gray-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div className='flex flex-col sm:flex-row gap-4 flex-1'>
              {/* Search */}
              <div className='flex-1'>
                <div className='relative'>
                  <Search
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder='Tìm kiếm khóa học...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors'
                  />
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title='Chế độ bảng'
              >
                <div className='w-5 h-5 grid grid-cols-2 gap-0.5'>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title='Chế độ lưới'
              >
                <div className='w-5 h-5 grid grid-cols-3 gap-0.5'>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                  <div className='bg-current rounded-sm'></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Danh sách khóa học ({filteredCourses.length})
              </h2>
            </div>
          </div>

          {viewMode === 'table' ? (
            /* Table View */
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Khóa học
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Cấp độ
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Số lớp
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Thời lượng
                    </th>
                    <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-100'>
                  {filteredCourses.map((course) => (
                    <tr
                      key={course.id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='px-6 py-4'>
                        <div>
                          <div className='text-sm font-semibold text-gray-900'>
                            {course.course_name ||
                              course.name ||
                              'Không có tên'}
                          </div>
                          <div className='text-sm text-gray-500 mt-1'>
                            {course.description || 'Không có mô tả'}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex px-3 py-1 text-xs text-center font-semibold rounded-full border ${getLevelBadgeColor(
                            course.displayLevel
                          )}`}
                        >
                          {course.displayLevel}
                        </span>
                      </td>
                      <td className='px-6 py-4'>{course.classes.length}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>
                        {course.displayDuration}
                      </td>

                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => handleViewCourse(course)}
                            className='p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors'
                            title='Xem chi tiết'
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className='p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'
                            title='Chỉnh sửa'
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                            title='Xóa'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className='bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                          {course.course_name || course.name || 'Không có tên'}
                        </h3>
                        <p className='text-sm text-gray-600 line-clamp-2'>
                          {course.description || 'Không có mô tả'}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3 mb-4'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>Cấp độ:</span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getLevelBadgeColor(
                            course.displayLevel
                          )}`}
                        >
                          {course.displayLevel}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>
                          Thời lượng:
                        </span>
                        <span className='text-sm font-medium text-gray-900'>
                          {course.displayDuration}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center justify-center gap-2 pt-4 border-t border-gray-200'>
                      <button
                        onClick={() => handleViewCourse(course)}
                        className='flex-1 bg-green-50 text-green-700 items-center flex justify-center hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                      >
                        <Eye
                          size={14}
                          className='mr-1'
                        />
                        Xem
                      </button>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className='flex-1 bg-blue-50 text-blue-700 items-center flex justify-center hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                      >
                        <Edit
                          size={14}
                          className='mr-1'
                        />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className='flex-1 bg-red-50 text-red-700 items-center flex justify-center hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                      >
                        <Trash2
                          size={14}
                          className='mr-1'
                        />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className='p-12 text-center'>
              <BookOpen className='w-12 h-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Không tìm thấy khóa học
              </h3>
              <p className='text-gray-600 mb-6'>
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
              >
                Tạo khóa học đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />

      {/* View Course Modal */}
      <ViewCourseModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        course={selectedCourse}
      />

      {/* Edit Course Modal */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateCourse={handleUpdateCourse}
        course={selectedCourse}
      />
    </>
  );
};

export default CourseManagement;
