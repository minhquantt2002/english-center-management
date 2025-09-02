'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Users,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import CreateStudentModal from './_components/create-student-modal';
import EditStudentModal from './_components/edit-student-modal';
import ViewStudentModal from './_components/view-student-modal';
import { useStaffStudentApi } from '../_hooks';
import {
  StudentResponse,
  StudentCreate,
  StudentUpdate,
} from '../../../types/staff';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import GenericExcelExportButton from '../../../components/GenericExcelExportButton';
import { studentsExportConfig } from '../../../components/GenericExcelExportButton';
import { HomeworkStatus } from '../../teacher/_hooks/use-homework';
import { calculateScore } from '../../admin/student/page';

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { getStudents, createStudent, updateStudent, deleteStudent } =
    useStaffStudentApi();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setIsLoading(false);
    }
  };

  const studentsWithDisplay = (students || []).map(
    (student: StudentResponse): StudentResponse => ({
      ...student,
      id: student.id,
      name: student.name,
      phone_number: student.phone_number || 'N/A',
      email: student.email,
      input_level: student.input_level || 'beginner',
      created_at: student.created_at,
      enrollments: student.enrollments,
      status: student.status,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
      bio: student.bio,
      date_of_birth: student.date_of_birth,
    })
  );

  const filteredStudents = studentsWithDisplay.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCreateStudent = async (studentData: StudentCreate) => {
    try {
      await createStudent(studentData);
      setIsCreateModalOpen(false);
      await fetchStudents(); // Refresh the list
      toast.success('Học viên mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error('Có lỗi xảy ra khi tạo học viên mới!');
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    studentData: StudentUpdate
  ) => {
    try {
      await updateStudent(studentId, studentData);
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      await fetchStudents(); // Refresh the list
      toast.success('Thông tin học viên đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin học viên!');
    }
  };

  const handleViewStudent = (student: StudentResponse) => {
    // Convert student data to StudentProfile format for the modal
    const studentProfile: StudentResponse = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone_number: student.phone_number,
      input_level: student.input_level,
      enrollments: student.enrollments,
      status: student.status,
      created_at: student.created_at,
    };

    setSelectedStudent(studentProfile);
    setIsViewModalOpen(true);
  };
  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        await deleteStudent(studentId);
        await fetchStudents(); // Refresh the list
        toast.success('Học viên đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Có lỗi xảy ra khi xóa học viên!');
      }
    }
  };

  const handleEditStudent = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'graduated':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'A2':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'B1':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'B2':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'C1':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
      </div>
    );
  }

  const statusLabels = {
    active: 'Đang học',
    inactive: 'Đã huỷ',
    graduated: 'Đã hoàn thành',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Header */}
      <div className='mb-4'>
        <div className='flex items-center gap-4 mb-4'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Danh sách học viên
          </h1>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Tổng học viên
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {studentsWithDisplay.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-teal-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Đang học</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {
                    studentsWithDisplay.filter((s) => s.status === 'active')
                      .length
                  }
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Chờ phân lớp
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {
                    studentsWithDisplay.filter(
                      (s) => s.enrollments.length === 0
                    ).length
                  }
                </p>
              </div>
              <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-yellow-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Đã huỷ</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {
                    studentsWithDisplay.filter((s) => s.status === 'inactive')
                      .length
                  }
                </p>
              </div>
              <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-gray-600' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='mb-4'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Tìm kiếm học viên theo tên, email hoặc mã số...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>
          {/* Export to Excel Button */}
          <GenericExcelExportButton
            data={filteredStudents}
            config={studentsExportConfig}
            onExportStart={() => setIsLoading(true)}
            onExportComplete={() => setIsLoading(false)}
          />
          {/* Add Student Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <Plus className='h-5 w-5' />
            <span className='font-semibold'>Thêm học viên</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Học viên
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Liên hệ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Lớp học hiện tại
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % đi học
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % đạt btvn
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % đạt đầu ra
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Trạng thái
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {paginatedStudents.map((student) => {
                const total = student?.attendances?.length;
                const totalAttended = student?.attendances?.filter(
                  (att) => att.is_present === true
                ).length;

                const totalPassedHomework = student?.homeworks?.filter(
                  (hw) => hw.status === HomeworkStatus.PASSED
                ).length;

                const totalPassed = student?.enrollments?.filter((enrollment) =>
                  calculateScore(enrollment)
                ).length;

                return (
                  <tr
                    key={student.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 flex-shrink-0'>
                          <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                            {getInitials(student.name).charAt(0)}
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-semibold text-gray-900'>
                            {student.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex flex-col space-y-1'>
                        <div className='flex items-center text-sm text-gray-900'>
                          <Mail className='w-4 h-4 text-gray-400 mr-2' />
                          {student.email}
                        </div>
                        <div className='flex items-center text-sm text-gray-500'>
                          <Phone className='w-4 h-4 text-gray-400 mr-2' />
                          {student.phone_number}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.enrollments.length} lớp
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {Math.round((totalAttended / total) * 100) || 0}%
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {Math.round((totalPassedHomework / total) * 100) || 0}%
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {Math.round(
                        (totalPassed / student?.enrollments?.length) * 100
                      ) || 0}
                      %
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                          student.status
                        )}`}
                      >
                        {statusLabels[student.status]}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleViewStudent(student)}
                          className='text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors'
                          title='Xem chi tiết'
                        >
                          <Eye className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className='text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors'
                          title='Chỉnh sửa'
                        >
                          <Edit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className='text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors'
                          title='Xóa'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy học viên
            </h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && totalPages > 1 && (
        <div className='bg-white rounded-xl border border-gray-100 shadow-sm mt-4 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Hiển thị {startIndex + 1} đến{' '}
              {Math.min(endIndex, filteredStudents.length)} trong tổng số{' '}
              {filteredStudents.length} học viên
            </div>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className='w-4 h-4' />
              </button>

              <div className='flex items-center space-x-1'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ChevronRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateStudentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateStudent={handleCreateStudent}
        />
      )}

      {isViewModalOpen && selectedStudent && (
        <ViewStudentModal
          student={selectedStudent}
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
        />
      )}

      {isEditModalOpen && selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdateStudent={handleUpdateStudent}
        />
      )}
    </>
  );
}
