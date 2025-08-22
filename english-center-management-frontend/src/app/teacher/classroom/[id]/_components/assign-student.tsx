'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Users, User, Check, AlertCircle } from 'lucide-react';
import { StudentResponse } from '../../../../../types/staff';
import {
  useStaffClassroomApi,
  useStaffStudentApi,
} from '../../../../staff/_hooks';
import { toast } from 'react-toastify';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: string;
}

interface StudentWithSelection extends StudentResponse {
  isSelected: boolean;
  isAssigned: boolean;
}

export default function AssignStudentModal({
  isOpen,
  onClose,
  classroomId,
}: AssignStudentModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [students, setStudents] = useState<StudentWithSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);

  const {
    getAvailableStudents,
    loading: studentLoading,
    error: studentError,
  } = useStaffStudentApi();

  const { assignMultipleStudentsToClassroom, loading: classroomLoading } =
    useStaffClassroomApi();

  // Initialize students with selection state
  useEffect(() => {
    const fetchStudents = async () => {
      if (isOpen && classroomId) {
        setIsFetchingStudents(true);
        try {
          const availableStudents = await getAvailableStudents();
          const studentsWithSelection = availableStudents.map(
            (student: StudentResponse) => ({
              ...student,
              isSelected: false,
              isAssigned:
                student.enrollments.findIndex(
                  (c) => c.classroom.id === classroomId
                ) !== -1,
            })
          );
          setStudents(studentsWithSelection);
        } catch (error) {
          console.error('Error fetching students:', error);
        } finally {
          setIsFetchingStudents(false);
        }
      }
    };

    fetchStudents();
  }, [isOpen, classroomId, getAvailableStudents]);

  // Filter students based on search and level
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const isAssigned = !student.isAssigned;

    return matchesSearch && isAssigned;
  });

  const handleStudentToggle = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId.toString()
          ? { ...student, isSelected: !student.isSelected }
          : student
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = filteredStudents.every((student) => student.isSelected);
    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        isSelected: filteredStudents.some((s) => s.id === student.id.toString())
          ? !allSelected
          : student.isSelected,
      }))
    );
  };

  const handleAssignStudents = async () => {
    if (!classroomId) return;

    const selectedStudentIds = students
      .filter((student) => student.isSelected)
      .map((student) => student.id.toString());

    if (selectedStudentIds.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một học viên để phân công.');
      return;
    }

    setIsLoading(true);
    try {
      // Assign multiple students at once
      await assignMultipleStudentsToClassroom(classroomId, selectedStudentIds);

      toast.success(
        `Đã phân công ${selectedStudentIds.length} học viên thành công!`
      );

      onClose();
    } catch (error) {
      console.error('Error assigning students:', error);
      toast.error('Có lỗi xảy ra khi phân công học viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !classroomId) return null;

  const selectedCount = students.filter((student) => student.isSelected).length;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !mt-0 z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <h2 className='text-xl font-semibold text-gray-900'>Thêm học viên</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Search and Filters */}
        <div className='p-6 border-b bg-gray-50'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Tìm kiếm học viên theo tên, email hoặc mã số...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
            >
              <option value='all'>Tất cả trình độ</option>
              <option value='beginner'>Cơ bản</option>
              <option value='intermediate'>Trung cấp</option>
              <option value='advanced'>Nâng cao</option>
            </select>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto max-h-[500px]'>
          {isFetchingStudents ? (
            <div className='p-12 text-center text-gray-500'>
              <div className='w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-lg font-medium'>
                Đang tải danh sách học viên...
              </p>
              <p className='text-sm text-gray-400 mt-1'>
                Vui lòng đợi trong giây lát
              </p>
            </div>
          ) : studentError ? (
            <div className='p-12 text-center text-red-500'>
              <div className='w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4'>
                <AlertCircle className='w-8 h-8' />
              </div>
              <p className='text-lg font-medium'>
                Có lỗi xảy ra khi tải danh sách học viên
              </p>
              <p className='text-sm mt-2 text-gray-500'>{studentError}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className='p-12 text-center text-gray-500'>
              <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8 text-gray-400' />
              </div>
              <p className='text-lg font-medium'>
                Không tìm thấy học viên nào phù hợp
              </p>
              <p className='text-sm text-gray-400 mt-1'>
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          ) : (
            <div className='p-6'>
              {/* Select All */}
              <div className='flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200'>
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={handleSelectAll}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      filteredStudents.every((student) => student.isSelected)
                        ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'border-gray-300 hover:border-cyan-400 hover:bg-cyan-50'
                    }`}
                  >
                    {filteredStudents.every(
                      (student) => student.isSelected
                    ) && <Check className='w-4 h-4' />}
                  </button>
                  <div>
                    <span className='font-semibold text-gray-800'>
                      Chọn tất cả
                    </span>
                    <span className='text-gray-500 ml-2'>
                      ({filteredStudents.length} học viên)
                    </span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-sm font-medium text-cyan-600 bg-cyan-100 px-3 py-1 rounded-full'>
                    Đã chọn: {selectedCount}
                  </span>
                </div>
              </div>

              {/* Students Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      student.isSelected
                        ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg shadow-cyan-500/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          student.isSelected
                            ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                            : 'border-gray-300 hover:border-cyan-400'
                        }`}
                      >
                        {student.isSelected && <Check className='w-4 h-4' />}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-3 mb-3'>
                          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-inner'>
                            <User className='w-5 h-5 text-gray-600' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-semibold text-gray-900 truncate text-lg'>
                              {student.name}
                            </p>
                            <p className='text-sm text-gray-500 truncate'>
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-xs text-gray-400 font-medium'>
                            ID: {student.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-6 border-t bg-gray-50'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              {selectedCount > 0 && (
                <span className='text-sm font-medium text-cyan-600'>
                  Đã chọn {selectedCount} học viên
                </span>
              )}
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
              >
                Hủy
              </button>
              <button
                onClick={handleAssignStudents}
                disabled={
                  selectedCount === 0 ||
                  isLoading ||
                  isFetchingStudents ||
                  studentLoading ||
                  classroomLoading
                }
                className='px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2'
              >
                {isLoading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Users className='w-4 h-4' />
                    <span>Phân công ({selectedCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
