'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  MapPin,
  User,
  Calendar,
  CheckCircle,
  Award,
  Video,
  MessageCircle,
  ArrowLeft,
  Target,
  BarChart3,
} from 'lucide-react';
import { useStudentApi } from '../../_hooks/use-api';
import { ClassroomResponse } from '../../../../types/student';

const ClassDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { loading, error, getClassDetails } = useStudentApi();
  const [classData, setClassData] = useState<ClassroomResponse | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'assignments' | 'schedule'
  >('overview');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classId = params.id as string;
        const classDetails = await getClassDetails(classId);
        setClassData(classDetails);
      } catch (err) {
        console.error('Error fetching class details:', err);
        // Redirect to classroom list if class not found
        router.push('/student/classroom');
      }
    };

    fetchClassData();
  }, [params.id, router, getClassDetails]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Đang tải thông tin lớp...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Có lỗi xảy ra
          </h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <button
            onClick={() => router.push('/student/classroom')}
            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Không tìm thấy lớp
          </h2>
          <p className='text-gray-600 mb-6'>
            Lớp bạn đang tìm kiếm không tồn tại.
          </p>
          <button
            onClick={() => router.push('/student/classroom')}
            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Back Button */}
      <div className='flex items-center gap-4'>
        <button
          onClick={() => router.push('/student/classroom')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Quay lại</span>
        </button>
        <div className='flex-1'>
          <h1 className='text-xl font-bold text-gray-900'>
            {classData.class_name}
          </h1>
        </div>
        <div className='flex items-center gap-3'>
          <button className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'>
            <MessageCircle className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Class Info Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <User className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Giáo viên</p>
              <p className='font-medium text-gray-900'>
                {classData.teacher?.name}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
              <Clock className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Lịch học</p>
              <p className='font-medium text-gray-900'>
                {classData.schedules && classData.schedules.length > 0
                  ? classData.schedules.map((s) => s.weekday).join(', ')
                  : 'Chưa có lịch học'}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Phòng học</p>
              <p className='font-medium text-gray-900'>{classData.room}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Target className='w-5 h-5 text-orange-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Trạng thái</p>
              <p className='font-medium text-gray-900'>
                {classData.status === 'active' && 'Đang học'}
                {classData.status === 'cancelled' && 'Đã hủy'}
                {classData.status === 'completed' && 'Hoàn thành'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-lg border border-gray-200'>
        {/* Tabs */}
        <div className='flex border-b border-gray-200'>
          {[
            { id: 'overview', label: 'Tổng quan', icon: BookOpen },
            { id: 'assignments', label: 'Bài tập', icon: Award },
            { id: 'schedule', label: 'Lịch học', icon: Calendar },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className='w-4 h-4' />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Class Details */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Thông tin lớp học
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                          <BookOpen className='w-5 h-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Tên lớp</p>
                          <p className='font-medium text-gray-900'>
                            {classData.class_name}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                          <User className='w-5 h-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Giáo viên</p>
                          <p className='font-medium text-gray-900'>
                            {classData.teacher?.name}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                          <Clock className='w-5 h-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Thời gian học</p>
                          <p className='font-medium text-gray-900'>
                            {classData.schedules &&
                            classData.schedules.length > 0
                              ? `${classData.schedules[0].start_time} - ${classData.schedules[0].end_time}`
                              : 'Chưa có lịch học'}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center'>
                          <MapPin className='w-5 h-5 text-gray-600' />
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>Phòng học</p>
                          <p className='font-medium text-gray-900'>
                            {classData.room}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Cấp độ & Trạng thái
                    </h3>
                    <div className='flex gap-2'>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(
                          classData.course_level
                        )}`}
                      >
                        {classData.course_level === 'A1' && 'A1 - Mất gốc'}
                        {classData.course_level === 'A2' && 'A2 - Sơ cấp'}
                        {classData.course_level === 'B1' && 'B1 - Trung cấp thấp'}
                        {classData.course_level === 'B2' && 'B2 - Trung cấp cao'}
                        {classData.course_level === 'C1' && 'C1 - Nâng cao'}
                      </span>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                          classData.status
                        )}`}
                      >
                        {classData.status === 'active' && 'Đang học'}
                        {classData.status === 'cancelled' && 'Đã hủy'}
                        {classData.status === 'completed' && 'Hoàn thành'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Bài tập</h3>
              <div className='space-y-4'>
                <div className='p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-medium text-gray-900'>
                      Bài tập Unit 5
                    </h4>
                    <span className='px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full'>
                      Hoàn thành
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    Làm bài tập về kỹ năng giao tiếp trong môi trường công sở
                  </p>
                  <div className='flex items-center justify-between text-sm text-gray-500'>
                    <span>Hạn nộp: 20/01/2024</span>
                    <span className='font-medium text-green-600'>
                      Điểm: 9.5/10
                    </span>
                  </div>
                </div>

                <div className='p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-medium text-gray-900'>
                      Bài tập Unit 6
                    </h4>
                    <span className='px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full'>
                      Đang làm
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    Viết bài luận về chủ đề &quot;Technology in Education&quot;
                  </p>
                  <div className='flex items-center justify-between text-sm text-gray-500'>
                    <span>Hạn nộp: 25/01/2024</span>
                    <span className='font-medium text-yellow-600'>
                      Chưa nộp
                    </span>
                  </div>
                </div>

                <div className='p-4 border border-gray-200 rounded-lg'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-medium text-gray-900'>
                      Bài tập Unit 7
                    </h4>
                    <span className='px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full'>
                      Sắp tới
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    Thuyết trình về chủ đề tự chọn
                  </p>
                  <div className='flex items-center justify-between text-sm text-gray-500'>
                    <span>Hạn nộp: 30/01/2024</span>
                    <span className='font-medium text-gray-600'>Chưa mở</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className='space-y-6'>
              <h3 className='text-lg font-semibold text-gray-900'>Lịch học</h3>
              <div className='space-y-4'>
                <div className='p-4 bg-purple-50 border border-purple-200 rounded-lg'>
                  <div className='flex items-center gap-3 mb-2'>
                    <Calendar className='w-5 h-5 text-purple-600' />
                    <span className='font-medium text-gray-900'>
                      Lịch học cố định
                    </span>
                  </div>
                  <p className='text-sm text-gray-600'>
                    {classData.schedules && classData.schedules.length > 0
                      ? classData.schedules.map((s) => s.weekday).join(', ')
                      : 'Chưa có lịch học'}{' '}
                    -{' '}
                    {classData.schedules && classData.schedules.length > 0
                      ? classData.schedules[0].start_time
                      : ''}
                  </p>
                </div>

                <div className='space-y-3'>
                  <h4 className='font-medium text-gray-900'>
                    Các buổi học sắp tới
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          Buổi 25 - Unit 5
                        </p>
                        <p className='text-sm text-gray-600'>
                          Thứ 2, 22/01/2024 - 9:00 AM
                        </p>
                      </div>
                      <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                        Sắp tới
                      </span>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          Buổi 26 - Unit 5
                        </p>
                        <p className='text-sm text-gray-600'>
                          Thứ 4, 24/01/2024 - 9:00 AM
                        </p>
                      </div>
                      <span className='px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full'>
                        Chưa đến
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
