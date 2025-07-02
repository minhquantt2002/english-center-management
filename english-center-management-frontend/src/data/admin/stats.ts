import { AdminStats, StatCard, SystemStatus } from '@/types';

export const mockAdminStats: AdminStats = {
  totalStudents: 2847,
  totalTeachers: 142,
  totalClasses: 89,
  ongoingCourses: 24,
  recentEnrollments: [
    {
      name: 'Sarah Johnson',
      course: 'Advanced English',
      time: '2 hours ago',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Mike Chen',
      course: 'Business English',
      time: '4 hours ago',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Emma Davis',
      course: 'Conversation Class',
      time: '6 hours ago',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  ],
  systemStatus: [
    {
      service: 'Server Status',
      status: 'Online',
      statusColor: 'text-green-600',
    },
    {
      service: 'Database',
      status: 'Connected',
      statusColor: 'text-green-600',
    },
    {
      service: 'Backup System',
      status: 'Running',
      statusColor: 'text-yellow-600',
    },
    {
      service: 'Email Service',
      status: 'Active',
      statusColor: 'text-green-600',
    },
  ],
};

export const mockStatCards: StatCard[] = [
  {
    title: 'Total Students',
    value: '2,847',
    change: '+12% from last month',
    changeType: 'positive',
    icon: 'Users',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Total Teachers',
    value: '142',
    change: '+5% from last month',
    changeType: 'positive',
    icon: 'GraduationCap',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    title: 'Total Classes',
    value: '89',
    change: '+8% from last month',
    changeType: 'positive',
    icon: 'BookOpen',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Ongoing Courses',
    value: '24',
    change: '+3% from last month',
    changeType: 'positive',
    icon: 'PlayCircle',
    iconBg: 'bg-orange-100 text-orange-600',
  },
];

export const mockSystemStatus: SystemStatus[] = [
  {
    service: 'Server Status',
    status: 'Online',
    statusColor: 'text-green-600',
    lastChecked: '2024-01-15T14:30:00Z',
  },
  {
    service: 'Database',
    status: 'Connected',
    statusColor: 'text-green-600',
    lastChecked: '2024-01-15T14:30:00Z',
  },
  {
    service: 'Backup System',
    status: 'Running',
    statusColor: 'text-yellow-600',
    lastChecked: '2024-01-15T14:25:00Z',
  },
  {
    service: 'Email Service',
    status: 'Active',
    statusColor: 'text-green-600',
    lastChecked: '2024-01-15T14:30:00Z',
  },
  {
    service: 'Payment Gateway',
    status: 'Online',
    statusColor: 'text-green-600',
    lastChecked: '2024-01-15T14:28:00Z',
  },
];
