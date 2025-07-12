import { AdminStats, StatCard, SystemStatus } from '@/types';

export const mockAdminStats: AdminStats = {
  totalStudents: 2847,
  totalTeachers: 142,
  totalClasses: 89,
  ongoingCourses: 24,
  recentEnrollments: [
    {
      name: 'Sarah Johnson',
      course: 'Tiếng Anh nâng cao',
      time: '2 giờ trước',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Mike Chen',
      course: 'Tiếng Anh thương mại',
      time: '4 giờ trước',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      name: 'Emma Davis',
      course: 'Lớp hội thoại',
      time: '6 giờ trước',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
  ],
  systemStatus: [
    {
      service: 'Trạng thái máy chủ',
      status: 'Hoạt động',
      statusColor: 'text-green-600',
    },
    {
      service: 'Cơ sở dữ liệu',
      status: 'Đã kết nối',
      statusColor: 'text-green-600',
    },
    {
      service: 'Hệ thống sao lưu',
      status: 'Đang chạy',
      statusColor: 'text-yellow-600',
    },
    {
      service: 'Dịch vụ email',
      status: 'Hoạt động',
      statusColor: 'text-green-600',
    },
  ],
};

export const mockStatCards: StatCard[] = [
  {
    title: 'Tổng số học viên',
    value: '2,847',
    change: '+12% so với tháng trước',
    changeType: 'positive',
    icon: 'Users',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Tổng số giáo viên',
    value: '142',
    change: '+5% so với tháng trước',
    changeType: 'positive',
    icon: 'GraduationCap',
    iconBg: 'bg-green-100 text-green-600',
  },
  {
    title: 'Tổng số lớp học',
    value: '89',
    change: '+8% so với tháng trước',
    changeType: 'positive',
    icon: 'BookOpen',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Khóa học đang diễn ra',
    value: '24',
    change: '+3% so với tháng trước',
    changeType: 'positive',
    icon: 'PlayCircle',
    iconBg: 'bg-orange-100 text-orange-600',
  },
];
