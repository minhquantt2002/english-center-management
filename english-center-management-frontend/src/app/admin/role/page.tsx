'use client';

import React, { useState } from 'react';
import { Search, Plus, UserX, Save, Ban } from 'lucide-react';
import { mockUsers } from '../../../data';
import { User } from '../../../types';

interface Permission {
  id: string;
  name: string;
  checked: boolean;
}

const UserRolePermissionManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState('admin');

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'user-management', name: 'User Management', checked: true },
    { id: 'course-management', name: 'Course Management', checked: true },
    { id: 'content-creation', name: 'Content Creation', checked: false },
    { id: 'reports-analytics', name: 'Reports & Analytics', checked: false },
    { id: 'system-settings', name: 'System Settings', checked: false },
    {
      id: 'financial-management',
      name: 'Financial Management',
      checked: false,
    },
  ]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Teacher':
        return 'bg-blue-100 text-blue-800';
      case 'Receptionist':
        return 'bg-orange-100 text-orange-800';
      case 'Student':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role.toLowerCase());
    // Update permissions based on user role (example logic)
    const updatedPermissions = permissions.map((perm) => {
      if (user.role === 'admin') {
        return { ...perm, checked: true };
      } else if (user.role === 'teacher') {
        return {
          ...perm,
          checked: ['course-management', 'content-creation'].includes(perm.id),
        };
      } else if (user.role === 'enrollment') {
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
          <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors'>
            <Plus size={20} />
            Thêm người dùng
          </button>
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
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option>Tất cả vai trò</option>
                  <option>Quản trị</option>
                  <option>Giáo viên</option>
                  <option>Lễ tân</option>
                  <option>Học viên</option>
                </select>
              </div>

              {/* Users Table */}
              <div className='overflow-x-auto'>
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
                                src={user.avatar}
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
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                          <div className='flex space-x-2'>
                            <button className='text-blue-600 hover:text-blue-900 transition-colors'>
                              Chỉnh sửa
                            </button>
                            <button className='text-red-600 hover:text-red-900 transition-colors'>
                              Thu hồi
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
                        src={selectedUser.avatar}
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
                      <option>Quản trị</option>
                      <option>Giáo viên</option>
                      <option>Lễ tân</option>
                      <option>Học viên</option>
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
                    <button className='w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors'>
                      <Save size={16} />
                      Change Role
                    </button>
                    <button className='w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors'>
                      <Ban size={16} />
                      Revoke Access
                    </button>
                  </div>
                </div>
              ) : (
                <div className='text-center py-8'>
                  <UserX className='mx-auto h-12 w-12 text-gray-400' />
                  <h3 className='mt-2 text-sm font-medium text-gray-900'>
                    No user selected
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Click on a user from the table to manage their role and
                    permissions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRolePermissionManagement;
