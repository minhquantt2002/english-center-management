'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Eye,
  Users,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  StudentResponse,
  StudentCreate,
  EnrollmentNested,
} from '../../../types/admin';
import ViewStudentModal from './_components/view-student';
import EditStudentModal from './_components/edit-student';
import CreateStudentModal from './_components/create-student';
import { useStudentApi } from '../_hooks';
import { toast } from 'react-toastify';
import GenericExcelExportButton from '../../../components/GenericExcelExportButton';
import { studentsExportConfig } from '../../../components/GenericExcelExportButton';
import { HomeworkStatus } from '../../teacher/_hooks/use-homework';
import { getInitials } from '../../staff/list-teacher/page';

export const calculateScore = (enrollment: EnrollmentNested) => {
  let rangeScore = 0;
  let isSW = true;
  if (enrollment.classroom.course_level === 'C1') {
    rangeScore = 250;
  } else {
    isSW = false;
    if (enrollment.classroom.course_level === 'A1') {
      rangeScore = 150;
    } else if (enrollment.classroom.course_level === 'A2') {
      rangeScore = 350;
    } else if (enrollment.classroom.course_level === 'B1') {
      rangeScore = 600;
    } else if (enrollment.classroom.course_level === 'B2') {
      rangeScore = 750;
    }
  }
  if (enrollment.score.length > 0) {
    if (isSW) {
      if (
        enrollment.score[0].speaking !== null &&
        enrollment.score[0].writing !== null
      ) {
        if (
          enrollment.score[0].speaking + enrollment.score[0].writing >=
          rangeScore
        ) {
          return true;
        }
      }
    } else {
      if (
        enrollment.score[0].listening !== null &&
        enrollment.score[0].reading !== null
      ) {
        if (
          enrollment.score[0].listening + enrollment.score[0].reading >=
          rangeScore
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] =
    useState<StudentResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentResponse[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { createStudent, updateStudent, deleteStudent, getStudents } =
    useStudentApi();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const filteredStudents = students.filter((student: StudentResponse) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleViewStudent = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student: StudentResponse) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = async (updatedStudent: StudentResponse) => {
    try {
      await updateStudent(updatedStudent.id, updatedStudent);
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      await fetchStudents(); // Refresh the list
      toast.success('Thông tin học viên đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin học viên!');
    }
  };

  const handleCreateStudent = async (
    newStudent: Omit<StudentCreate, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await createStudent(newStudent);
      setIsCreateModalOpen(false);
      await fetchStudents(); // Refresh the list
      toast.success('Học viên mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating student:', error);
      toast.error(error.detail);
    }
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

  return (
    <>
      {/* Header */}
      <div className='mb-4'>
        <div className='flex items-center gap-4 mb-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Quản lý học viên
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý và tổ chức hồ sơ học viên của trung tâm
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-4'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Tổng học viên
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {students.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>Đang học</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {students.filter((s) => s.status === 'active').length}
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
                <p className='text-gray-500 text-sm font-medium'>Đã huỷ</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {students.filter((s) => s.status === 'inactive').length}
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
                <p className='text-gray-500 text-sm font-medium'>
                  Mới tháng này
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {' '}
                  {
                    students.filter((s) => {
                      const createdDate = new Date(s.created_at);
                      const now = new Date();
                      return (
                        createdDate.getMonth() === now.getMonth() &&
                        createdDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Plus className='w-6 h-6 text-purple-600' />
              </div>
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
              placeholder='Tìm kiếm học viên theo tên hoặc email...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3'>
            {/* Export to Excel Button */}
            <GenericExcelExportButton
              data={filteredStudents}
              config={studentsExportConfig}
              onExportStart={() => {}}
              onExportComplete={() => {}}
            />
            {/* Create Student Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className='px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl'
            >
              <Plus className='h-5 w-5' />
              <span className='font-semibold'>Thêm học viên</span>
            </button>
          </div>
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
                  Trình độ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Lớp học hiện tại
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % đi học
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  % đạt BTVN
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
              {paginatedStudents.map((student: StudentResponse) => {
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
                          <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                            {getInitials(student.name.charAt(0))}
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
                          {student.phone_number || 'Chưa cập nhật'}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getLevelBadgeColor(
                          student.input_level
                        )}`}
                      >
                        {student.input_level === 'A1'
                          ? 'A1 - Mất gốc'
                          : student.input_level === 'A2'
                          ? 'A2 - Sơ cấp'
                          : student.input_level === 'B1'
                          ? 'B1 - Trung cấp thấp'
                          : student.input_level === 'B2'
                          ? 'B2 - Trung cấp cao'
                          : student.input_level === 'C1'
                          ? 'C1 - Nâng cao'
                          : student.input_level}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.enrollments?.length > 0
                        ? student.enrollments.length
                        : 'Chưa phân lớp'}
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
                          student.status || 'active'
                        )}`}
                      >
                        {student.status === 'active'
                          ? 'Đang học'
                          : student.status === 'inactive'
                          ? 'Đã huỷ'
                          : 'Đã hoàn thành'}
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
            <p className='text-gray-500 mb-6'>
              {searchTerm
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu bằng cách thêm học viên mới'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Thêm học viên đầu tiên
              </button>
            )}
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
                          ? 'bg-blue-600 text-white'
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
          onSave={handleSaveStudent}
        />
      )}

      {isCreateModalOpen && (
        <CreateStudentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateStudent}
        />
      )}
    </>
  );
};

export default StudentManagement;
