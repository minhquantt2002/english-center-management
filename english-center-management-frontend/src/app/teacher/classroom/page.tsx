import React from 'react';
import {
  Search,
  Users,
  Clock,
  Star,
  Calendar,
  MapPin,
  Book,
  ChevronDown,
} from 'lucide-react';
import { mockClasses, mockStudents } from '../../../data';
import { ClassData } from '../../../types';

interface Student {
  id: string;
  name: string;
  avatar: string;
}

interface LocalClassData {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Test Prep';
  students: number;
  schedule: string;
  room: string;
  building: string;
  unit: string;
  studentAvatars: Student[];
  levelColor: string;
}

const MyClassesDashboard = () => {
  const stats = [
    {
      icon: Book,
      label: 'Total Classes',
      value: mockClasses.length.toString(),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: mockStudents.length.toString(),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      icon: Clock,
      label: 'Hours/Week',
      value: '24',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      icon: Star,
      label: 'Avg Rating',
      value: '4.8',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  // Use mock classes data
  const classes: LocalClassData[] = mockClasses.map(
    (classItem: ClassData, index: number) => {
      const levelMap = {
        beginner: 'Beginner' as const,
        intermediate: 'Intermediate' as const,
        advanced: 'Advanced' as const,
        upper_intermediate: 'Advanced' as const,
      };

      const colorMap = {
        beginner: 'bg-green-100 text-green-700',
        intermediate: 'bg-blue-100 text-blue-700',
        advanced: 'bg-purple-100 text-purple-700',
        upper_intermediate: 'bg-orange-100 text-orange-700',
      };

      // Get first 3 students as avatars
      const studentAvatars = mockStudents
        .slice(index * 3, index * 3 + 3)
        .map((student) => ({
          id: student.id,
          name: student.name,
          avatar: student.avatar || '',
        }));

      return {
        id: classItem.id,
        title: classItem.name,
        level:
          levelMap[classItem.level as keyof typeof levelMap] || 'Intermediate',
        students: classItem.students,
        schedule: classItem.schedule.time,
        room: classItem.room || 'Room 101',
        building: 'Building A',
        unit: `Unit ${index + 1}: Course Content`,
        studentAvatars,
        levelColor:
          colorMap[classItem.level as keyof typeof colorMap] ||
          'bg-blue-100 text-blue-700',
      };
    }
  );

  const renderStudentAvatars = (students: Student[], totalCount: number) => {
    const visibleStudents = students.slice(0, 3);
    const remainingCount = totalCount - visibleStudents.length;

    return (
      <div className='flex items-center -space-x-2'>
        {visibleStudents.map((student, index) => (
          <img
            key={student.id}
            src={student.avatar}
            alt={student.name}
            className='w-8 h-8 rounded-full border-2 border-white'
          />
        ))}
        {remainingCount > 0 && (
          <div className='w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center'>
            <span className='text-xs font-medium text-gray-600'>
              +{remainingCount}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
              My Classes
            </h1>
            <p className='text-gray-500'>
              Manage and monitor your teaching classes
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <div className='relative'>
              <Search className='w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search classes...'
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
              />
            </div>
            <button className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
              Filter
              <ChevronDown className='w-4 h-4 ml-1' />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-6 border border-gray-200`}
              >
                <div className='flex items-center'>
                  <Icon className={`w-8 h-8 ${stat.iconColor} mr-3`} />
                  <div>
                    <p className='text-2xl font-bold text-gray-900'>
                      {stat.value}
                    </p>
                    <p className='text-sm text-gray-600'>{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Classes Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer'
            >
              {/* Class Header */}
              <div className='flex justify-between items-start mb-4'>
                <div className='flex-1'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    {classItem.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${classItem.levelColor}`}
                  >
                    {classItem.level}
                  </span>
                </div>
                <div className='text-right'>
                  <div className='flex items-center text-sm text-gray-600 mb-1'>
                    <Users className='w-4 h-4 mr-1' />
                    {classItem.students}
                  </div>
                </div>
              </div>

              {/* Schedule & Location */}
              <div className='space-y-2 mb-4'>
                <div className='flex items-center text-sm text-gray-600'>
                  <Calendar className='w-4 h-4 mr-2' />
                  {classItem.schedule}
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                  <MapPin className='w-4 h-4 mr-2' />
                  {classItem.room}, {classItem.building}
                </div>
              </div>

              {/* Current Unit */}
              <div className='bg-gray-50 rounded-lg p-3 mb-4'>
                <div className='flex items-center text-sm text-gray-600 mb-1'>
                  <Book className='w-4 h-4 mr-2' />
                  Current Unit
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  {classItem.unit}
                </p>
              </div>

              {/* Student Avatars */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  {renderStudentAvatars(
                    classItem.studentAvatars,
                    classItem.students
                  )}
                  <span className='text-sm text-gray-600 ml-3'>
                    {classItem.students} students
                  </span>
                </div>
                <button className='text-blue-600 hover:text-blue-700 text-sm font-medium'>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyClassesDashboard;
