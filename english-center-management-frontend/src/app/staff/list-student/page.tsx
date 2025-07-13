'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit } from 'lucide-react';
import { Student, StudentProfile } from '../../../types';
import CreateStudentModal, {
  StudentFormData,
} from './_components/create-student-modal';
import EditStudentModal from './_components/edit-student-modal';
import ViewStudentModal from './_components/view-student-modal';
import { useStaffApi } from '../_hooks/use-api';

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

  const { loading, error, getStudents, createStudent, updateStudent } =
    useStaffApi();

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
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

  const studentsWithDisplay = students.map((student: Student) => ({
    id: student.id,
    name: student.name,
    phone: student.phone || 'N/A',
    email: student.email,
    level: student.level.charAt(0).toUpperCase() + student.level.slice(1),
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
      selectedStatus === 'all' || student.status === selectedStatus;
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
      enrollmentStatus: student.status as any,
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
      enrollmentStatus: student.status as any,
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
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-2'>Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={fetchStudents}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const levelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Elementary: 'bg-yellow-100 text-yellow-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const statusLabels = {
    active: 'Đang học',
    inactive: 'Tạm nghỉ',
    pending: 'Chờ phân lớp',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='p-6'>
        {/* Page Title */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Danh sách học viên
            </h2>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors'
          >
            <Plus className='w-4 h-4' />
            Thêm học viên
          </button>
        </div>

        {/* Filters */}
        <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Tìm kiếm
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Tên, số điện thoại, email...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trình độ
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='all'>Tất cả trình độ</option>
                <option value='beginner'>Sơ cấp</option>
                <option value='elementary'>Cơ bản</option>
                <option value='intermediate'>Trung cấp</option>
                <option value='advanced'>Nâng cao</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
              >
                <option value='all'>Tất cả trạng thái</option>
                <option value='active'>Đang học</option>
                <option value='pending'>Chờ phân lớp</option>
                <option value='inactive'>Tạm nghỉ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {/* Table Header with Count */}
          <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>
                Danh sách học viên
              </h3>
              <span className='text-sm text-gray-500'>
                {filteredStudents.length} học viên
              </span>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tên học viên
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Số điện thoại
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trình độ
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Lớp hiện tại
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='px-6 py-12 text-center'>
                      <div className='text-gray-500'>
                        <div className='text-lg font-medium mb-2'>
                          Không tìm thấy học viên
                        </div>
                        <div className='text-sm'>
                          {searchTerm ||
                          selectedLevel !== 'all' ||
                          selectedStatus !== 'all'
                            ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                            : 'Chưa có học viên nào trong hệ thống'}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium'>
                            {getInitials(student.name)}
                          </div>
                          <div className='ml-3'>
                            <div className='text-sm font-medium text-gray-900'>
                              {student.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {student.phone}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {student.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            levelColors[
                              student.level as keyof typeof levelColors
                            ]
                          }`}
                        >
                          {student.level}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {student.currentClass}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[student.status]
                          }`}
                        >
                          {statusLabels[student.status]}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => handleViewStudent(student)}
                            className='text-indigo-600 hover:text-indigo-900 transition-colors'
                            title='Xem chi tiết'
                          >
                            <Eye className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className='text-gray-600 hover:text-gray-900 transition-colors'
                            title='Chỉnh sửa'
                          >
                            <Edit className='w-4 h-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateStudent={handleCreateStudent}
      />

      {/* View Student Modal */}
      <ViewStudentModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        student={selectedStudent}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onUpdateStudent={handleUpdateStudent}
        student={selectedStudent}
      />
    </div>
  );
}
