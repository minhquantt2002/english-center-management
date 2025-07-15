'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  UserX,
  Save,
  Ban,
  Users,
  Shield,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import {
  UserCreate,
  UserRole,
  UserResponse,
  StudentStatus,
} from '../../../types/admin';
import CreateUserModal from './_components/create-user';
import { useUserApi } from '../_hooks';

interface Permission {
  id: string;
  name: string;
  checked: boolean;
}

const UserRolePermissionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);

  const { createUser, updateUser, deleteUser, getUsers, updateUserRole } =
    useUserApi();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'user-management', name: 'Quản lý người dùng', checked: true },
    { id: 'course-management', name: 'Quản lý khóa học', checked: true },
    { id: 'content-creation', name: 'Tạo nội dung', checked: false },
    { id: 'reports-analytics', name: 'Báo cáo & Phân tích', checked: false },
    { id: 'system-settings', name: 'Cài đặt hệ thống', checked: false },
    {
      id: 'financial-management',
      name: 'Quản lý tài chính',
      checked: false,
    },
  ]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'staff':
        return 'bg-orange-100 text-orange-800';
      case 'student':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị';
      case 'teacher':
        return 'Giáo viên';
      case 'staff':
        return 'Nhân viên';
      case 'student':
        return 'Học viên';
      default:
        return role;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'suspended':
        return 'Tạm đình chỉ';
      case 'inactive':
        return 'Không hoạt động';
      case 'graduated':
        return 'Đã tốt nghiệp';
      default:
        return status;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleUserSelect = (user: UserResponse) => {
    setSelectedUser(user);
    setSelectedRole(user.role_name.toLowerCase());
    // Update permissions based on user role (example logic)
    const updatedPermissions = permissions.map((perm) => {
      if (user.role_name === 'admin') {
        return { ...perm, checked: true };
      } else if (user.role_name === 'teacher') {
        return {
          ...perm,
          checked: ['course-management', 'content-creation'].includes(perm.id),
        };
      } else if (user.role_name === 'staff') {
        return { ...perm, checked: ['user-management'].includes(perm.id) };
      } else {
        return { ...perm, checked: false };
      }
    });
    setPermissions(updatedPermissions);
  };

  const handlePermissionChange = (permissionId: string) => {
    setPermissions(
      permissions.map((perm) =>
        perm.id === permissionId ? { ...perm, checked: !perm.checked } : perm
      )
    );
  };

  const handleCreateUser = async (userData: UserCreate) => {
    try {
      await createUser(userData);
      setIsCreateModalOpen(false);
      await fetchUsers(); // Refresh the list
      alert('Người dùng đã được tạo thành công!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Có lỗi xảy ra khi tạo người dùng!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(userId);
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
        await fetchUsers(); // Refresh the list
        alert('Người dùng đã được xóa thành công!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa người dùng!');
      }
    }
  };

  const handleUpdateUserStatus = async (
    userId: string,
    newStatus: StudentStatus
  ) => {
    try {
      await updateUser(userId, { status: newStatus });
      await fetchUsers(); // Refresh the list
      alert('Trạng thái người dùng đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng!');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, { role_name: newRole });
      await fetchUsers(); // Refresh the list
      alert('Vai trò người dùng đã được cập nhật thành công!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Có lỗi xảy ra khi cập nhật vai trò người dùng!');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Quản lý vai trò và quyền người dùng
            </h1>
            <p className='text-gray-600 mt-1'>
              Quản lý tài khoản người dùng, vai trò và quyền trên toàn bộ nền
              tảng
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'
          >
            <Plus size={20} />
            Thêm người dùng
          </button>
        </div>

        {/* Statistics */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Users className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-600'>
                  Tổng người dùng
                </p>
                <p className='text-lg font-semibold text-gray-900'>
                  {users.length}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Shield className='w-6 h-6 text-purple-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-600'>Quản trị</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {users.filter((u) => u.role_name === 'admin').length}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <GraduationCap className='w-6 h-6 text-blue-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-600'>Giáo viên</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {users.filter((u) => u.role_name === 'teacher').length}
                </p>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <UserCheck className='w-6 h-6 text-green-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-600'>Học viên</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {users.filter((u) => u.role_name === 'student').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* User Accounts Section */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Tài khoản người dùng
              </h2>

              {/* Search and Filter */}
              <div className='flex gap-4 mb-6'>
                <div className='flex-1 relative'>
                  <Search
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                    size={20}
                  />
                  <input
                    type='text'
                    placeholder='Tìm kiếm người dùng...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className='overflow-x-auto'>
                {filteredUsers.length > 0 ? (
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Người dùng
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Vai trò
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Trạng thái
                        </th>
                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedUser?.id === user.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <td className='px-4 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='h-10 w-10 flex-shrink-0'>
                                <img
                                  className='h-10 w-10 rounded-full object-cover'
                                  src={
                                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                                  }
                                  alt={user.name}
                                />
                              </div>
                              <div className='ml-3'>
                                <div className='text-sm font-medium text-gray-900'>
                                  {user.name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                                user.role_name
                              )}`}
                            >
                              {getRoleDisplayName(user.role_name)}
                            </span>
                          </td>
                          <td className='px-4 py-4 whitespace-nowrap'>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                                user.status || 'active'
                              )}`}
                            >
                              {getStatusDisplayName(user.status)}
                            </span>
                          </td>
                          <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                            <div className='flex space-x-2'>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUserSelect(user);
                                }}
                                className='text-blue-600 hover:text-blue-900 transition-colors'
                              >
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(user.id);
                                }}
                                className='text-red-600 hover:text-red-900 transition-colors'
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className='text-center py-8'>
                    <UserX className='mx-auto h-12 w-12 text-gray-400' />
                    <h3 className='mt-2 text-sm font-medium text-gray-900'>
                      Không tìm thấy người dùng
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc vai trò.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role Assignment Section */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                Phân công vai trò
              </h2>
              <p className='text-gray-600 text-sm mb-6'>
                Chọn người dùng để chỉnh sửa vai trò và quyền
              </p>

              {selectedUser ? (
                <div>
                  {/* Selected User */}
                  <div className='mb-6'>
                    <h3 className='text-sm font-medium text-gray-700 mb-3'>
                      Người dùng đã chọn
                    </h3>
                    <div className='flex items-center p-3 bg-gray-50 rounded-lg'>
                      <img
                        className='h-10 w-10 rounded-full object-cover'
                        src={
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                        }
                        alt={selectedUser.name}
                      />
                      <div className='ml-3'>
                        <div className='text-sm font-medium text-gray-900'>
                          {selectedUser.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {selectedUser.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assign Role */}
                  <div className='mb-6'>
                    <h3 className='text-sm font-medium text-gray-700 mb-3'>
                      Phân công vai trò
                    </h3>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='admin'>Quản trị</option>
                      <option value='teacher'>Giáo viên</option>
                      <option value='staff'>Nhân viên</option>
                      <option value='student'>Học viên</option>
                    </select>
                  </div>

                  {/* Permissions */}
                  <div className='mb-6'>
                    <h3 className='text-sm font-medium text-gray-700 mb-3'>
                      Quyền hạn
                    </h3>
                    <div className='space-y-3'>
                      {permissions.map((permission) => (
                        <label
                          key={permission.id}
                          className='flex items-center'
                        >
                          <input
                            type='checkbox'
                            checked={permission.checked}
                            onChange={() =>
                              handlePermissionChange(permission.id)
                            }
                            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                          />
                          <span className='ml-3 text-sm text-gray-700'>
                            {permission.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='space-y-3'>
                    <button
                      onClick={() => {
                        if (selectedUser) {
                          handleUpdateUserRole(
                            selectedUser.id,
                            selectedRole as UserRole
                          );
                        }
                      }}
                      className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors'
                    >
                      <Save size={16} />
                      Thay đổi vai trò
                    </button>
                    <button
                      onClick={() => {
                        if (selectedUser) {
                          const newStatus =
                            selectedUser.status === 'active'
                              ? 'suspended'
                              : 'active';
                          handleUpdateUserStatus(selectedUser.id, newStatus);
                        }
                      }}
                      className='w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors'
                    >
                      <Ban size={16} />
                      {selectedUser?.status === 'active'
                        ? 'Tạm đình chỉ'
                        : 'Kích hoạt'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className='text-center py-8'>
                  <UserX className='mx-auto h-12 w-12 text-gray-400' />
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>
                    Chưa chọn người dùng
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Nhấp vào một người dùng từ bảng để quản lý vai trò và quyền
                    của họ.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateUser={handleCreateUser as (userData: UserCreate) => void}
        />
      </div>
    </div>
  );
};

export default UserRolePermissionManagement;
