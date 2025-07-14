'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Users,
  Filter,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';
import { Student, StudentProfile } from '../../../types';
import CreateStudentModal, {
  StudentFormData,
} from './_components/create-student-modal';
import EditStudentModal from './_components/edit-student-modal';
import ViewStudentModal from './_components/view-student-modal';
import { useStaffStudentApi } from '../_hooks';

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { error, getStudents, createStudent, updateStudent } =
    useStaffStudentApi();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setIsLoading(false);
    }
  };

  const studentsWithDisplay = students.map((student: Student) => ({
    id: student.id,
    name: student.name,
    phone: student.phone || 'N/A',
    email: student.email,
    level:
      (student.level || 'beginner').charAt(0).toUpperCase() +
      (student.level || 'beginner').slice(1),
    currentClass: student.currentClass || 'Chưa phân lớp',
    status: student.status as 'active' | 'inactive' | 'pending',
    role: student.role,
    studentId: student.studentId,
    enrollmentDate: student.enrollmentDate,
    enrollmentStatus: student.status as 'active' | 'inactive' | 'pending',
    createdAt: student.createdAt || '2024-01-15T08:00:00Z',
    updatedAt: student.updatedAt || '2024-01-15T08:00:00Z',
  }));

  const filteredStudents = studentsWithDisplay.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === 'all' || student.level.toLowerCase() === selectedLevel;
    const matchesStatus =
      selectedStatus === 'all' ||
      (student.status || 'active') === selectedStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleCreateStudent = async (studentData: StudentFormData) => {
    try {
      await createStudent(studentData);
      setIsCreateModalOpen(false);
      await fetchStudents(); // Refresh the list
      alert('Học viên mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Có lỗi xảy ra khi tạo học viên mới!');
    }
  };

  const handleUpdateStudent = async (
    studentId: string,
    studentData: StudentFormData
  ) => {
    try {
      await updateStudent(studentId, studentData);
      setIsEditModalOpen(false);
      setSelectedStudent(null);
      await fetchStudents(); // Refresh the list
      alert('Thông tin học viên đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin học viên!');
    }
  };

  const handleViewStudent = (student: any) => {
    // Convert student data to StudentProfile format for the modal
    const studentProfile: StudentProfile = {
      id: student.id,
      studentId: student.studentId || `ST${student.id.padStart(3, '0')}`,
      name: student.name,
      email: student.email,
      phone: student.phone,
      level: student.level.toLowerCase() as any,
      currentClass: student.currentClass,
      enrollmentDate: student.enrollmentDate || '2024-01-15',
      enrollmentStatus: (student.status || 'active') as any,
      createdAt: student.createdAt || '2024-01-15T08:00:00Z',
      updatedAt: student.updatedAt || '2024-01-15T08:00:00Z',
    };

    setSelectedStudent(studentProfile);
    setIsViewModalOpen(true);
  };

  const handleEditStudent = (student: any) => {
    // Convert student data to StudentProfile format for the modal
    const studentProfile: StudentProfile = {
      id: student.id,
      studentId: student.studentId || `ST${student.id.padStart(3, '0')}`,
      name: student.name,
      email: student.email,
      phone: student.phone,
      level: student.level.toLowerCase() as any,
      currentClass: student.currentClass,
      enrollmentDate: student.enrollmentDate || '2024-01-15',
      enrollmentStatus: (student.status || 'active') as any,
      createdAt: student.createdAt || '2024-01-15T08:00:00Z',
      updatedAt: student.updatedAt || '2024-01-15T08:00:00Z',
    };

    setSelectedStudent(studentProfile);
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
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced':
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

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-6 mb-6'>
        <div className='flex items-center gap-3'>
          <AlertCircle className='w-5 h-5 text-red-500' />
          <p className='text-red-800 font-medium'>
            Có lỗi xảy ra khi tải dữ liệu
          </p>
        </div>
        <button
          onClick={fetchStudents}
          className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
        >
          Thử lại
        </button>
      </div>
    );
  }

  const statusLabels = {
    active: 'Đang học',
    inactive: 'Tạm nghỉ',
    suspended: 'Chờ phân lớp',
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
      <div className='mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg'>
            <Users className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Danh sách học viên
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý và tổ chức hồ sơ học viên của trung tâm
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
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
                <p className='text-gray-500 text-sm font-medium'>
                  Chờ phân lớp
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {students.filter((s) => s.status === 'suspended').length}
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
                <p className='text-gray-500 text-sm font-medium'>Tạm nghỉ</p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {students.filter((s) => s.status === 'inactive').length}
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
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8'>
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

          {/* Level Filter */}
          <div className='relative'>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className='px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[150px] appearance-none bg-white'
            >
              <option value='all'>Tất cả trình độ</option>
              <option value='beginner'>Sơ cấp</option>
              <option value='intermediate'>Trung cấp</option>
              <option value='advanced'>Cao cấp</option>
            </select>
            <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
          </div>

          {/* Status Filter */}
          <div className='relative'>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[140px] appearance-none bg-white'
            >
              <option value='all'>Tất cả trạng thái</option>
              <option value='active'>Đang học</option>
              <option value='suspended'>Chờ phân lớp</option>
              <option value='inactive'>Tạm nghỉ</option>
            </select>
            <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
          </div>

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
                  Trình độ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Lớp học hiện tại
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
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-12 w-12 flex-shrink-0'>
                        <div className='w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                          {getInitials(student.name)}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {student.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          Mã số: {student.studentId}
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
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getLevelBadgeColor(
                        student.level
                      )}`}
                    >
                      {student.level === 'Beginner'
                        ? 'Sơ cấp'
                        : student.level === 'Intermediate'
                        ? 'Trung cấp'
                        : 'Cao cấp'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {student.currentClass}
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
                    </div>
                  </td>
                </tr>
              ))}
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
              {searchTerm || selectedLevel !== 'all' || selectedStatus !== 'all'
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu bằng cách thêm học viên mới'}
            </p>
            {!searchTerm &&
              selectedLevel === 'all' &&
              selectedStatus === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className='px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
                >
                  Thêm học viên đầu tiên
                </button>
              )}
          </div>
        )}
      </div>

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
