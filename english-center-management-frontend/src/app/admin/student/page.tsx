'use client';

import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Mail, Phone, Eye } from 'lucide-react';
import { mockStudents } from '../../../data';
import { Student, StudentProfile } from '../../../types';
import ViewStudentModal from './_components/view-student';
import EditStudentModal from './_components/edit-student';
import CreateStudentModal from './_components/create-student';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use mock students data
  const students = mockStudents;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
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

  const filteredStudents = students.filter((student: Student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === 'All Levels' ||
      student.level === levelFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All Status' ||
      student.status === statusFilter.toLowerCase();
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    // In a real application, you would make an API call here
    console.log('Saving updated student:', updatedStudent);

    // For now, we'll just update the local state
    // In a real app, you would update the students array with the new data
    // setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));

    // Show success message (you can add a toast notification here)
    alert('Thông tin học viên đã được cập nhật thành công!');
  };

  const handleCreateStudent = async (
    newStudent: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    // In a real application, you would make an API call here
    console.log('Creating new student:', newStudent);

    // For now, we'll just show a success message
    // In a real app, you would add the new student to the students array
    // setStudents([...students, { ...newStudent, id: generateId() }]);

    // Show success message (you can add a toast notification here)
    alert('Học viên mới đã được tạo thành công!');
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Quản lý học viên</h1>
          <p className='text-gray-600 mt-1'>
            Quản lý và tổ chức hồ sơ học viên
          </p>
        </div>

        {/* Filters and Search */}
        <div className='flex flex-col sm:flex-row gap-4 mb-8'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Tìm kiếm học viên...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]'
          >
            <option>Tất cả trình độ</option>
            <option>Sơ cấp</option>
            <option>Trung cấp</option>
            <option>Cao cấp</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]'
          >
            <option>Tất cả trạng thái</option>
            <option>Đang học</option>
            <option>Tạm nghỉ</option>
          </select>

          {/* Create Student Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 transition-colors'
          >
            <Plus className='h-5 w-5' />
            <span>Thêm học viên</span>
          </button>
        </div>

        {/* Students Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Học viên
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Liên hệ
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trình độ
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Lớp học hiện tại
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Trạng thái
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredStudents.map((student: Student) => (
                  <tr key={student.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 flex-shrink-0'>
                          <img
                            className='h-12 w-12 rounded-full object-cover'
                            src={
                              student.avatar ||
                              'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=150&h=150&fit=crop&crop=face'
                            }
                            alt={student.name}
                          />
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>
                            {student.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            Mã số: {student.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900 flex items-center gap-1'>
                        <Mail size={14} className='text-gray-400' />
                        {student.email}
                      </div>
                      <div className='text-sm text-gray-500 flex items-center gap-1'>
                        <Phone size={14} className='text-gray-400' />
                        {student.phone}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(
                          student.level
                        )}`}
                      >
                        {student.level.charAt(0).toUpperCase() +
                          student.level.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {student.currentClass || 'Chưa phân lớp'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          student.status
                        )}`}
                      >
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-2'>
                        <button
                          onClick={() => handleViewStudent(student)}
                          className='text-blue-600 hover:text-blue-900'
                          title='Xem chi tiết'
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className='text-indigo-600 hover:text-indigo-900'
                          title='Chỉnh sửa'
                        >
                          <Edit size={16} />
                        </button>
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Student Modal */}
      <ViewStudentModal
        student={selectedStudent}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={selectedStudent}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveStudent}
      />

      {/* Create Student Modal */}
      <CreateStudentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateStudent}
      />
    </div>
  );
};

export default StudentManagement;
