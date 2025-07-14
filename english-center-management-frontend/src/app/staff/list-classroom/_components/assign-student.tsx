'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Users, User, Check, AlertCircle } from 'lucide-react';
import { useStaffStudentApi, useStaffClassroomApi } from '../../_hooks';
import { Student, ClassData } from '../../../../types';
import Image from 'next/image';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassData | null;
  onAssignStudents: (classroomId: string, studentIds: string[]) => void;
}

interface StudentWithSelection extends Student {
  isSelected: boolean;
  isAssigned: boolean;
}

export default function AssignStudentModal({
  isOpen,
  onClose,
  classroom,
  onAssignStudents,
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
      if (isOpen && classroom) {
        setIsFetchingStudents(true);
        try {
          const availableStudents = await getAvailableStudents();
          const studentsWithSelection = availableStudents.data.map(
            (student: Student) => ({
              ...student,
              isSelected: false,
              isAssigned: false,
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
  }, [isOpen, classroom, getAvailableStudents]);

  // Filter students based on search and level
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === 'all' || student.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  const handleStudentToggle = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
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
        isSelected: filteredStudents.some((s) => s.id === student.id)
          ? !allSelected
          : student.isSelected,
      }))
    );
  };

  const handleAssignStudents = async () => {
    if (!classroom) return;

    const selectedStudentIds = students
      .filter((student) => student.isSelected)
      .map((student) => student.id);

    if (selectedStudentIds.length === 0) {
      alert('Vui lòng chọn ít nhất một học viên để phân công.');
      return;
    }

    // Check if classroom has capacity
    const currentStudents = classroom.students;
    const maxStudents = classroom.maxStudents || 20;
    const availableSlots = maxStudents - currentStudents;

    if (selectedStudentIds.length > availableSlots) {
      alert(
        `Lớp chỉ còn ${availableSlots} chỗ trống. Vui lòng chọn ít hơn ${availableSlots} học viên.`
      );
      return;
    }

    setIsLoading(true);
    try {
      // Assign multiple students at once
      const result = await assignMultipleStudentsToClassroom(
        classroom.id,
        selectedStudentIds
      );

      // Show success/failure messages
      if (result.failed_enrollments && result.failed_enrollments.length > 0) {
        const failedCount = result.failed_enrollments.length;
        const successCount = result.successful_enrollments.length;
        alert(
          `Đã phân công ${successCount} học viên thành công. ${failedCount} học viên không thể phân công.`
        );
      } else {
        alert(`Đã phân công ${selectedStudentIds.length} học viên thành công!`);
      }

      await onAssignStudents(classroom.id, selectedStudentIds);
      onClose();
    } catch (error) {
      console.error('Error assigning students:', error);
      alert('Có lỗi xảy ra khi phân công học viên. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return level;
    }
  };

  if (!isOpen || !classroom) return null;

  const selectedCount = students.filter((student) => student.isSelected).length;
  const availableSlots = (classroom.maxStudents || 20) - classroom.students;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Phân công học viên
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              Lớp: {classroom.name} - {classroom.room}
            </p>
            <p className='text-sm text-gray-600'>
              Hiện tại: {classroom.students}/{classroom.maxStudents || 20} học
              viên
            </p>
          </div>
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

        {/* Student List */}
        <div className='flex-1 overflow-y-auto max-h-96'>
          {isFetchingStudents ? (
            <div className='p-8 text-center text-gray-500'>
              <div className='w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p>Đang tải danh sách học viên...</p>
            </div>
          ) : studentError ? (
            <div className='p-8 text-center text-red-500'>
              <AlertCircle className='w-12 h-12 mx-auto mb-4' />
              <p>Có lỗi xảy ra khi tải danh sách học viên</p>
              <p className='text-sm mt-2'>{studentError}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className='p-8 text-center text-gray-500'>
              <Users className='w-12 h-12 mx-auto mb-4 text-gray-300' />
              <p>Không tìm thấy học viên nào phù hợp</p>
            </div>
          ) : (
            <div className='p-6'>
              {/* Select All */}
              <div className='flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <button
                    onClick={handleSelectAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      filteredStudents.every((student) => student.isSelected)
                        ? 'bg-cyan-500 border-cyan-500 text-white'
                        : 'border-gray-300 hover:border-cyan-400'
                    }`}
                  >
                    {filteredStudents.every(
                      (student) => student.isSelected
                    ) && <Check className='w-3 h-3' />}
                  </button>
                  <span className='font-medium text-gray-700'>
                    Chọn tất cả ({filteredStudents.length})
                  </span>
                </div>
                <span className='text-sm text-gray-500'>
                  Đã chọn: {selectedCount}
                </span>
              </div>

              {/* Students Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      student.isSelected
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          student.isSelected
                            ? 'bg-cyan-500 border-cyan-500 text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {student.isSelected && <Check className='w-3 h-3' />}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center space-x-2'>
                          {student.avatar ? (
                            <Image
                              src={student.avatar}
                              alt={student.name}
                              className='w-8 h-8 rounded-full'
                            />
                          ) : (
                            <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                              <User className='w-4 h-4 text-gray-500' />
                            </div>
                          )}
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-gray-900 truncate'>
                              {student.name}
                            </p>
                            <p className='text-sm text-gray-500 truncate'>
                              {student.studentId}
                            </p>
                          </div>
                        </div>
                        <div className='mt-2 flex items-center justify-between'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                              student.level
                            )}`}
                          >
                            {getLevelLabel(student.level)}
                          </span>
                          <span className='text-xs text-gray-500'>
                            {student.email}
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
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <AlertCircle className='w-4 h-4' />
                <span>Còn {availableSlots} chỗ trống trong lớp</span>
              </div>
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
