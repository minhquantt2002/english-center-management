'use client';

import React, { useState } from 'react';
import {
  User,
  Book,
  Users,
  DollarSign,
  CreditCard,
  FileText,
} from 'lucide-react';
import { mockStudents, mockCourses, mockClasses } from '../../../data';
import Link from 'next/link';

export default function CreateInvoicePage() {
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
    // Handle form submission here
  };

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
