'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Clock,
  User,
  Award,
  TrendingUp,
  GraduationCap,
} from 'lucide-react';
import { StudentResponse } from '../../../../types/staff';
import { useStaffStudentApi } from '../../_hooks';
import { LRSkillBand, LSRWSkillBand } from '../../../teacher/exam/[id]/page';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentResponse | null;
}

export default function ViewStudentModal({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'achievements' | 'debt'
  >('details');
  const [studentData, setStudentData] = useState<StudentResponse | null>(null);
  const { getStudentById } = useStaffStudentApi();

  useEffect(() => {
    if (isOpen && student) {
      const fetchStudentData = async () => {
        try {
          const data = await getStudentById(student.id);
          setStudentData(data);
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };

      fetchStudentData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, student, getStudentById]);

  if (!isOpen || !student) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderDetailsTab = () => (
    <div className='space-y-6'>
      {/* Student Header */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg'>
            {getInitials(studentData?.name.charAt(0) || '')}
          </div>
          <div className='flex-1'>
            <h3 className='text-2xl font-bold text-gray-900 mb-1'>
              {studentData?.name}
            </h3>
            <div className='flex items-center gap-3'>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  'active'
                )}`}
              >
                Đang học
              </span>
              <span className='text-sm text-gray-600'>
                #{studentData?.id.substring(0, 5)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <Mail className='w-5 h-5 text-blue-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900'>
              Thông tin liên hệ
            </h4>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Mail className='w-4 h-4 text-gray-500' />
              <div>
                <p className='text-xs text-gray-500 uppercase tracking-wide'>
                  Email
                </p>
                <p className='text-gray-900 font-medium'>
                  {studentData?.email}
                </p>
              </div>
            </div>
            {studentData?.phone_number && (
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <Phone className='w-4 h-4 text-gray-500' />
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide'>
                    Số điện thoại
                  </p>
                  <p className='text-gray-900 font-medium'>
                    {studentData?.phone_number}
                  </p>
                </div>
              </div>
            )}
            {studentData?.bio && (
              <div className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg'>
                <MapPin className='w-4 h-4 text-gray-500 mt-1' />
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide'>
                    Thông tin thêm
                  </p>
                  <p className='text-gray-900'>{studentData?.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
              <Calendar className='w-5 h-5 text-green-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900'>
              Thông tin cá nhân
            </h4>
          </div>
          <div className='space-y-4'>
            {studentData?.date_of_birth && (
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <Calendar className='w-4 h-4 text-gray-500' />
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wide'>
                    Ngày sinh
                  </p>
                  <p className='text-gray-900 font-medium'>
                    {formatDate(studentData?.date_of_birth)}
                  </p>
                </div>
              </div>
            )}
            <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
              <Clock className='w-4 h-4 text-gray-500' />
              <div>
                <p className='text-xs text-gray-500 uppercase tracking-wide'>
                  Ngày đăng ký
                </p>
                <p className='text-gray-900 font-medium'>
                  {formatDate(studentData?.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
            <GraduationCap className='w-5 h-5 text-purple-600' />
          </div>
          <h4 className='text-lg font-semibold text-gray-900'>
            Thông tin học tập
          </h4>
          <span className='px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full'>
            {studentData?.enrollments?.length || 0} lớp học
          </span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {studentData?.enrollments?.map((enrollment) => (
            <div
              key={enrollment.id}
              className='group p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-purple-200 transition-all duration-200'
            >
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center'>
                  <BookOpen className='w-4 h-4 text-purple-600' />
                </div>
                <div className='flex-1'>
                  <h5 className='font-semibold text-gray-900 group-hover:text-purple-700 transition-colors'>
                    {enrollment.classroom.class_name}
                  </h5>
                  <p className='text-xs text-gray-500'>
                    #{enrollment.classroom.id.substring(0, 5)}
                  </p>
                </div>
              </div>
              <div className='ml-11'>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    enrollment.status || 'active'
                  )}`}
                >
                  {enrollment.status === 'active'
                    ? 'Đang học'
                    : enrollment.status === 'completed'
                    ? 'Hoàn thành'
                    : 'Đã huỷ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contact */}
      {studentData?.parent_name && (
        <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Users className='w-5 h-5 text-orange-600' />
            </div>
            <h4 className='text-lg font-semibold text-gray-900'>
              Thông tin liên hệ khẩn cấp
            </h4>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='flex items-center gap-2 mb-2'>
                <User className='w-4 h-4 text-orange-600' />
                <p className='text-sm font-medium text-orange-800'>Họ và tên</p>
              </div>
              <p className='text-gray-900 font-semibold'>
                {studentData?.parent_name}
              </p>
            </div>
            <div className='p-4 bg-orange-50 rounded-lg border border-orange-200'>
              <div className='flex items-center gap-2 mb-2'>
                <Phone className='w-4 h-4 text-orange-600' />
                <p className='text-sm font-medium text-orange-800'>
                  Số điện thoại
                </p>
              </div>
              <p className='text-gray-900 font-semibold'>
                {studentData?.parent_phone}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievementsTab = () => (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg flex items-center justify-center'>
          <Award className='w-5 h-5 text-orange-600' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>
          Thành tích học tập
        </h3>
        <span className='px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full'>
          {studentData?.enrollments?.length || 0} kết quả
        </span>
      </div>

      {studentData?.enrollments && studentData.enrollments.length > 0 ? (
        <div className='space-y-4'>
          {studentData.enrollments.map((enrollment) => {
            const skills = !['A1', 'A2', 'B1', 'B2'].includes(
              enrollment.classroom.course_level.toUpperCase()
            )
              ? ['speaking', 'writing']
              : ['listening', 'reading'];

            const selectedSkillBands = ['A1', 'A2', 'B1', 'B2'].includes(
              enrollment.classroom.course_level.toUpperCase()
            )
              ? LRSkillBand
              : LSRWSkillBand;
            return (
              <div
                key={enrollment.id}
                className='group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center'>
                      <GraduationCap className='w-6 h-6 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 group-hover:text-purple-700 transition-colors'>
                        {enrollment?.classroom.class_name}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        #{enrollment.classroom.id.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-8 mb-4'>
                  {skills.includes('listening') && (
                    <div className='text-center p-3 bg-blue-50 rounded-lg'>
                      <div className='text-lg font-bold text-blue-600 mb-1'>
                        {enrollment.score[0].listening || '--'} /{' '}
                        {selectedSkillBands.listening}
                      </div>
                      <div className='text-xs text-gray-600'>Nghe</div>
                    </div>
                  )}

                  {skills.includes('reading') && (
                    <div className='text-center p-3 bg-green-50 rounded-lg'>
                      <div className='text-lg font-bold text-green-600 mb-1'>
                        {enrollment.score[0].reading || '--'} /{' '}
                        {selectedSkillBands.reading}
                      </div>
                      <div className='text-xs text-gray-600'>Đọc</div>
                    </div>
                  )}

                  {skills.includes('speaking') && (
                    <div className='text-center p-3 bg-orange-50 rounded-lg'>
                      <div className='text-lg font-bold text-orange-600 mb-1'>
                        {enrollment.score[0].speaking || '--'} /{' '}
                        {(selectedSkillBands as any).speaking}
                      </div>
                      <div className='text-xs text-gray-600'>Nói</div>
                    </div>
                  )}

                  {skills.includes('writing') && (
                    <div className='text-center p-3 bg-purple-50 rounded-lg'>
                      <div className='text-lg font-bold text-purple-600 mb-1'>
                        {enrollment.score[0].writing || '--'} /{' '}
                        {(selectedSkillBands as any).writing}
                      </div>
                      <div className='text-xs text-gray-600'>Viết</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Award className='w-8 h-8 text-gray-400' />
          </div>
          <h4 className='text-lg font-medium text-gray-900 mb-2'>
            Chưa có thành tích học tập
          </h4>
          <p className='text-gray-500'>
            Thành tích và điểm số sẽ được hiển thị ở đây khi học viên hoàn thành
            các bài kiểm tra.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <User className='w-5 h-5 text-blue-600' />
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>
              Thông tin học viên
            </h2>
          </div>
          <button
            onClick={onClose}
            className='w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200 bg-gray-50'>
          <div className='flex px-6'>
            {[
              { id: 'details', label: 'Thông tin chi tiết', icon: User },
              { id: 'achievements', label: 'Thành tích học tập', icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-gray-50'>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>

        <div className='flex items-center justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
