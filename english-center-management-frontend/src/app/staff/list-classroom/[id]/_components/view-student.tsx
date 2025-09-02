'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Award,
  Calendar,
  MessageCircle,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ScoreNested, StudentResponse } from '../../../../../types/staff';
import { useStaffStudentApi } from '../../../_hooks';
import { HomeworkStatus } from '../../../../teacher/_hooks/use-homework';
import { LRSkillBand, LSRWSkillBand } from '../../../../teacher/exam/[id]/page';
import { getInitials } from '../../../list-teacher/page';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  classroomId: string;
}

export const getScoreColor = (score: number | null) => {
  if (score === null) return 'text-gray-400';
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBackground = (score: number | null) => {
  if (score === null) return 'bg-gray-50';
  if (score >= 8) return 'bg-green-50';
  if (score >= 6) return 'bg-yellow-50';
  return 'bg-red-50';
};

export default function ViewStudentModal({
  isOpen,
  onClose,
  studentId,
  classroomId,
}: ViewStudentModalProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'scores' | 'homeworks' | 'attendances'
  >('details');
  const { getStudentById } = useStaffStudentApi();
  const [student, setStudent] = useState<StudentResponse | null>(null);
  const [scores, setScores] = useState<ScoreNested | null>(null);

  useEffect(() => {
    if (isOpen && studentId) {
      const fetchStudentData = async () => {
        try {
          const studentData = await getStudentById(studentId);
          setStudent(studentData);
          setScores(
            studentData.enrollments.find((v) => v.classroom.id === classroomId)
              ?.score[0]
          );
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };

      fetchStudentData();
    }
  }, [isOpen, studentId, getStudentById]);

  if (!isOpen || !studentId) return null;

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

  const getLevelText = (level: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'graduated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Đang học';
      case 'inactive':
        return 'Không hoạt động';
      case 'suspended':
        return 'Tạm đình chỉ';
      case 'graduated':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  const renderDetailsTab = () => (
    <div className='space-y-6'>
      {/* Student Header */}
      <div className='flex items-start space-x-6 mb-4'>
        <div className='h-12 w-12 flex-shrink-0'>
          <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg'>
            {getInitials(student ? student?.name?.charAt(0) : '')}
          </div>
        </div>
        <div className='flex-1'>
          <div className='flex items-center space-x-3 mb-2'>
            <h1 className='text-xl font-bold text-gray-900'>{student?.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                student?.status || 'active'
              )}`}
            >
              {getStatusText(student?.status || 'active')}
            </span>
          </div>
          <div className='flex items-center space-x-4 text-sm text-gray-500'>
            <span className='flex items-center space-x-1'>
              <Mail className='w-4 h-4' />
              <span>{student?.email}</span>
            </span>
            <span className='flex items-center space-x-1'>
              <Phone className='w-4 h-4' />
              <span>{student?.phone_number}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Personal Information */}
        <div className='bg-gray-50 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
            <User className='w-5 h-5 text-cyan-600' />
            <span>Thông tin cá nhân</span>
          </h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Họ và tên:</span>
              <span className='font-medium'>{student?.name}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Ngày sinh:</span>
              <span className='font-medium'>
                {student?.date_of_birth
                  ? new Date(student?.date_of_birth).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Trình độ:</span>
              <span
                className={`px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(
                  student?.input_level
                )}`}
              >
                {getLevelText(student?.input_level)}
              </span>
            </div>
            {student?.bio && (
              <div className='flex justify-between'>
                <span className='text-gray-600'>Địa chỉ:</span>
                <span className='font-medium text-right max-w-xs'>
                  {student?.bio}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className='bg-gray-50 rounded-lg p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
            <Phone className='w-5 h-5 text-green-600' />
            <span>Thông tin liên hệ</span>
          </h3>
          <div className='space-y-4'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Email:</span>
              <span className='font-medium'>{student?.email}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Số điện thoại:</span>
              <span className='font-medium'>{student?.phone_number}</span>
            </div>
            {student?.parent_name && (
              <div className='flex justify-between'>
                <span className='text-gray-600'>Liên hệ phụ huynh:</span>
                <span className='font-medium'>{student?.parent_name}</span>
              </div>
            )}
            {student?.parent_phone && (
              <div className='flex justify-between'>
                <span className='text-gray-600'>Số điện thoại phụ huynh:</span>
                <span className='font-medium'>{student?.parent_phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
          <BookOpen className='w-5 h-5 text-blue-600' />
          <span>Thông tin học tập</span>
        </h3>
        <div className='space-y-4'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>Lớp hiện tại:</span>
            <span className='font-medium'>
              {student?.enrollments
                .reduce((acc, enrollment) => {
                  if (enrollment.classroom) {
                    acc.push(enrollment.classroom.class_name);
                  }
                  return acc;
                }, [])
                .join(', ') || 'Chưa phân lớp'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScoresTab = () => {
    const courseLevel = student?.enrollments?.find(
      (v) => v.classroom.id === classroomId
    )?.classroom?.course_level;

    const skills = !['A1', 'A2', 'B1', 'B2'].includes(
      courseLevel?.toUpperCase()
    )
      ? ['speaking', 'writing']
      : ['listening', 'reading'];

    const skillBands = ['A1', 'A2', 'B1', 'B2'].includes(
      courseLevel?.toUpperCase()
    )
      ? LRSkillBand
      : LSRWSkillBand;

    return (
      <div className='space-y-6'>
        {scores ? (
          <div className='space-y-6'>
            <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    Tổng quan điểm số
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Kết quả đánh giá các kỹ năng
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 md:grid-cols-2 gap-8'>
                {[
                  { key: 'listening', label: 'Nghe', icon: '🎧' },
                  { key: 'reading', label: 'Đọc', icon: '📖' },
                  { key: 'speaking', label: 'Nói', icon: '🗣️' },
                  { key: 'writing', label: 'Viết', icon: '✍️' },
                ]
                  .filter((skill) => skills.includes(skill.key))
                  .map((skill) => {
                    const score =
                      scores?.[
                        skill.key as keyof Omit<ScoreNested, 'id' | 'feedback'>
                      ] || null;
                    return (
                      <div
                        key={skill.key}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreBackground(
                          score
                        )} hover:shadow-md`}
                      >
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>{skill.icon}</div>
                          <p className='text-sm font-medium text-gray-700 mb-1'>
                            {skill.label}
                          </p>
                          <p
                            className={`text-2xl font-bold ${getScoreColor(
                              score
                            )}`}
                          >
                            {score ? score : '--'}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            / {skillBands[skill.key]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Feedback Section */}
            {scores.feedback && (
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200'>
                <div className='flex items-start gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1'>
                    <MessageCircle className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      Nhận xét từ giáo viên
                    </h4>
                    <p className='text-gray-700 leading-relaxed'>
                      {scores.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Award className='w-8 h-8 text-gray-400' />
            </div>
            <h4 className='text-lg font-medium text-gray-900 mb-2'>
              Chưa có điểm số
            </h4>
            <p className='text-gray-500'>
              Điểm số sẽ được cập nhật sau khi giáo viên chấm bài và đánh giá.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderHomeworksTab = () => (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
          <BookOpen className='w-4 h-4 text-blue-600' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>
          Danh sách bài tập
        </h3>
        <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
          {student?.homeworks?.length || 0} bài tập
        </span>
      </div>

      <div className='space-y-4'>
        {student?.homeworks && student?.homeworks.length > 0 ? (
          student?.homeworks
            .sort(
              (a, b) =>
                new Date(b.session.created_at).getTime() -
                new Date(a.session.created_at).getTime()
            )
            .map((homework) => (
              <div
                key={homework.id}
                className='group p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center'>
                      <FileText className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 group-hover:text-purple-700 transition-colors'>
                        {homework.session.topic}
                      </h4>
                      <div className='flex items-center gap-2 mt-1'>
                        <Calendar className='w-3 h-3 text-gray-400' />
                        <span className='text-xs text-gray-500'>
                          Buổi học: #{homework.session.id.substring(0, 5)} -{' '}
                          {new Date(homework.session.created_at).toLocaleString(
                            'vi-VN',
                            {
                              timeZone: 'Asia/Ho_Chi_Minh',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        homework.status
                      )}`}
                    >
                      {homework.status === HomeworkStatus.PASSED
                        ? 'Đạt'
                        : homework.status === HomeworkStatus.PENDING
                        ? 'Chờ đánh giá'
                        : 'Không đạt'}
                    </span>
                    {homework.status === HomeworkStatus.PASSED ? (
                      <CheckCircle className='w-4 h-4 text-green-500' />
                    ) : homework.status === HomeworkStatus.FAILED ? (
                      <XCircle className='w-4 h-4 text-red-500' />
                    ) : (
                      <Clock className='w-4 h-4 text-yellow-500' />
                    )}
                  </div>
                </div>

                <div className='mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400'>
                  <div className='flex items-start gap-2'>
                    <MessageCircle className='w-4 h-4 text-blue-600 mt-0.5' />
                    <div>
                      <p className='text-sm font-medium text-blue-900 mb-1'>
                        Phản hồi từ giáo viên:
                      </p>
                      <p className='text-sm text-blue-800'>
                        {homework.feedback
                          ? homework.feedback
                          : 'Chưa đánh giá'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <BookOpen className='w-8 h-8 text-gray-400' />
            </div>
            <h4 className='text-lg font-medium text-gray-900 mb-2'>
              Chưa có bài tập nào
            </h4>
            <p className='text-gray-500'>
              Bài tập về nhà sẽ được hiển thị ở đây khi giáo viên giao bài.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAttendancesTab = () => (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
          <Calendar className='w-4 h-4 text-green-600' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>
          Lịch sử điểm danh
        </h3>
        <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
          {student?.attendances?.length || 0} buổi học
        </span>
      </div>

      <div className='space-y-4'>
        {student?.attendances && student?.attendances.length > 0 ? (
          student?.attendances
            .sort(
              (a, b) =>
                new Date(b.session.created_at).getTime() -
                new Date(a.session.created_at).getTime()
            )
            .map((attendance) => (
              <div
                key={attendance.id}
                className='group p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center'>
                      <Calendar className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 group-hover:text-green-700 transition-colors'>
                        {attendance.session.topic}
                      </h4>
                      <div className='flex items-center gap-2 mt-1'>
                        <Clock className='w-3 h-3 text-gray-400' />
                        <span className='text-xs text-gray-500'>
                          Buổi học: #{attendance.session.id.substring(0, 5)} -{' '}
                          {new Date(
                            attendance.session.created_at
                          ).toLocaleString('vi-VN', {
                            timeZone: 'Asia/Ho_Chi_Minh',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    {attendance.is_present ? (
                      <>
                        <span className='px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200'>
                          Có mặt
                        </span>
                        <CheckCircle className='w-4 h-4 text-green-500' />
                      </>
                    ) : (
                      <>
                        <span className='px-3 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200'>
                          Vắng mặt
                        </span>
                        <XCircle className='w-4 h-4 text-red-500' />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Calendar className='w-8 h-8 text-gray-400' />
            </div>
            <h4 className='text-lg font-medium text-gray-900 mb-2'>
              Chưa có dữ liệu điểm danh
            </h4>
            <p className='text-gray-500'>
              Lịch sử điểm danh sẽ được hiển thị ở đây sau các buổi học.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-cyan-100 rounded-lg'>
              <User className='w-5 h-5 text-cyan-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Thông tin học viên
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200'>
          <div className='flex space-x-8 px-6'>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <User className='w-4 h-4' />
                <span>Thông tin chi tiết</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'scores'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <Award className='w-4 h-4' />
                <span>Điểm khoá học</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('attendances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'attendances'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <Calendar className='w-4 h-4' />
                <span>Điểm danh</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('homeworks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'homeworks'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <Calendar className='w-4 h-4' />
                <span>Bài tập về nhà</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'scores' && renderScoresTab()}
          {activeTab === 'attendances' && renderAttendancesTab()}
          {activeTab === 'homeworks' && renderHomeworksTab()}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
