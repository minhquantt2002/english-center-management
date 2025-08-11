'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Users,
  AlertCircle,
} from 'lucide-react';
import { TeacherResponse } from '../../../types/staff';
import TeachingScheduleModal from './_components/teaching-schedule-modal';
import { useStaffTeacherApi } from '../_hooks';

export default function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] =
    useState<TeacherResponse | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getTeachers, getTeacherSchedule } = useStaffTeacherApi();

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    (teacher: TeacherResponse, index: number) => ({
      id: teacher.id,
      name: teacher.name,
      experience_years: teacher.experience_years
        ? `${teacher.experience_years} năm kinh nghiệm`
        : 'Giáo viên',
      phone: teacher.phone_number || 'N/A',
      email: teacher.email,
      subject: teacher.specialization || 'N/A',
      subjectColor:
        index % 2 === 0
          ? 'bg-blue-100 text-blue-800 border-blue-200'
          : 'bg-purple-100 text-purple-800 border-purple-200',
      levelColor: 'bg-green-100 text-green-800 border-green-200',
      taught_classes: teacher.taught_classes || [],
    })
  );

  const handleSchedule = async (teacherId: string) => {
    try {
      const teacher = teachers.find((t) => t.id === teacherId);
      if (teacher) {
        const schedule = await getTeacherSchedule(teacherId);
        setSelectedTeacher({ ...teacher, schedule } as TeacherResponse & {
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
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg'>
            <GraduationCap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Danh sách giáo viên
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Tổng giáo viên
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {teachersWithDisplay.length}
                </p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <GraduationCap className='w-6 h-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Đang giảng dạy
                </p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Lớp đang dạy
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {teachersWithDisplay.length * 2} {/* Mock data */}
                </p>
              </div>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-500 text-sm font-medium'>
                  Giờ dạy tuần
                </p>
                <p className='text-2xl font-bold text-gray-900 mt-1'>
                  {teachersWithDisplay.length * 20} {/* Mock data */}
                </p>
              </div>
              <div className='w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center'>
                <Clock className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Search */}
          <div className='flex-1 relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Tìm kiếm giáo viên theo tên, email hoặc chuyên môn...'
              className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className='bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Giáo viên
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Liên hệ
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Chuyên môn
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Lớp đang dạy
                </th>
                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-12 w-12 flex-shrink-0'>
                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
                          {getInitials(teacher.name)}
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-semibold text-gray-900'>
                          {teacher.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {teacher.experience_years}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex flex-col space-y-1'>
                      <div className='flex items-center text-sm text-gray-900'>
                        <Mail className='w-4 h-4 text-gray-400 mr-2' />
                        {teacher.email}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Phone className='w-4 h-4 text-gray-400 mr-2' />
                        {teacher.phone}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${teacher.subjectColor}`}
                    >
                      {teacher.subject}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {teacher.taught_classes.length} lớp
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button
                      onClick={() => handleSchedule(teacher.id)}
                      className='text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors'
                      title='Xem lịch giảng dạy'
                    >
                      <Calendar className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className='text-center py-12'>
            <GraduationCap className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy giáo viên
            </h3>
            <p className='text-gray-500 mb-6'>
              {searchTerm
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Chưa có giáo viên nào trong hệ thống'}
            </p>
          </div>
        )}
      </div>

      {/* Teaching Schedule Modal */}
      {showScheduleModal && selectedTeacher && (
        <TeachingScheduleModal
          teacherId={selectedTeacher.id}
          onClose={closeScheduleModal}
        />
      )}
    </>
  );
}
