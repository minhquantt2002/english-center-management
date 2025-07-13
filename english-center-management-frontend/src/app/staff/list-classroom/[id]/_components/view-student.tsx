'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Clock,
  Award,
  Shield,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Student, Invoice, Payment } from '../../../../../types';

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export default function ViewStudentModal({
  isOpen,
  onClose,
  student,
}: ViewStudentModalProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'achievements' | 'debt'
  >('details');

  if (!isOpen || !student) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'upper-intermediate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      case 'upper-intermediate':
        return 'Trung cấp cao';
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
        return 'Đã tốt nghiệp';
      default:
        return status;
    }
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

  // Mock data for achievements and debt (replace with real data later)
  const mockAchievements = [
    {
      id: '1',
      courseName: 'Tiếng Anh Cơ bản A1',
      testType: 'final',
      date: '2024-01-15',
      overall: 85,
      gradeLevel: 'A',
      teacherName: 'Nguyễn Thị Hoa',
    },
    {
      id: '2',
      courseName: 'Tiếng Anh Trung cấp B1',
      testType: 'midterm',
      date: '2024-02-20',
      overall: 78,
      gradeLevel: 'B',
      teacherName: 'Trần Văn Minh',
    },
  ];

  const mockInvoices = [
    {
      id: '1',
      studentId: student.studentId,
      amount: 5000000,
      paidAmount: 3000000,
      remainingAmount: 2000000,
      paymentStatus: 'partial',
      dueDate: '2024-03-15',
      invoiceNumber: 'INV-2024-001',
      description: 'Học phí khóa học Tiếng Anh Cơ bản',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      studentId: student.studentId,
      amount: 3000000,
      paidAmount: 0,
      remainingAmount: 3000000,
      paymentStatus: 'pending',
      dueDate: '2024-04-15',
      invoiceNumber: 'INV-2024-002',
      description: 'Học phí khóa học Tiếng Anh Trung cấp',
      createdAt: '2024-02-01',
    },
  ];

  const renderDetailsTab = () => (
    <div className='space-y-6'>
      {/* Student Header */}
      <div className='flex items-start space-x-6 mb-8'>
        <img
          className='h-24 w-24 rounded-full border-4 border-gray-200'
          src={
            student.avatar ||
            `https://ui-avatars.com/api/?name=${student.name}&background=0D9488&color=fff&size=96`
          }
          alt={student.name}
        />
        <div className='flex-1'>
          <div className='flex items-center space-x-3 mb-2'>
            <h1 className='text-2xl font-bold text-gray-900'>{student.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                student.status
              )}`}
            >
              {getStatusText(student.status)}
            </span>
          </div>
          <p className='text-lg text-gray-600 mb-2'>
            Mã số: {student.studentId}
          </p>
          <div className='flex items-center space-x-4 text-sm text-gray-500'>
            <span className='flex items-center space-x-1'>
              <Mail className='w-4 h-4' />
              <span>{student.email}</span>
            </span>
            <span className='flex items-center space-x-1'>
              <Phone className='w-4 h-4' />
              <span>{student.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Personal Information */}
        <div className='space-y-6'>
          <div className='bg-gray-50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
              <User className='w-5 h-5 text-cyan-600' />
              <span>Thông tin cá nhân</span>
            </h3>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Họ và tên:</span>
                <span className='font-medium'>{student.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Ngày sinh:</span>
                <span className='font-medium'>
                  {student.dateOfBirth
                    ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Trình độ:</span>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded-full ${getLevelColor(
                    student.level
                  )}`}
                >
                  {getLevelText(student.level)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Ngày nhập học:</span>
                <span className='font-medium'>
                  {new Date(student.enrollmentDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {student.address && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Địa chỉ:</span>
                  <span className='font-medium text-right max-w-xs'>
                    {student.address}
                  </span>
                </div>
              )}
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
                  {student.currentClass || 'Chưa phân lớp'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Trạng thái:</span>
                <span
                  className={`px-2 py-1 text-sm font-medium rounded-full ${getStatusColor(
                    student.status
                  )}`}
                >
                  {getStatusText(student.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className='space-y-6'>
          {/* Contact Details */}
          <div className='bg-gray-50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
              <Phone className='w-5 h-5 text-green-600' />
              <span>Thông tin liên hệ</span>
            </h3>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Email:</span>
                <span className='font-medium'>{student.email}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Số điện thoại:</span>
                <span className='font-medium'>{student.phone}</span>
              </div>
              {student.parentContact && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Liên hệ phụ huynh:</span>
                  <span className='font-medium'>{student.parentContact}</span>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {student.emergencyContact && (
            <div className='bg-gray-50 rounded-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
                <Shield className='w-5 h-5 text-red-600' />
                <span>Liên hệ khẩn cấp</span>
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tên:</span>
                  <span className='font-medium'>
                    {student.emergencyContact.name}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Số điện thoại:</span>
                  <span className='font-medium'>
                    {student.emergencyContact.phone}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Mối quan hệ:</span>
                  <span className='font-medium'>
                    {student.emergencyContact.relationship}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className='bg-gray-50 rounded-lg p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2'>
              <Clock className='w-5 h-5 text-purple-600' />
              <span>Thông tin bổ sung</span>
            </h3>
            <div className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Ngày tạo:</span>
                <span className='font-medium'>
                  {student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString('vi-VN')
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Cập nhật lần cuối:</span>
                <span className='font-medium'>
                  {student.updatedAt
                    ? new Date(student.updatedAt).toLocaleDateString('vi-VN')
                    : 'N/A'}
                </span>
              </div>
              {student.notes && (
                <div>
                  <span className='text-gray-600 block mb-2'>Ghi chú:</span>
                  <p className='text-sm bg-white p-3 rounded border'>
                    {student.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      achievement.gradeLevel === 'A'
                        ? 'bg-green-100 text-green-800'
                        : achievement.gradeLevel === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : achievement.gradeLevel === 'C'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {achievement.gradeLevel}
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-600'>Loại bài thi:</span>
                    <span className='ml-2 font-medium capitalize'>
                      {achievement.testType}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-600'>Điểm tổng:</span>
                    <span className='ml-2 font-medium'>
                      {achievement.overall}/100
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
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-8'>
            <Award className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>Chưa có thành tích học tập nào</p>
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
      <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-cyan-100 rounded-lg'>
              <User className='w-6 h-6 text-cyan-600' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Thông tin học viên
              </h2>
              <p className='text-sm text-gray-600'>
                {student.name} - {student.studentId}
              </p>
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
            className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
