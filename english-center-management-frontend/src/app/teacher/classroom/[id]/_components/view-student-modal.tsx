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
} from 'lucide-react';
import { StudentResponse } from '../../../../../types/staff';
import { useStaffStudentApi } from '../../../../staff/_hooks';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: string;
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

  const mockInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      description: 'Học phí tháng 1/2024',
      amount: 2000000,
      paidAmount: 1500000,
      remainingAmount: 500000,
      paymentStatus: 'partial',
      dueDate: '2024-01-31',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      description: 'Học phí tháng 2/2024',
      amount: 2000000,
      paidAmount: 0,
      remainingAmount: 2000000,
      paymentStatus: 'overdue',
      dueDate: '2024-02-28',
    },
  ];

  // Fetch student data when modal opens
  useEffect(() => {
    if (isOpen && student) {
      const fetchStudentData = async () => {
        try {
          const data = await getStudentById(student);
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

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: 'Đang học',
      inactive: 'Tạm nghỉ',
      pending: 'Chờ phân lớp',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'partial':
        return 'Thanh toán một phần';
      case 'overdue':
        return 'Quá hạn';
      default:
        return status;
    }
  };

  const renderDetailsTab = () => (
    <div className='space-y-6'>
      {/* Student Header */}
      <div className='flex items-start space-x-6 mb-8'>
        <div className='flex-shrink-0'>
          <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl'>
            {getInitials(studentData?.name ?? '')}
          </div>
        </div>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>
            {studentData?.name}
          </h3>

          <div className='flex flex-wrap gap-3'>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                studentData?.status
              )}`}
            >
              {getStatusLabel(studentData?.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-gray-50 rounded-lg p-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Mail className='w-5 h-5 mr-2 text-gray-600' />
            Thông tin liên hệ
          </h4>
          <div className='space-y-3'>
            <div className='flex items-center'>
              <Mail className='w-4 h-4 text-gray-500 mr-3' />
              <span className='text-gray-700'>{studentData?.email}</span>
            </div>
            {studentData?.phone_number && (
              <div className='flex items-center'>
                <Phone className='w-4 h-4 text-gray-500 mr-3' />
                <span className='text-gray-700'>
                  {studentData?.phone_number}
                </span>
              </div>
            )}
            {studentData?.bio && (
              <div className='flex items-start'>
                <MapPin className='w-4 h-4 text-gray-500 mr-3 mt-0.5' />
                <span className='text-gray-700'>{studentData?.bio}</span>
              </div>
            )}
          </div>
        </div>

        <div className='bg-gray-50 rounded-lg p-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Calendar className='w-5 h-5 mr-2 text-gray-600' />
            Thông tin cá nhân
          </h4>
          <div className='space-y-3'>
            {studentData?.date_of_birth && (
              <div className='flex items-center'>
                <Calendar className='w-4 h-4 text-gray-500 mr-3' />
                <span className='text-gray-700'>
                  Ngày sinh: {formatDate(studentData?.date_of_birth)}
                </span>
              </div>
            )}
            <div className='flex items-center'>
              <Clock className='w-4 h-4 text-gray-500 mr-3' />
              <span className='text-gray-700'>
                Ngày tạo: {formatDate(studentData?.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className='bg-gray-50 rounded-lg p-6 mb-8'>
        <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <BookOpen className='w-5 h-5 mr-2 text-gray-600' />
          Lớp học
        </h4>
        <div className=''>
          <div className='space-y-2 flex flex-col'>
            {studentData?.enrollments.map((enrollment, index) => (
              <p className='text-gray-900 font-medium text-sm'>
                {index + 1}: {enrollment.classroom.class_name}
              </p>
            ))}
          </div>
        </div>
      </div>

      {studentData?.parent_name && (
        <div className='bg-gray-50 rounded-lg p-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Users className='w-5 h-5 mr-2 text-gray-600' />
            Liên hệ phụ huynh
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tên
              </label>
              <p className='text-gray-900'>{studentData?.parent_name}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Số điện thoại
              </label>
              <p className='text-gray-900'>{studentData?.parent_phone}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAchievementsTab = () => (
    <div className='space-y-6'>
      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
          <Award className='w-5 h-5 text-yellow-600' />
          <span>Thành tích học tập</span>
        </h3>

        {studentData.scores.length > 0 ? (
          <div className='space-y-4'>
            {studentData.scores.map((achievement) => (
              <div
                key={achievement.id}
                className='bg-white rounded-lg p-4 border border-gray-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-900'>
                    {achievement?.exam?.exam_name}
                  </h4>
                  <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                    {achievement?.exam?.exam_type === 'final'
                      ? 'Cuối kỳ'
                      : achievement?.exam?.exam_type === 'midterm'
                      ? 'Giữa kỳ'
                      : achievement?.exam?.exam_type === 'quiz'
                      ? 'Kiểm tra'
                      : 'Thực hành'}
                  </span>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3'>
                  <div>
                    <span className='text-gray-600'>Điểm tổng:</span>
                    <span className='ml-2 font-medium text-lg text-blue-600'>
                      {achievement?.total_score}/
                      {achievement?.exam?.total_points}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Xếp loại:</span>
                    <span className='ml-2 font-medium text-lg text-green-600'>
                      {achievement.grade}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Ngày thi:</span>
                    <span className='ml-2 font-medium'>
                      {new Date(
                        achievement?.exam?.exam_date
                      ).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className='flex items-center space-x-2'>
                  <TrendingUp className='w-4 h-4 text-green-600' />
                  <span className='text-sm text-green-600 font-medium'>
                    Xuất sắc! Học viên đã hoàn thành bài thi với kết quả tốt
                  </span>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
              <h4 className='font-semibold text-blue-900 mb-2'>Tổng kết</h4>
              <div className='grid grid-cols-3 gap-4 text-sm'>
                <div>
                  <span className='text-blue-600'>Điểm trung bình:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {(
                      studentData.scores.reduce(
                        (sum, ach) => sum + ach.total_score,
                        0
                      ) / studentData.scores.length
                    ).toFixed(1)}
                    /100
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Số bài thi:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {studentData.scores.length}
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Xếp loại cao nhất:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {studentData.scores.reduce(
                      (best, ach) => (ach?.grade < best ? ach?.grade : best),
                      'Z'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-8'>
            <Award className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>Chưa có thành tích học tập</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 !mt-0 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Thông tin học viên
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Tabs */}
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
              onClick={() => setActiveTab('achievements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'achievements'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <Award className='w-4 h-4' />
                <span>Thành tích học tập</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
