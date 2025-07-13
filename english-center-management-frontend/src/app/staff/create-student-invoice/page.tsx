'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Book,
  Users,
  DollarSign,
  CreditCard,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useStaffApi } from '../_hooks/use-api';

export default function CreateInvoicePage() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    loading,
    error,
    getStudents,
    getCourses,
    getClassrooms,
    createInvoice,
  } = useStaffApi();

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsData, coursesData, classroomsData] = await Promise.all([
        getStudents(),
        getCourses(),
        getClassrooms(),
      ]);

      setStudents(studentsData.slice(0, 5).map((student: any) => student.name));
      setCourses(coursesData.map((course: any) => course.name));
      setClassrooms(
        classroomsData.map(
          (classItem: any) => `${classItem.id} (${classItem.schedule.time})`
        )
      );
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const invoiceData = {
        studentId: selectedStudent,
        courseId: selectedCourse,
        classId: selectedClass,
        tuitionFee: parseFloat(tuitionFee),
        paymentMethod,
        notes,
      };

      await createInvoice(invoiceData);
      alert('Hóa đơn đã được tạo thành công!');

      // Reset form
      setSelectedStudent('');
      setSelectedCourse('');
      setSelectedClass('');
      setTuitionFee('');
      setPaymentMethod('cash');
      setNotes('');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Có lỗi xảy ra khi tạo hóa đơn!');
    }
  };

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
            onClick={fetchData}
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
      {/* Main Content */}
      <div className='mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg shadow-sm border'>
          {/* Form Header */}
          <div className='bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 rounded-t-lg'>
            <h2 className='text-lg font-semibold text-white'>
              Thông tin hóa đơn
            </h2>
            <p className='text-sm text-cyan-100'>
              Vui lòng điền đầy đủ thông tin bên dưới
            </p>
          </div>

          {/* Form */}
          <div className='p-6 space-y-6'>
            {/* Chọn học viên */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <User className='w-4 h-4 text-cyan-500' />
                <span>Chọn học viên</span>
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-600'
                required
              >
                <option value=''>-- Chọn học viên --</option>
                {students.map((student, index) => (
                  <option key={index} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn khóa học */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <Book className='w-4 h-4 text-cyan-500' />
                <span>Chọn khóa học</span>
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-600'
                required
              >
                <option value=''>-- Chọn khóa học --</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn lớp */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <Users className='w-4 h-4 text-cyan-500' />
                <span>Chọn lớp</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-600'
                required
              >
                <option value=''>-- Chọn lớp --</option>
                {classrooms.map((classItem, index) => (
                  <option key={index} value={classItem}>
                    {classItem}
                  </option>
                ))}
              </select>
            </div>

            {/* Số tiền */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <DollarSign className='w-4 h-4 text-cyan-500' />
                <span>Số tiền (VNĐ)</span>
              </label>
              <input
                type='text'
                placeholder='Nhập số tiền'
                value={tuitionFee}
                onChange={(e) => setTuitionFee(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400'
                required
              />
            </div>

            {/* Phương thức thanh toán */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <CreditCard className='w-4 h-4 text-cyan-500' />
                <span>Phương thức thanh toán</span>
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='cash'
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500'
                  />
                  <span className='text-sm text-gray-700'>Tiền mặt</span>
                </label>
                <label className='flex items-center space-x-2 cursor-pointer'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    value='transfer'
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-4 h-4 text-cyan-600 border-gray-300 focus:ring-cyan-500'
                  />
                  <span className='text-sm text-gray-700'>Chuyển khoản</span>
                </label>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className='flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3'>
                <FileText className='w-4 h-4 text-cyan-500' />
                <span>Ghi chú</span>
              </label>
              <textarea
                placeholder='Ghi chú thêm...'
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-gray-400 resize-none'
              />
            </div>
          </div>

          {/* Footer */}
          <div className='px-6 py-4 bg-gray-50 rounded-b-lg flex space-x-3'>
            <Link
              href='/staff'
              className='flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center'
            >
              Hủy
            </Link>
            <button
              onClick={handleSubmit}
              className='flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
            >
              Tạo hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
