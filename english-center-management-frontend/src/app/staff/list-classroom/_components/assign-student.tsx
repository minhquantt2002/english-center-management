'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Users, User, Check, AlertCircle } from 'lucide-react';
import { useStaffStudentApi, useStaffClassroomApi } from '../../_hooks';
import { ClassroomResponse, StudentResponse } from '../../../../types/staff';
import { toast } from 'react-toastify';

interface AssignStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassroomResponse | null;
}

interface StudentWithSelection extends StudentResponse {
  isSelected: boolean;
  isAssigned: boolean;
}

export default function AssignStudentModal({
  isOpen,
  onClose,
  classroom,
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
          const studentsWithSelection = availableStudents.map(
            (student: StudentResponse) => ({
              ...student,
              isSelected: false,
              isAssigned:
                student.enrollments.findIndex(
                  (c) => c.classroom.id === classroom.id
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
  }, [isOpen, classroom, getAvailableStudents]);

  // Filter students based on search and level
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === '' ||
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === 'all' || student.input_level === selectedLevel;

    const isAssigned = !student.isAssigned;

    return matchesSearch && matchesLevel && isAssigned;
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
    if (!classroom) return;

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
      await assignMultipleStudentsToClassroom(classroom.id, selectedStudentIds);

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-red-100 text-red-800';
      case 'A2':
        return 'bg-orange-100 text-orange-800';
      case 'B1':
        return 'bg-yellow-100 text-yellow-800';
      case 'B2':
        return 'bg-blue-100 text-blue-800';
      case 'C1':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'A1':
        return 'A1 - Mất gốc';
      case 'A2':
        return 'A2 - Sơ cấp';
      case 'B1':
        return 'B1 - Trung cấp thấp';
      case 'B2':
        return 'B2 - Trung cấp cao';
      case 'C1':
        return 'C1 - Nâng cao';
      default:
        return level;
    }
  };

  if (!isOpen || !classroom) return null;

  const selectedCount = students.filter((student) => student.isSelected).length;

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
              Lớp: {classroom.class_name} - {classroom.room}
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
              <option value='A1'>A1 - Mất gốc</option>
              <option value='A2'>A2 - Sơ cấp</option>
              <option value='B1'>B1 - Trung cấp thấp</option>
              <option value='B2'>B2 - Trung cấp cao</option>
              <option value='C1'>C1 - Nâng cao</option>
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
                          <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                            <User className='w-4 h-4 text-gray-500' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium text-gray-900 truncate'>
                              {student.name}
                            </p>
                            <p className='text-sm text-gray-500 truncate'>
                              #{student.id.substring(0, 5)}
                            </p>
                          </div>
                        </div>
                        <div className='mt-2 flex items-center justify-between'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                              student.input_level
                            )}`}
                          >
                            {getLevelLabel(student.input_level)}
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
