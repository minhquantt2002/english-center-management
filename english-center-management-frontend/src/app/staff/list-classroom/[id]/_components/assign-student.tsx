'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Search, Users, Check } from 'lucide-react';
import { StudentResponse } from '../../../../../types/staff';
import { useStaffClassroomApi, useStaffStudentApi } from '../../../_hooks';
import { toast } from 'react-toastify';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  classroomId: string;
  classroomName: string;
  existingStudentIds?: string[];
}

export default function AssignStudentModal({
  isOpen,
  onClose,
  refetch,
  classroomId,
  classroomName,
  existingStudentIds = [],
}: AssignStudentModalProps) {
  const { assignMultipleStudentsToClassroom } = useStaffClassroomApi();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<StudentResponse[]>(
    []
  );
  const [filteredStudents, setFilteredStudents] = useState<StudentResponse[]>(
    []
  );
  const { getAvailableStudents, loading, error } = useStaffStudentApi();

  // Fetch available students from API
  useEffect(() => {
    const fetchAvailableStudents = async () => {
      try {
        const students = await getAvailableStudents();
        // Filter out students already in this classroom
        const available = students.filter(
          (student: StudentResponse) => !existingStudentIds.includes(student.id)
        );
        setAvailableStudents(available);
        setFilteredStudents(available);
      } catch (err) {
        console.error('Error fetching available students:', err);
      }
    };

    if (isOpen) {
      fetchAvailableStudents();
    }
  }, [isOpen, existingStudentIds, getAvailableStudents]);

  // Filter students based on search term
  useEffect(() => {
    const filtered = availableStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone_number && student.phone_number.includes(searchTerm))
    );
    setFilteredStudents(filtered);
  }, [searchTerm, availableStudents]);

  const handleAssignStudents = async () => {
    if (!classroomId) return;

    if (selectedStudentIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một học viên để phân công.');
      return;
    }
    setIsSubmitting(true);

    try {
      // Assign multiple students at once
      await assignMultipleStudentsToClassroom(classroomId, selectedStudentIds);
      toast.success(
        `Đã phân công ${selectedStudentIds.length} học viên thành công!`
      );
      refetch();

      onClose();
      // refetch();
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error('Có lỗi xảy ra khi phân công học viên. Vui lòng thử lại.');
    }
    setIsSubmitting(false);
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((student) => student.id));
    }
  };

  const isAllSelected =
    filteredStudents.length > 0 &&
    selectedStudentIds.length === filteredStudents.length;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4  max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-cyan-100 rounded-lg'>
              <Users className='w-6 h-6 text-cyan-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Thêm học viên vào lớp
              </h2>
              <p className='text-sm text-gray-600'>Lớp: {classroomName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Form */}
        <form className='h-full p-6 space-y-6'>
          {/* Search */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              <Search className='w-4 h-4 inline mr-2' />
              Tìm kiếm học viên
            </label>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              placeholder='Tìm theo tên, email hoặc số điện thoại...'
            />
          </div>

          {/* Student List */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Danh sách học viên có thể thêm
              </h3>
              {filteredStudents.length > 0 && (
                <button
                  type='button'
                  onClick={handleSelectAll}
                  className='text-sm text-cyan-600 hover:text-cyan-700 font-medium'
                >
                  {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              )}
            </div>

            {loading ? (
              <div className='text-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto'></div>
                <p className='text-gray-600 mt-2'>
                  Đang tải danh sách học viên...
                </p>
              </div>
            ) : error ? (
              <div className='text-center py-8 text-red-600'>
                <p>Có lỗi xảy ra khi tải danh sách học viên</p>
                <p className='text-sm'>{error}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                {searchTerm
                  ? 'Không tìm thấy học viên phù hợp'
                  : 'Không có học viên nào có thể thêm'}
              </div>
            ) : (
              <div className='grid grid-cols-3 gap-2 overflow-y-auto'>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStudentIds.includes(student.id)
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='relative'>
                          <div className='w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center'>
                            {selectedStudentIds.includes(student.id) && (
                              <Check className='w-3 h-3 text-cyan-600' />
                            )}
                          </div>
                        </div>
                        <div className='flex items-center space-x-3'>
                          <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'>
                            <User className='w-5 h-5 text-gray-600' />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {student.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {student.email}
                            </p>
                            {student.phone_number && (
                              <p className='text-sm text-gray-500'>
                                {student.phone_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Hủy
            </button>
            <button
              onClick={handleAssignStudents}
              disabled={selectedStudentIds.length === 0 || isSubmitting}
              className='px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSubmitting
                ? 'Đang thêm...'
                : `Thêm ${selectedStudentIds.length} học viên`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
