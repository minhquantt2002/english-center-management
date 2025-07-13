'use client';

import React, { useState } from 'react';
import { Search, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { mockTeachers } from '../../../data';
import { Teacher } from '../../../types';
import CreateTeacherModal, {
  TeacherFormData,
} from './_components/create-teacher';
import ViewTeacherModal from './_components/view-teacher';
import EditTeacherModal, {
  TeacherFormData as EditTeacherFormData,
} from './_components/edit-teacher';

const TeacherManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState(mockTeachers);

  // Use teachers data from state
  const teachersList = teachers.map((teacher: Teacher) => ({
    id: teacher.id,
    name: teacher.name,
    specialization: teacher.specialization,
    email: teacher.email,
    phone: teacher.phone,
    assignedClasses: teacher.assignedClasses || [],
    status:
      teacher.status === 'active'
        ? 'Hoạt động'
        : teacher.status === 'inactive'
        ? 'Không hoạt động'
        : 'Nghỉ phép',
    avatar: teacher.avatar,
  }));

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return 'bg-green-100 text-green-800';
      case 'Nghỉ phép':
        return 'bg-yellow-100 text-yellow-800';
      case 'Không hoạt động':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getClassBadgeColor = (className: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    return colors[className.length % colors.length];
  };

  const filteredTeachers = teachersList.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTeacher = (teacherData: TeacherFormData) => {
    // Tạo ID mới cho giáo viên
    const newId = Math.max(...teachers.map((t) => parseInt(t.id))) + 1;

    // Tạo đối tượng Teacher mới từ form data
    const newTeacher: Teacher = {
      id: newId.toString(),
      teacherId: `T${newId.toString().padStart(3, '0')}`,
      name: teacherData.name,
      email: teacherData.email,
      phone: teacherData.phone,
      role: 'teacher',
      specialization: teacherData.specialization,
      qualification: teacherData.qualification,
      experience: teacherData.experience,
      hourlyRate: teacherData.hourlyRate,
      status: 'active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        teacherData.name
      )}&background=0D9488&color=fff`,
      assignedClasses: [],
    };

    // Thêm giáo viên mới vào danh sách
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const handleViewTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsViewModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleUpdateTeacher = (teacherData: EditTeacherFormData) => {
    if (selectedTeacher) {
      // Cập nhật thông tin giáo viên
      const updatedTeacher: Teacher = {
        ...selectedTeacher,
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        specialization: teacherData.specialization,
        qualification: teacherData.qualification,
        experience: teacherData.experience,
        hourlyRate: teacherData.hourlyRate,
        status: teacherData.status,
      };

      // Cập nhật danh sách giáo viên
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === selectedTeacher.id ? updatedTeacher : teacher
        )
      );
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Quản lý giáo viên
          </h1>
          <p className='text-gray-600 mt-1'>
            Quản lý và tổ chức đội ngũ giảng dạy
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
              placeholder='Tìm kiếm giáo viên...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]'
          >
            <option>Tất cả môn học</option>
            <option>Ngữ pháp</option>
            <option>Hội thoại</option>
            <option>IELTS</option>
            <option>Tiếng Anh thương mại</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]'
          >
            <option>Tất cả trạng thái</option>
            <option>Hoạt động</option>
            <option>Nghỉ phép</option>
            <option>Không hoạt động</option>
          </select>

          {/* Add Teacher Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap'
          >
            <Plus size={20} />
            Thêm giáo viên
          </button>
        </div>

        {/* Teachers Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Giáo viên
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Liên hệ
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Lớp được phân công
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
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='h-12 w-12 flex-shrink-0'>
                          <img
                            className='h-12 w-12 rounded-full object-cover'
                            src={teacher.avatar}
                            alt={teacher.name}
                          />
                        </div>
                        <div className='ml-4'>
                          <div
                            className='text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors'
                            onClick={() =>
                              handleViewTeacher(
                                teachers.find((t) => t.id === teacher.id)!
                              )
                            }
                          >
                            {teacher.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {teacher.specialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {teacher.email}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {teacher.phone}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap gap-1'>
                        {teacher.assignedClasses.map((className, index) => (
                          <span
                            key={index}
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getClassBadgeColor(
                              className
                            )}`}
                          >
                            {className}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                          teacher.status
                        )}`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex space-x-3'>
                        <button
                          onClick={() =>
                            handleViewTeacher(
                              teachers.find((t) => t.id === teacher.id)!
                            )
                          }
                          className='text-green-600 hover:text-green-900 transition-colors'
                          title='Xem chi tiết'
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleEditTeacher(
                              teachers.find((t) => t.id === teacher.id)!
                            )
                          }
                          className='text-blue-600 hover:text-blue-900 transition-colors'
                          title='Chỉnh sửa'
                        >
                          <Edit size={18} />
                        </button>
                        <button className='text-red-600 hover:text-red-900 transition-colors'>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200'>
            <div className='text-sm text-gray-700'>
              Hiển thị 1 đến {filteredTeachers.length} trong tổng số{' '}
              {teachers.length} giáo viên
            </div>
            <div className='flex items-center space-x-2'>
              <button className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                Trước
              </button>
              <button className='px-3 py-2 text-sm bg-blue-600 text-white rounded'>
                1
              </button>
              <button className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                2
              </button>
              <button className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                3
              </button>
              <button className='px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors'>
                Tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Create Teacher Modal */}
        <CreateTeacherModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateTeacher={handleCreateTeacher}
        />

        {/* View Teacher Modal */}
        <ViewTeacherModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTeacher(null);
          }}
          teacher={selectedTeacher}
        />

        {/* Edit Teacher Modal */}
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTeacher(null);
          }}
          onUpdateTeacher={handleUpdateTeacher}
          teacher={selectedTeacher}
        />
      </div>
    </div>
  );
};

export default TeacherManagement;
