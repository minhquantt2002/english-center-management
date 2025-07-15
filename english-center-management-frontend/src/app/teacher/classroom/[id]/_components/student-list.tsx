import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle,
  Star,
} from 'lucide-react';
import { EnrollmentNested } from '../../../../../types/teacher';

interface StudentListProps {
  students: EnrollmentNested[];
}

const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (student) =>
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStudentCard = (student: EnrollmentNested) => (
    <div
      key={student.id}
      className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow'
    >
      <div className='flex items-start space-x-3'>
        <img
          src={student.student.avatar}
          alt={student.student.name}
          className='w-12 h-12 rounded-full'
        />
        <div className='flex-1 min-w-0'>
          <h4 className='text-sm font-semibold text-gray-900 truncate'>
            {student.student.name}
          </h4>
          <p className='text-xs text-gray-500 truncate'>
            {student.student.email}
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='p-1 text-gray-400 hover:text-gray-600'>
            <Phone className='w-4 h-4' />
          </button>
          <button className='p-1 text-gray-400 hover:text-gray-600'>
            <Mail className='w-4 h-4' />
          </button>
          <button className='p-1 text-gray-400 hover:text-gray-600'>
            <MoreVertical className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='relative'>
            <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm học viên...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
            />
          </div>
          <button className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
            <Filter className='w-4 h-4 mr-2' />
            Lọc
          </button>
        </div>
        <button className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'>
          <Plus className='w-4 h-4 mr-2' />
          Thêm học viên
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredStudents.map(renderStudentCard)}
      </div>
    </div>
  );
};

export default StudentList;
