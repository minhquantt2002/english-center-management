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
  DollarSign,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { StudentProfile } from '@/types';
import { useStaffApi } from '../../_hooks/use-api';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
}

export default function ViewStudentModal({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'achievements' | 'debt'
  >('details');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getStudentAchievements, getStudentInvoices } = useStaffApi();

  // Fetch student data when modal opens
  useEffect(() => {
    if (isOpen && student) {
      const fetchStudentData = async () => {
        setLoading(true);
        try {
          const [achievementsData, invoicesData] = await Promise.all([
            getStudentAchievements(student.id),
            getStudentInvoices(student.id),
          ]);
          setAchievements(achievementsData);
          setInvoices(invoicesData);
        } catch (error) {
          console.error('Error fetching student data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [isOpen, student, getStudentAchievements, getStudentInvoices]);

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

  const getLevelLabel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      beginner: 'Sơ cấp',
      elementary: 'Cơ bản',
      intermediate: 'Trung cấp',
      advanced: 'Nâng cao',
    };
    return levelMap[level] || level;
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

  const getLevelColor = (level: string) => {
    const colorMap: { [key: string]: string } = {
      beginner: 'bg-green-100 text-green-800',
      elementary: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800',
    };
    return colorMap[level] || 'bg-gray-100 text-gray-800';
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

  // Student achievements and invoices data
  const studentAchievements = achievements;
  const studentInvoices = invoices;

  const renderDetailsTab = () => (
    <div className='space-y-6'>
      {/* Student Header */}
      <div className='flex items-start space-x-6 mb-8'>
        <div className='flex-shrink-0'>
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className='w-24 h-24 rounded-full object-cover border-4 border-gray-200'
            />
          ) : (
            <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl'>
              {getInitials(student.name)}
            </div>
          )}
        </div>
        <div className='flex-1'>
          <h3 className='text-2xl font-bold text-gray-900 mb-2'>
            {student.name}
          </h3>
          <p className='text-gray-600 mb-4'>Mã học viên: {student.studentId}</p>

          <div className='flex flex-wrap gap-3'>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getLevelColor(
                student.level
              )}`}
            >
              {getLevelLabel(student.level)}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                student.enrollmentStatus
              )}`}
            >
              {getStatusLabel(student.enrollmentStatus)}
            </span>
            {student.streak && (
              <span className='px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800'>
                🔥 {student.streak} ngày liên tiếp
              </span>
            )}
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
              <span className='text-gray-700'>{student.email}</span>
            </div>
            {student.phone && (
              <div className='flex items-center'>
                <Phone className='w-4 h-4 text-gray-500 mr-3' />
                <span className='text-gray-700'>{student.phone}</span>
              </div>
            )}
            {student.address && (
              <div className='flex items-start'>
                <MapPin className='w-4 h-4 text-gray-500 mr-3 mt-0.5' />
                <span className='text-gray-700'>{student.address}</span>
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
            {student.dateOfBirth && (
              <div className='flex items-center'>
                <Calendar className='w-4 h-4 text-gray-500 mr-3' />
                <span className='text-gray-700'>
                  Ngày sinh: {formatDate(student.dateOfBirth)}
                </span>
              </div>
            )}
            <div className='flex items-center'>
              <Clock className='w-4 h-4 text-gray-500 mr-3' />
              <span className='text-gray-700'>
                Ngày nhập học: {formatDate(student.enrollmentDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className='bg-gray-50 rounded-lg p-6 mb-8'>
        <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
          <BookOpen className='w-5 h-5 mr-2 text-gray-600' />
          Thông tin học tập
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Lớp hiện tại
            </label>
            <p className='text-gray-900 font-medium'>
              {student.currentClass || 'Chưa phân lớp'}
            </p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Trình độ
            </label>
            <span
              className={`px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(
                student.level
              )}`}
            >
              {getLevelLabel(student.level)}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      {student.emergencyContact && (
        <div className='bg-gray-50 rounded-lg p-6'>
          <h4 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Users className='w-5 h-5 mr-2 text-gray-600' />
            Liên hệ khẩn cấp
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tên
              </label>
              <p className='text-gray-900'>{student.emergencyContact.name}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Số điện thoại
              </label>
              <p className='text-gray-900'>{student.emergencyContact.phone}</p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mối quan hệ
              </label>
              <p className='text-gray-900'>
                {student.emergencyContact.relationship}
              </p>
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

        {mockAchievements.length > 0 ? (
          <div className='space-y-4'>
            {mockAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className='bg-white rounded-lg p-4 border border-gray-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-900'>
                    {achievement.courseName}
                  </h4>
                  <span className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
                    {achievement.testType === 'final'
                      ? 'Cuối kỳ'
                      : achievement.testType === 'midterm'
                      ? 'Giữa kỳ'
                      : achievement.testType === 'quiz'
                      ? 'Kiểm tra'
                      : 'Thực hành'}
                  </span>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3'>
                  <div>
                    <span className='text-gray-600'>Điểm tổng:</span>
                    <span className='ml-2 font-medium text-lg text-blue-600'>
                      {achievement.overall}/100
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Xếp loại:</span>
                    <span className='ml-2 font-medium text-lg text-green-600'>
                      {achievement.gradeLevel}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Ngày thi:</span>
                    <span className='ml-2 font-medium'>
                      {new Date(achievement.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Giáo viên:</span>
                    <span className='ml-2 font-medium'>
                      {achievement.teacherName}
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
                      mockAchievements.reduce(
                        (sum, ach) => sum + ach.overall,
                        0
                      ) / mockAchievements.length
                    ).toFixed(1)}
                    /100
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Số bài thi:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {mockAchievements.length}
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Xếp loại cao nhất:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {mockAchievements.reduce(
                      (best, ach) =>
                        ach.gradeLevel < best ? ach.gradeLevel : best,
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

  const renderDebtTab = () => (
    <div className='space-y-6'>
      <div className='bg-gray-50 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
          <DollarSign className='w-5 h-5 text-red-600' />
          <span>Thông tin công nợ</span>
        </h3>

        {mockInvoices.length > 0 ? (
          <div className='space-y-4'>
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className='bg-white rounded-lg p-4 border border-gray-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h4 className='font-semibold text-gray-900'>
                    {invoice.invoiceNumber}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                      invoice.paymentStatus
                    )}`}
                  >
                    {getPaymentStatusText(invoice.paymentStatus)}
                  </span>
                </div>
                <p className='text-gray-600 mb-3'>{invoice.description}</p>
                <div className='grid grid-cols-2 gap-4 text-sm mb-3'>
                  <div>
                    <span className='text-gray-600'>Tổng tiền:</span>
                    <span className='ml-2 font-medium'>
                      {invoice.amount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Đã thanh toán:</span>
                    <span className='ml-2 font-medium text-green-600'>
                      {invoice.paidAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Còn nợ:</span>
                    <span className='ml-2 font-medium text-red-600'>
                      {invoice.remainingAmount.toLocaleString('vi-VN')} VNĐ
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Hạn thanh toán:</span>
                    <span className='ml-2 font-medium'>
                      {new Date(invoice.dueDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                {invoice.paymentStatus === 'overdue' && (
                  <div className='bg-red-50 border border-red-200 rounded p-3'>
                    <p className='text-red-700 text-sm font-medium'>
                      ⚠️ Quá hạn thanh toán
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Summary */}
            <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
              <h4 className='font-semibold text-blue-900 mb-2'>Tổng kết</h4>
              <div className='grid grid-cols-3 gap-4 text-sm'>
                <div>
                  <span className='text-blue-600'>Tổng nợ:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {mockInvoices
                      .reduce((sum, inv) => sum + inv.remainingAmount, 0)
                      .toLocaleString('vi-VN')}{' '}
                    VNĐ
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Đã thanh toán:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {mockInvoices
                      .reduce((sum, inv) => sum + inv.paidAmount, 0)
                      .toLocaleString('vi-VN')}{' '}
                    VNĐ
                  </span>
                </div>
                <div>
                  <span className='text-blue-600'>Số hóa đơn:</span>
                  <span className='ml-2 font-medium text-blue-900'>
                    {mockInvoices.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-8'>
            <DollarSign className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>Không có thông tin công nợ</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
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
            <button
              onClick={() => setActiveTab('debt')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'debt'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className='flex items-center space-x-2'>
                <DollarSign className='w-4 h-4' />
                <span>Công nợ</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
          {activeTab === 'debt' && renderDebtTab()}
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
