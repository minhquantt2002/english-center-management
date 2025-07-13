'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Search, Users, Check } from 'lucide-react';
import { Student } from '../../../../../types';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (studentIds: string[]) => void;
  classroomName: string;
  existingStudentIds?: string[];
}

export default function AssignStudentModal({
  isOpen,
  onClose,
  onAssign,
  classroomName,
  existingStudentIds = [],
}: AssignStudentModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        studentId: 'ST001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        phone: '0123456789',
        dateOfBirth: '2005-03-15',
        level: 'intermediate',
        currentClass: '',
        enrollmentDate: '2024-01-15',
        role: 'student',
        status: 'active',
      },
      {
        id: '2',
        studentId: 'ST002',
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        phone: '0987654321',
        dateOfBirth: '2006-07-22',
        level: 'elementary',
        currentClass: '',
        enrollmentDate: '2024-02-01',
        role: 'student',
        status: 'active',
      },
      {
        id: '3',
        studentId: 'ST003',
        name: 'Lê Hoàng Cường',
        email: 'cuong.le@email.com',
        phone: '0369852147',
        dateOfBirth: '2004-11-08',
        level: 'advanced',
        currentClass: 'Lớp A1',
        enrollmentDate: '2023-09-10',
        role: 'student',
        status: 'active',
      },
      {
        id: '4',
        studentId: 'ST004',
        name: 'Phạm Thị Dung',
        email: 'dung.pham@email.com',
        phone: '0521478963',
        dateOfBirth: '2005-05-30',
        level: 'beginner',
        currentClass: '',
        enrollmentDate: '2024-03-05',
        role: 'student',
        status: 'active',
      },
      {
        id: '5',
        studentId: 'ST005',
        name: 'Hoàng Văn Em',
        email: 'em.hoang@email.com',
        phone: '0741258963',
        dateOfBirth: '2006-01-12',
        level: 'upper-intermediate',
        currentClass: 'Lớp B2',
        enrollmentDate: '2023-12-20',
        role: 'student',
        status: 'active',
      },
    ];

    // Filter out students already in this classroom
    const available = mockStudents.filter(
      (student) => !existingStudentIds.includes(student.id)
    );
    setAvailableStudents(available);
    setFilteredStudents(available);
  }, [existingStudentIds]);

  // Filter students based on search term
  useEffect(() => {
    const filtered = availableStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.phone && student.phone.includes(searchTerm))
    );
    setFilteredStudents(filtered);
  }, [searchTerm, availableStudents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudentIds.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAssign(selectedStudentIds);

      // Reset form
      setSelectedStudentIds([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error assigning students:', error);
    } finally {
      setIsSubmitting(false);
    }
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
  const isIndeterminate =
    selectedStudentIds.length > 0 &&
    selectedStudentIds.length < filteredStudents.length;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
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
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
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

            {filteredStudents.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                {searchTerm
                  ? 'Không tìm thấy học viên phù hợp'
                  : 'Không có học viên nào có thể thêm'}
              </div>
            ) : (
              <div className='space-y-2 max-h-64 overflow-y-auto'>
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
                          <div className='w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center'>
                            <User className='w-5 h-5 text-cyan-600' />
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {student.name}
                            </h4>
                            <p className='text-sm text-gray-600'>
                              {student.email} •{' '}
                              {student.phone || 'Chưa có số điện thoại'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Trình độ: {student.level}
                              {student.currentClass &&
                                ` • Lớp hiện tại: ${student.currentClass}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Count */}
          {selectedStudentIds.length > 0 && (
            <div className='bg-cyan-50 border border-cyan-200 rounded-lg p-3'>
              <p className='text-sm text-cyan-800'>
                Đã chọn{' '}
                <span className='font-semibold'>
                  {selectedStudentIds.length}
                </span>{' '}
                học viên
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center justify-end space-x-3 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={isSubmitting || selectedStudentIds.length === 0}
              className='px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Đang thêm...</span>
                </>
              ) : (
                <>
                  <Users className='w-4 h-4' />
                  <span>Thêm học viên ({selectedStudentIds.length})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
