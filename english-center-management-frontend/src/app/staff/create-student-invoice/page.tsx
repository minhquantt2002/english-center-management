'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Book,
  Users,
  DollarSign,
  CreditCard,
  FileText,
} from 'lucide-react';
import { mockStudents, mockCourses, mockClasses } from '../../../data';

export default function CreateInvoiceModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [tuitionFee, setTuitionFee] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');

  // Use mock data
  const students = mockStudents.slice(0, 5).map((student) => student.name);
  const courses = mockCourses.map((course) => course.name);
  const classes = mockClasses.map(
    (classItem) => `${classItem.id} (${classItem.schedule.time})`
  );

  const handleSubmit = () => {
    console.log('Creating invoice with data:', {
      selectedStudent,
      selectedCourse,
      selectedClass,
      tuitionFee,
      paymentMethod,
      notes,
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <button
          onClick={() => setIsOpen(true)}
          className='bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium'
        >
          Mở Form Tạo Hóa Đơn
        </button>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-white'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center'>
                <FileText className='w-5 h-5 text-white' />
              </div>
              <div>
                <h2 className='text-lg font-semibold'>ZENLISH</h2>
                <p className='text-sm text-cyan-100'>Tạo hóa đơn học phí</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-cyan-200 transition-colors'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
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
              {classes.map((classItem, index) => (
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
        <div className='px-6 py-4 bg-gray-50 flex space-x-3'>
          <button
            onClick={() => setIsOpen(false)}
            className='flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className='flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors'
          >
            Tạo hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
}
