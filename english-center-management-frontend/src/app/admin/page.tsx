'use client';

import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  PlayCircle,
  UserPlus,
  UserCheck,
  Calendar,
  BarChart3,
  TrendingUp,
  ArrowUp,
} from 'lucide-react';
import { mockStatCards, mockSystemStatus, mockStudents } from '../../data';
import { Student } from '../../types';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface EnrollmentProps {
  name: string;
  course: string;
  time: string;
  avatar: string;
}

interface SystemStatusProps {
  service: string;
  status: string;
  statusColor: string;
}

const AdminDashboard: React.FC = () => {
  const stats = mockStatCards.map((stat) => ({
    ...stat,
    value: String(stat.value),
    icon:
      stat.icon === 'Users' ? (
        <Users size={24} />
      ) : stat.icon === 'GraduationCap' ? (
        <GraduationCap size={24} />
      ) : stat.icon === 'BookOpen' ? (
        <BookOpen size={24} />
      ) : (
        <PlayCircle size={24} />
      ),
  }));

  const systemStatus = mockSystemStatus;

  const quickActions = [
    {
      title: 'Manage Students',
      description: 'Add, edit, or remove student accounts',
      icon: <UserPlus size={24} />,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Manage Teachers',
      description: 'Oversee teacher profiles and assignments',
      icon: <UserCheck size={24} />,
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      title: 'Manage Classes',
      description: 'Create and schedule new classes',
      icon: <Calendar size={24} />,
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'View Reports',
      description: 'Access detailed analytics and reports',
      icon: <BarChart3 size={24} />,
      iconBg: 'bg-orange-100 text-orange-600',
    },
  ];

  // Get recent enrollments from students data
  const recentEnrollments = mockStudents
    .slice(0, 3)
    .map((student: Student) => ({
      name: student.name,
      course: student.currentClass || 'Basic English',
      time: '2 hours ago',
      avatar:
        student.avatar ||
        'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    }));

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    changeType,
    icon,
    iconBg,
  }) => (
    <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <p className='text-gray-500 text-sm font-medium'>{title}</p>
          <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <ArrowUp size={16} className='text-green-500' />
        <span className='text-green-500 text-sm font-medium'>{change}</span>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionProps> = ({
    title,
    description,
    icon,
    iconBg,
  }) => (
    <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer'>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg} mb-4`}
      >
        {icon}
      </div>
      <h3 className='font-semibold text-gray-900 mb-2'>{title}</h3>
      <p className='text-gray-500 text-sm'>{description}</p>
    </div>
  );

  const EnrollmentItem: React.FC<EnrollmentProps> = ({
    name,
    course,
    time,
    avatar,
  }) => (
    <div className='flex items-center gap-3 py-3'>
      <img
        src={avatar}
        alt={name}
        className='w-10 h-10 rounded-full object-cover'
      />
      <div className='flex-1'>
        <p className='font-medium text-gray-900'>{name}</p>
        <p className='text-sm text-gray-500'>Enrolled in {course}</p>
      </div>
      <p className='text-sm text-gray-400'>{time}</p>
    </div>
  );

  const StatusItem: React.FC<SystemStatusProps> = ({
    service,
    status,
    statusColor,
  }) => (
    <div className='flex items-center justify-between py-2'>
      <div className='flex items-center gap-2'>
        <div
          className={`w-2 h-2 rounded-full ${statusColor.replace(
            'text-',
            'bg-'
          )}`}
        ></div>
        <span className='text-gray-700'>{service}</span>
      </div>
      <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-6'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {quickActions.map((action, index) => (
              <QuickActionCard key={index} {...action} />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Enrollments */}
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <h3 className='text-lg font-bold text-gray-900 mb-6'>
              Recent Enrollments
            </h3>
            <div className='space-y-1'>
              {recentEnrollments.map((enrollment, index) => (
                <EnrollmentItem key={index} {...enrollment} />
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
            <h3 className='text-lg font-bold text-gray-900 mb-6'>
              System Status
            </h3>
            <div className='space-y-3'>
              {systemStatus.map((status, index) => (
                <StatusItem key={index} {...status} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
