'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  Mail,
  Phone,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { UserCreate, UserResponse, UserUpdate } from '../../../types/admin';
import { useStaffApi } from '../_hooks';
import ViewStaffModal from './_components/view-staff';
import EditStaffModal from './_components/edit-staff';
import CreateStaffModal from './_components/create-staff';
import { toast } from 'react-toastify';
import GenericExcelExportButton from '../../../components/GenericExcelExportButton';
import { staffExportConfig } from '../../../components/GenericExcelExportButton';
import { getInitials } from '../../staff/list-teacher/page';
const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<UserResponse | null>(null);
  const [staffs, setStaffs] = useState<UserResponse[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { createStaff, updateStaff, deleteStaff, getStaffs } = useStaffApi();

  // Fetch staffs on component mount
  useEffect(() => {
    fetchStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStaffs = async () => {
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (err) {
      console.error('Failed to fetch staffs:', err);
    }
  };

  // Use staffs data from API
  const staffsList = staffs.map((staff: UserResponse) => ({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    phone: staff.phone_number,
    assignedClasses: staff.taught_classes || [],
    bio: staff.bio, // Add bio property
    created_at: staff.created_at,
    status: staff.status,
  }));

  const filteredStaffs = staffsList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.bio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStaffs = filteredStaffs.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCreateStaff = async (staffData: UserCreate) => {
    try {
      await createStaff(staffData);
      setIsCreateModalOpen(false);
      await fetchStaffs(); // Refresh the list
      toast.success('Nhân sự mới đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error(error.detail);
    }
  };

  const handleViewStaff = (staff: UserResponse) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);
  };

  const handleEditStaff = (staff: UserResponse) => {
    setSelectedStaff(staff);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (staffData: UserUpdate) => {
    if (!selectedStaff) return;

    try {
      await updateStaff(selectedStaff.id, staffData);
      setIsEditModalOpen(false);
      setSelectedStaff(null);
      await fetchStaffs(); // Refresh the list
      toast.success('Thông tin nhân sự đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin nhân sự!');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân sự này?')) {
      try {
        await deleteStaff(staffId);
        await fetchStaffs(); // Refresh the list
        toast.success('Nhân sự đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Có lỗi xảy ra khi xóa nhân sự!');
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
              Quản lý nhân sự
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý và tổ chức đội ngũ nhân sự của trung tâm
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Tổng nhân sự
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {staffs.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-green-600' />
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
                  {staffs.reduce(
                    (total, t) =>
                      total +
                      (t.created_at &&
                      new Date(t.created_at).getMonth() ===
                        new Date().getMonth()
                        ? 1
                        : 0),
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
              placeholder='Tìm kiếm nhân sự theo tên hoặc chuyên môn...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
            />
          </div>
          {/* Export to Excel Button */}
          <GenericExcelExportButton
            data={filteredStaffs}
            config={staffExportConfig}
            onExportStart={() => setLoading(true)}
            onExportComplete={() => setLoading(false)}
          />

          {/* Add Staff Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            <Plus className='h-5 w-5' />
            <span className='font-semibold'>Thêm nhân sự</span>
          </button>
        </div>
      </div>

      {/* Staffs Table */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Nhân sự
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Liên hệ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Chuyên môn
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {currentStaffs.map((staff) => (
                <tr
                  key={staff.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-12 w-12 flex-shrink-0'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                          {getInitials(staff.name.charAt(0))}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {staff.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex flex-col space-y-1'>
                      <div className='flex items-center text-sm text-gray-900'>
                        <Mail className='w-4 h-4 text-gray-400 mr-2' />
                        {staff.email}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Phone className='w-4 h-4 text-gray-400 mr-2' />
                        {staff.phone || 'Chưa cập nhật'}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {staff.bio || 'Chưa cập nhật'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() =>
                          handleViewStaff(
                            staffs.find((t) => t.id === staff.id)!
                          )
                        }
                        className='text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors'
                        title='Xem chi tiết'
                      >
                        <Eye className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() =>
                          handleEditStaff(
                            staffs.find((t) => t.id === staff.id)!
                          )
                        }
                        className='text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors'
                        title='Chỉnh sửa'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
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

        {/* Pagination */}
        {filteredStaffs.length > 0 && totalPages > 1 && (
          <div className='px-6 py-4 border-t border-gray-100 bg-gray-50'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Hiển thị {startIndex + 1} đến{' '}
                {Math.min(endIndex, filteredStaffs.length)} trong tổng số{' '}
                {filteredStaffs.length} nhân sự
              </div>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft className='w-4 h-4' />
                </button>

                {/* Page numbers */}
                <div className='flex items-center space-x-1'>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight className='w-4 h-4' />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredStaffs.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy nhân sự
            </h3>
            <p className='text-gray-500 mb-6'>
              {searchTerm
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Bắt đầu bằng cách thêm nhân sự mới'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                Thêm nhân sự đầu tiên
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isViewModalOpen && selectedStaff && (
        <ViewStaffModal
          staff={selectedStaff}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}

      {isEditModalOpen && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateStaff={handleUpdateStaff}
        />
      )}

      {isCreateModalOpen && (
        <CreateStaffModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateStaff={handleCreateStaff}
        />
      )}
    </>
  );
};

export default StaffManagement;
