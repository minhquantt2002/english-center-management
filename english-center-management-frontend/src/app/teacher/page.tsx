'use client';

import React from 'react';
import { Plus, MessageCircle, Calendar, FileText } from 'lucide-react';
import { mockClassSessions } from '../../data';

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: 'Present' | 'Upcoming' | 'Absent';
}

const TeacherDashboard = () => {
  const actionCards = [
    {
      title: 'Add Test Scores',
      icon: Plus,
      bgColor: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
    },
    {
      title: 'Give Feedback',
      icon: MessageCircle,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
    },
    {
      title: 'Schedule Class',
      icon: Calendar,
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      title: 'Create Assignment',
      icon: FileText,
      bgColor: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
    },
  ];

  // Use mock data for today's classes
  const todaysClasses = mockClassSessions.slice(0, 3).map((classItem: any) => ({
    id: classItem.id,
    title: classItem.className || classItem.title || 'English Class',
    level: `Level ${classItem.level || 'B1'}`,
    room: classItem.room || 'Room 101',
    studentCount: classItem.studentsCount || 15,
    time: `${classItem.startTime || '9:00'} - ${classItem.endTime || '10:30'}`,
    status: 'In Progress' as 'In Progress' | 'Upcoming',
  }));

  // Create simple students by class mapping for display
  const studentsByClass: { [key: string]: Student[] } = {
    'Intermediate B1': [
      {
        id: '1',
        name: 'John Martinez',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        status: 'Present',
      },
      {
        id: '2',
        name: 'Emma Chen',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=40&h=40&fit=crop&crop=face',
        status: 'Present',
      },
    ],
    'Advanced C1': [
      {
        id: '4',
        name: 'Sophie Williams',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        status: 'Upcoming',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-green-100 text-green-700';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-700';
      case 'Absent':
        return 'bg-red-100 text-red-700';
      case 'In Progress':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const calendarDays = [
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Action Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {actionCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={index}
                className={`${card.bgColor} ${card.hoverColor} text-white rounded-xl p-6 transition-colors duration-200 text-left`}
              >
                <Icon className='w-8 h-8 mb-3' />
                <h3 className='text-lg font-semibold'>{card.title}</h3>
              </button>
            );
          })}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Today's Classes */}
          <div className='lg:col-span-2'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900'>
                Today's Classes
              </h2>
              <span className='text-gray-500'>March 15, 2024</span>
            </div>

            <div className='space-y-4'>
              {todaysClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='w-1 h-12 bg-blue-400 rounded-full'></div>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-900'>
                            {classItem.title}
                            {classItem.level && (
                              <span className='text-sm font-normal text-gray-500 ml-2'>
                                {classItem.level}
                              </span>
                            )}
                          </h3>
                          <p className='text-gray-600 text-sm'>
                            {classItem.room} • {classItem.studentCount} students
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium text-gray-900 mb-1'>
                        {classItem.time}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          classItem.status
                        )}`}
                      >
                        {classItem.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='space-y-8'>
            {/* Calendar */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Calendar
              </h3>
              <div className='space-y-2'>
                {calendarDays.map((week, weekIndex) => (
                  <div key={weekIndex} className='grid grid-cols-7 gap-1'>
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`text-center py-2 text-sm ${
                          weekIndex === 0
                            ? 'font-medium text-gray-700'
                            : typeof day === 'number'
                            ? day === 15
                              ? 'bg-blue-500 text-white rounded-full'
                              : 'text-gray-900 hover:bg-gray-100 rounded cursor-pointer'
                            : 'text-gray-900'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Students by Class */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Students by Class
              </h3>
              <div className='space-y-4'>
                {Object.entries(studentsByClass).map(
                  ([className, students]) => (
                    <div key={className}>
                      <h4 className='text-sm font-medium text-gray-700 mb-2'>
                        {className}
                      </h4>
                      <div className='space-y-2'>
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className='flex items-center gap-3'
                          >
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className='w-8 h-8 rounded-full'
                            />
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-gray-900'>
                                {student.name}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
