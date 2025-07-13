'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import { Teacher } from '../../../types';
import TeachingScheduleModal from './_components/teaching-schedule-modal';
import { useStaffApi } from '../_hooks/use-api';

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('Tất cả trình độ');
  const [subjectFilter, setSubjectFilter] = useState('Tất cả môn học');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { loading, error, getTeachers, getTeacherSchedule } = useStaffApi();

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
      setIsLoading(false);
    }
  };

  // Use teachers data from API
  const teachersWithDisplay = teachers.map(
    (teacher: Teacher, index: number) => ({
      id: teacher.id,
      name: teacher.name,
      role: teacher.experience
        ? `${teacher.experience} năm kinh nghiệm`
        : 'Giáo viên',
      phone: teacher.phone || 'N/A',
      email: teacher.email,
      subject: teacher.specialization,
      subjectColor:
        index % 2 === 0
          ? 'bg-blue-100 text-blue-800'
          : 'bg-purple-100 text-purple-800',
      level: 'A1 - C1', // Default level range
      levelColor: 'bg-green-100 text-green-800',
    })
  );

  const handleSchedule = async (teacherId: string) => {
    try {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (teacher) {
        const schedule = await getTeacherSchedule(teacherId);
        setSelectedTeacher({ ...teacher, schedule } as Teacher & {
          schedule: any;
        });
        setShowScheduleModal(true);
      }
    } catch (error) {
      console.error('Error fetching teacher schedule:', error);
      alert('Có lỗi xảy ra khi tải lịch giảng dạy!');
    }
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedTeacher(null);
  };

  const filteredTeachers = teachersWithDisplay.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'Tất cả trình độ';
    const matchesSubject =
      subjectFilter === 'Tất cả môn học' || teacher.subject === subjectFilter;
    return matchesSearch && matchesLevel && matchesSubject;
  });

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <span className='text-gray-600'>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-2'>Có lỗi xảy ra khi tải dữ liệu</p>
          <button
            onClick={fetchTeachers}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Title */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Danh sách giáo viên
          </h2>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Tìm kiếm theo tên, email hoặc số điện thoại...'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className='flex gap-4'>
              <select
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option>Tất cả trình độ</option>
                <option>A1 - A2</option>
                <option>A2 - B2</option>
                <option>B1 - C1</option>
                <option>B2 - C2</option>
              </select>
              <select
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option>Tất cả môn học</option>
                <option>IELTS</option>
                <option>TOEIC</option>
                <option>Business English</option>
                <option>Ngữ pháp</option>
                <option>Giao tiếp cơ bản</option>
              </select>
            </div>
          </div>
        </div>

        {/* Teachers Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Họ và tên
                  </th>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Số điện thoại
                  </th>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Email
                  </th>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Môn phụ trách
                  </th>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Trình độ
                  </th>
                  <th className='text-left py-4 px-6 font-medium text-gray-700'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className='hover:bg-gray-50'>
                    <td className='py-4 px-6'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
                          <span className='text-sm font-medium text-gray-600'>
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {teacher.name}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {teacher.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-6 text-gray-900'>{teacher.phone}</td>
                    <td className='py-4 px-6 text-gray-900'>{teacher.email}</td>
                    <td className='py-4 px-6'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${teacher.subjectColor}`}
                      >
                        {teacher.subject}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${teacher.levelColor}`}
                      >
                        {teacher.level}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <button
                        onClick={() => handleSchedule(teacher.id)}
                        className='inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                      >
                        <Calendar className='w-4 h-4 mr-2' />
                        Xem lịch dạy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='bg-white px-6 py-4 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                Hiển thị 1 đến {filteredTeachers.length} trong tổng số{' '}
                {teachers.length} giáo viên
              </div>
              <div className='flex items-center space-x-2'>
                <button className='px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50'>
                  Trước
                </button>
                <button className='px-3 py-1 text-sm text-white bg-teal-600 border border-teal-600 rounded'>
                  1
                </button>
                <button className='px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50'>
                  2
                </button>
                <button className='px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50'>
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Teaching Schedule Modal */}
      {showScheduleModal && selectedTeacher && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Lịch giảng dạy - {selectedTeacher.name}
              </h3>
              <button
                onClick={closeScheduleModal}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-6 h-6' />
              </button>
            </div>
            <div className='overflow-y-auto max-h-[calc(90vh-120px)]'>
              <TeachingScheduleModal
                teacherId={selectedTeacher.id}
                teacherName={selectedTeacher.name}
                onClose={closeScheduleModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
