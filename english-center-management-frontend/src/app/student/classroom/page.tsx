'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  MapPin,
  User,
  CheckCircle,
  Award,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { useStudentApi } from '../_hooks/use-api';
import { ClassroomResponse } from '../../../types/student';
import { formatDays } from '../../staff/list-classroom/[id]/page';

const StudentClassroomPage: React.FC = () => {
  const router = useRouter();
  const { loading, error, getStudentClasses } = useStudentApi();
  const [classes, setClasses] = useState<ClassroomResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesData = await getStudentClasses();
        console.log('classesData:', classesData);
        // Đảm bảo classesData luôn là array
        if (Array.isArray(classesData)) {
          setClasses(classesData);
        } else {
          console.warn(
            'getStudentClasses returned non-array data:',
            classesData
          );
          setClasses([]);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setClasses([]); // Set empty array nếu có lỗi
      }
    };

    fetchData();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'a1':
      case 'a2':
        return 'bg-green-100 text-green-800';
      case 'b1':
      case 'b2':
        return 'bg-yellow-100 text-yellow-800';
      case 'c1':
      case 'c2':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Đang học';
      case 'upcoming':
        return 'Sắp tới';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status || 'Không xác định';
    }
  };

  const getLevelText = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'a1':
        return 'Cơ bản A1';
      case 'a2':
        return 'Cơ bản A2';
      case 'b1':
        return 'Trung cấp B1';
      case 'b2':
        return 'Trung cấp B2';
      case 'c1':
        return 'Nâng cao C1';
      case 'c2':
        return 'Nâng cao C2';
      default:
        return level || 'Không xác định';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleClassClick = (classId: string) => {
    router.push(`/student/classroom/${classId}`);
  };

  // Đảm bảo classes luôn là array
  const safeClasses = classes;
  console.log('Classes:', safeClasses);

  return (
    <div className='space-y-6'>
      {/* Loading state */}
      {loading && (
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <p className='text-red-800'>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Lớp học của tôi</h1>
          <p className='text-gray-600 mt-1'>
            Quản lý và theo dõi tiến độ học tập của bạn
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <BookOpen className='w-4 h-4' />
            <span>{safeClasses.length} lớp học</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <BookOpen className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Tổng số lớp</p>
              <p className='text-xl font-bold text-gray-900'>
                {safeClasses.length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
              <CheckCircle className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Đang học</p>
              <p className='text-xl font-bold text-gray-900'>
                {safeClasses.filter((c) => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
              <Award className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Hoàn thành</p>
              <p className='text-xl font-bold text-gray-900'>
                {safeClasses.filter((c) => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
              <TrendingUp className='w-5 h-5 text-orange-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Sắp tới</p>
              <p className='text-xl font-bold text-gray-900'>
                {safeClasses.filter((c) => c.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {safeClasses.map((classItem) => (
          <div
            key={classItem.id}
            className='bg-white rounded-lg border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-purple-300 group'
            onClick={() => handleClassClick(classItem.id)}
          >
            {/* Class Header */}
            <div className='flex items-start justify-between mb-4'>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors'>
                  {classItem.class_name}
                </h3>
                <div className='flex items-center gap-2'>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(
                      classItem.course_level
                    )}`}
                  >
                    {getLevelText(classItem.course_level)}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      classItem.status
                    )}`}
                  >
                    {getStatusText(classItem.status)}
                  </span>
                </div>
              </div>
              <div className='w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100 group-hover:scale-110 transition-transform'>
                <BookOpen className='w-6 h-6 text-purple-600' />
              </div>
            </div>

            {/* Teacher Info */}
            <div className='flex items-center gap-3 mb-4'>
              <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                <User className='w-4 h-4 text-gray-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>
                  {classItem.teacher?.name}
                </p>
                <p className='text-xs text-gray-500'>Giáo viên</p>
              </div>
            </div>

            {/* Schedule Info */}
            <div className='space-y-2 mb-4'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Clock className='w-4 h-4' />
                <span>
                  {classItem.schedules && classItem.schedules.length > 0
                    ? formatDays(classItem.schedules.map((v) => v.weekday))
                    : 'Chưa có lịch'}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <MapPin className='w-4 h-4' />
                <span>Phòng: {classItem.room}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-end'>
              <div className='flex items-center gap-2 text-sm text-gray-500 group-hover:text-purple-600 transition-colors'>
                <span>Xem chi tiết</span>
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {safeClasses.length === 0 && !loading && (
        <div className='text-center py-12'>
          <BookOpen className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Chưa có lớp học nào
          </h3>
          <p className='text-gray-600'>
            Bạn chưa đăng ký lớp học nào. Hãy liên hệ với trung tâm để đăng ký.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentClassroomPage;
