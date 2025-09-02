'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  GraduationCap,
  Mail,
  Phone,
  Users,
  Award,
} from 'lucide-react';
import {
  TeacherCreate,
  TeacherResponse,
  TeacherUpdate,
} from '../../../types/admin';
import CreateTeacherModal from './_components/create-teacher';
import ViewTeacherModal, {
  getSpecializationLabel,
} from './_components/view-teacher';
import EditTeacherModal from './_components/edit-teacher';
import { useTeacherApi } from '../_hooks';
import { toast } from 'react-toastify';
import GenericExcelExportButton, {
  teachersExportConfig,
} from '../../../components/GenericExcelExportButton';
import { getInitials } from '../../staff/list-teacher/page';

const TeacherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherResponse | null>(null);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);

  const { createTeacher, updateTeacher, deleteTeacher, getTeachers } =
    useTeacherApi();

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  // Use teachers data from API
  const teachersList = teachers.map((teacher: TeacherResponse) => ({
    ...teacher,
    id: teacher.id,
    name: teacher.name,
    specialization:
      getSpecializationLabel(teacher.specialization) || 'Chưa cập nhật',
    email: teacher.email,
    phone: teacher.phone_number,
    assignedClasses: teacher.taught_classes || [],
    createdAt: teacher.created_at,
    address: teacher.address,
    experience_years: teacher.experience_years || 0,
  }));

  const filteredTeachers = teachersList.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.specialization &&
        teacher.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleCreateTeacher = async (teacherData: TeacherCreate) => {
    try {
      await createTeacher(teacherData);
      setIsCreateModalOpen(false);
      await fetchTeachers(); // Refresh the list
      toast.success('Giáo viên mới đã được tạo thành công!');
    } catch (error) {
      toast.error(error.detail);
    }
  };

  const handleViewTeacher = (teacher: TeacherResponse) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleEditTeacher = (teacher: TeacherResponse) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleUpdateTeacher = async (teacherData: TeacherUpdate) => {
    if (!selectedTeacher) return;

    try {
      await updateTeacher(selectedTeacher.id, teacherData);
      setIsEditModalOpen(false);
      setSelectedTeacher(null);
      await fetchTeachers(); // Refresh the list
      toast.success('Thông tin giáo viên đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin giáo viên!');
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await deleteTeacher(teacherId);
        await fetchTeachers(); // Refresh the list
        toast.success('Giáo viên đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Có lỗi xảy ra khi xóa giáo viên!');
      }
    }
  };
  const [loading, setLoading] = useState(false);
  return (
    <>
      {/* Header */}
      <div className='mb-4'>
        <div className='flex items-center gap-4 mb-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Quản lý giáo viên
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý và tổ chức đội ngũ giảng dạy của trung tâm
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Tổng giáo viên
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {teachers.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Lớp đang dạy
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {teachers.reduce(
                    (total, t) => total + (t.taught_classes?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Tìm kiếm giáo viên theo tên hoặc chuyên môn...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
            />
          </div>
          {/* Export to Excel Button */}
          <GenericExcelExportButton
            data={filteredTeachers}
            config={teachersExportConfig}
            onExportStart={() => setLoading(true)}
            onExportComplete={() => setLoading(false)}
          />

          {/* Add Teacher Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 flex items-center space-x-2'
          >
            <Plus className='h-5 w-5' />
            <span className='font-semibold'>Thêm giáo viên</span>
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Giáo viên
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Liên hệ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Chuyên môn
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Lớp đã phân công
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % HV đi học
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % HV đạt BTVN
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % HV đạt đầu ra
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-12 w-12 flex-shrink-0'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                          {getInitials(teacher.name.charAt(0))}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {teacher.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex flex-col space-y-1'>
                      <div className='flex items-center text-sm text-gray-900'>
                        <Mail className='w-4 h-4 text-gray-400 mr-2' />
                        {teacher.email}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Phone className='w-4 h-4 text-gray-400 mr-2' />
                        {teacher.phone || 'Chưa cập nhật'}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <Award className='w-4 h-4 text-green-500 mr-2' />
                      <span className='text-sm font-medium text-gray-900'>
                        {teacher.specialization}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {teacher.assignedClasses.length > 0 ? (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                          {teacher.assignedClasses.length} lớp
                        </span>
                      ) : (
                        <span className='text-gray-500'>Chưa phân lớp</span>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {teacher.rate_attendanced}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {teacher.rate_passed_homework}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {teacher.rate_passed}%
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() =>
                          handleViewTeacher(
                            teachers.find((t) => t.id === teacher.id)!
                          )
                        }
                        className='text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors'
                        title='Xem chi tiết'
                      >
                        <Eye className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          handleEditTeacher(
                            teachers.find((t) => t.id === teacher.id)!
                          )
                        }
                        className='text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors'
                        title='Chỉnh sửa'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className='text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors'
                        title='Xóa'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className='text-center py-12'>
            <GraduationCap className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy giáo viên
            </h3>
            <p className='text-gray-500 mb-6'>
              {searchTerm
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu bằng cách thêm giáo viên mới'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                Thêm giáo viên đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isViewModalOpen && selectedTeacher && (
        <ViewTeacherModal
          teacher={selectedTeacher}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateTeacher={handleUpdateTeacher}
        />
      )}

      {isCreateModalOpen && (
        <CreateTeacherModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTeacher={handleCreateTeacher}
        />
      )}
    </>
  );
};

export default TeacherManagement;
