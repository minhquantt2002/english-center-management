'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
  Star,
} from 'lucide-react';
import { useTeacherApi } from './_hooks/use-api';

// Mock data - In real app, this would come from your API based on current_teacher
const mockData = {
  currentTeacher: {
    name: 'Cô Sarah Johnson',
    specialization: 'TOEIC & Business English',
    experience: '5 năm kinh nghiệm',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616c4b25e57?w=150&h=150&fit=crop&crop=face',
  },

  activeClasses: 6,
  totalStudents: 142,
  weeklySchedules: 18,

  classData: [
    {
      className: 'TOEIC Intensive A2',
      students: 28,
      attendance: 88.5,
      avgScore: 7.2,
      homeworkSubmitted: 85,
      room: 'A205',
      schedule: 'T2,T4,T6: 19:00-21:00',
    },
    {
      className: 'Business English B2',
      students: 24,
      avgScore: 7.8,
      attendance: 91.2,
      homeworkSubmitted: 92,
      room: 'B103',
      schedule: 'T3,T5: 18:00-20:00',
    },
    {
      className: 'TOEIC 600+ B1',
      students: 32,
      attendance: 85.7,
      avgScore: 6.9,
      homeworkSubmitted: 78,
      room: 'C301',
      schedule: 'T2,T4: 17:30-19:30',
    },
    {
      className: 'Conversation Club A2',
      students: 18,
      attendance: 94.1,
      avgScore: 7.5,
      homeworkSubmitted: 89,
      room: 'A108',
      schedule: 'T7: 14:00-16:00',
    },
    {
      className: 'Business Writing B1',
      students: 22,
      attendance: 87.3,
      avgScore: 7.1,
      homeworkSubmitted: 73,
      room: 'B205',
      schedule: 'T6: 19:00-21:00',
    },
    {
      className: 'TOEIC Speaking B2',
      students: 18,
      attendance: 89.7,
      avgScore: 8.1,
      homeworkSubmitted: 94,
      room: 'C102',
      schedule: 'T7: 16:30-18:30',
    },
  ],

  skillsAverage: [
    { skill: 'Listening', score: 7.4, improvement: '+0.5' },
    { skill: 'Reading', score: 7.8, improvement: '+0.3' },
    { skill: 'Writing', score: 6.9, improvement: '+0.7' },
    { skill: 'Speaking', score: 7.2, improvement: '+0.4' },
  ],

  recentHomework: [
    {
      studentName: 'Nguyễn Văn An',
      className: 'TOEIC A2',
      assignment: 'Listening Practice Unit 5',
      score: 8.5,
      status: 'passed',
      submittedDate: '2024-08-25',
      feedback: 'Rất tốt! Cải thiện nhiều về khả năng nghe.',
    },
    {
      studentName: 'Trần Thị Bình',
      className: 'Business B2',
      assignment: 'Email Writing Task',
      score: 7.2,
      status: 'passed',
      submittedDate: '2024-08-24',
      feedback: 'Cấu trúc email tốt, cần chú ý grammar.',
    },
    {
      studentName: 'Lê Minh Cường',
      className: 'TOEIC B1',
      assignment: 'Reading Comprehension',
      score: 5.8,
      status: 'failed',
      submittedDate: '2024-08-24',
      feedback: 'Cần làm thêm bài tập về từ vựng.',
    },
    {
      studentName: 'Phạm Thu Dung',
      className: 'Conversation A2',
      assignment: 'Speaking Recording',
      score: 9.0,
      status: 'passed',
      submittedDate: '2024-08-23',
      feedback: 'Xuất sắc! Phát âm và lưu loát tốt.',
    },
  ],

  homeworkStats: [
    { className: 'TOEIC A2', pending: 4, passed: 22, failed: 2, total: 28 },
    { className: 'Business B2', pending: 2, passed: 21, failed: 1, total: 24 },
    { className: 'TOEIC B1', pending: 7, passed: 20, failed: 5, total: 32 },
    {
      className: 'Conversation A2',
      pending: 2,
      passed: 15,
      failed: 1,
      total: 18,
    },
    {
      className: 'Business Writing B1',
      pending: 6,
      passed: 14,
      failed: 2,
      total: 22,
    },
    {
      className: 'TOEIC Speaking B2',
      pending: 1,
      passed: 16,
      failed: 1,
      total: 18,
    },
  ],

  classProgress: [
    {
      month: 'T5',
      'TOEIC A2': 6.8,
      'Business B2': 7.1,
      'TOEIC B1': 6.2,
      'Conversation A2': 7.0,
    },
    {
      month: 'T6',
      'TOEIC A2': 7.0,
      'Business B2': 7.4,
      'TOEIC B1': 6.5,
      'Conversation A2': 7.3,
    },
    {
      month: 'T7',
      'TOEIC A2': 7.1,
      'Business B2': 7.6,
      'TOEIC B1': 6.8,
      'Conversation A2': 7.4,
    },
    {
      month: 'T8',
      'TOEIC A2': 7.2,
      'Business B2': 7.8,
      'TOEIC B1': 6.9,
      'Conversation A2': 7.5,
    },
  ],

  absentStudents: [
    {
      name: 'Hoàng Văn Em',
      className: 'TOEIC B1',
      absentCount: 12,
      totalSessions: 32,
      absentRate: 37.5,
      phone: '0912345678',
      lastAttended: '2024-08-15',
    },
    {
      name: 'Ngô Thị Phương',
      className: 'Business Writing B1',
      absentCount: 8,
      totalSessions: 24,
      absentRate: 33.3,
      phone: '0987654321',
      lastAttended: '2024-08-20',
    },
    {
      name: 'Đặng Minh Tuấn',
      className: 'TOEIC A2',
      absentCount: 10,
      totalSessions: 30,
      absentRate: 33.3,
      phone: '0901234567',
      lastAttended: '2024-08-18',
    },
    {
      name: 'Vũ Thu Hằng',
      className: 'Business B2',
      absentCount: 7,
      totalSessions: 22,
      absentRate: 31.8,
      phone: '0934567890',
      lastAttended: '2024-08-22',
    },
  ],

  weeklyStats: {
    totalSessions: 18,
    averageAttendance: 89.2,
    homeworkGraded: 45,
    newAssignments: 12,
  },
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}> = ({ title, value, icon, subtitle, color = 'blue', trend, trendValue }) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-gray-600'>{title}</p>
        <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
        {subtitle && <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>}
        {trend && trendValue && (
          <p
            className={`text-xs mt-2 flex items-center ${
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            <TrendingUp
              className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`}
            />
            {trendValue}
          </p>
        )}
      </div>
      <div
        className={`p-3 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const TeacherDashboard: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('all');

  const [mockData, setMockData] = useState(null);

  const { getTeacherDashboard } = useTeacherApi();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTeacherDashboard();
      setMockData(data);
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className='p-2'>
      {/* Header with Teacher Profile */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Chào {mockData?.currentTeacher?.name}!
            </h1>
            <p className='text-gray-600'>
              {mockData?.currentTeacher?.specialization}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-3'>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          >
            <option value='all'>Tất cả lớp</option>
            {mockData?.classData?.map((cls, index) => (
              <option
                key={index}
                value={cls.className}
              >
                {cls.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='py-6'>
        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
          <StatCard
            title='Lớp Đang Dạy'
            value={mockData?.activeClasses}
            icon={<BookOpen className='w-6 h-6 text-indigo-600' />}
            subtitle='lớp học hoạt động'
            color='indigo'
          />
          <StatCard
            title='Tổng Học Viên'
            value={mockData?.totalStudents}
            icon={<Users className='w-6 h-6 text-blue-600' />}
            trend='up'
            trendValue='+8 học viên mới'
            color='blue'
          />
          <StatCard
            title='Buổi Dạy Tuần Này'
            value={mockData?.weeklySchedules}
            icon={<Calendar className='w-6 h-6 text-green-600' />}
            subtitle='trên tất cả các lớp'
            color='green'
          />
          <StatCard
            title='Điểm Danh TB'
            value={`${mockData?.weeklyStats?.averageAttendance}%`}
            icon={<CheckCircle className='w-6 h-6 text-purple-600' />}
            trend='up'
            trendValue='+2.3% so với tuần trước'
            color='purple'
          />
        </div>

        {/* Class Overview */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Tổng Quan Lớp Học
            </h2>
            <Target className='w-6 h-6 text-indigo-500' />
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
            {mockData?.classData?.map((classItem, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200'
              >
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-bold text-gray-900 text-lg'>
                    {classItem.className}
                  </h3>
                  <span className='text-sm text-indigo-600 text-center bg-indigo-100 px-2 py-1 rounded-full'>
                    {classItem.students} HV
                  </span>
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Điểm danh:</span>
                    <span
                      className={`font-medium ${
                        classItem.attendance >= 90
                          ? 'text-green-600'
                          : classItem.attendance >= 85
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {classItem.attendance}%
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Điểm TB:</span>
                    <span className='font-medium text-blue-600'>
                      {classItem.avgScore}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Bài tập nộp:</span>
                    <span className='font-medium text-purple-600'>
                      {classItem.homeworkSubmitted}%
                    </span>
                  </div>
                  <div className='pt-2 border-t border-gray-100'>
                    <p className='text-xs text-gray-500'>
                      {classItem.schedule}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Phòng {classItem.room}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Progress Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Skills Average */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Điểm Trung Bình Theo Kỹ Năng
              </h2>
              <Star className='w-5 h-5 text-yellow-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <BarChart
                data={mockData?.skillsAverage}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f0f0f0'
                />
                <XAxis
                  dataKey='skill'
                  stroke='#6B7280'
                />
                <YAxis
                  stroke='#6B7280'
                  domain={[0, 10]}
                />
                <Tooltip formatter={(value) => [value, 'Điểm TB']} />
                <Bar
                  dataKey='score'
                  fill='#6366F1'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className='grid grid-cols-4 gap-4 mt-4'>
              {mockData?.skillsAverage?.map((skill, index) => (
                <div
                  key={index}
                  className='text-center'
                >
                  <p className='text-xs text-gray-500'>{skill.skill}</p>
                  <p className='text-green-600 font-medium text-sm'>
                    {skill.improvement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Class Progress Over Time */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Tiến Bộ Lớp Học Theo Thời Gian
              </h2>
              <TrendingUp className='w-5 h-5 text-green-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <LineChart data={mockData?.classProgress}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f0f0f0'
                />
                <XAxis
                  dataKey='month'
                  stroke='#6B7280'
                />
                <YAxis
                  stroke='#6B7280'
                  domain={[6, 8]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='TOEIC A2'
                  stroke='#3B82F6'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='Business B2'
                  stroke='#10B981'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='TOEIC B1'
                  stroke='#F59E0B'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='Conversation A2'
                  stroke='#8B5CF6'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Homework Management */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          {/* Recent Homework */}
          <div className='lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Bài Tập Chấm Gần Đây
              </h2>
              <FileText className='w-5 h-5 text-blue-500' />
            </div>
            <div className='space-y-4'>
              {mockData?.recentHomework?.map((homework, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {homework.studentName}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {homework.className} • {homework.assignment}
                      </p>
                    </div>
                    <div className='text-right'>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          homework.status
                        )}`}
                      >
                        {homework.status === 'passed'
                          ? 'Đạt'
                          : homework.status === 'failed'
                          ? 'Không đạt'
                          : 'Chưa chấm'}
                      </span>
                      <p className='text-sm font-bold text-gray-900 mt-1'>
                        {homework.score}
                      </p>
                    </div>
                  </div>
                  <p className='text-sm text-gray-700 bg-gray-50 p-2 rounded italic'>
                    "{homework.feedback}"
                  </p>
                  <p className='text-xs text-gray-500 mt-2'>
                    {homework.submittedDate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Homework Statistics */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Thống Kê Bài Tập
              </h2>
              <Award className='w-5 h-5 text-purple-500' />
            </div>
            <div className='space-y-4'>
              {mockData?.homeworkStats?.map((stat, index) => (
                <div
                  key={index}
                  className='border-b border-gray-100 pb-4 last:border-b-0'
                >
                  <h3 className='font-medium text-gray-900 mb-2'>
                    {stat.className}
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-yellow-600'>Chưa nộp:</span>
                      <span className='font-medium'>{stat.pending}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-green-600'>Đạt:</span>
                      <span className='font-medium'>{stat.passed}</span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-red-600'>Không đạt:</span>
                      <span className='font-medium'>{stat.failed}</span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full'
                        style={{
                          width: `${(stat.passed / stat.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students with High Absence */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Học Viên Vắng Nhiều ({'>'}30%)
            </h2>
            <AlertTriangle className='w-5 h-5 text-red-500' />
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Học Viên
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Lớp
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Số Buổi Vắng
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Tỷ Lệ Vắng
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Lần Cuối Học
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Liên Hệ
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData?.absentStudents?.map((student, index) => (
                  <tr
                    key={index}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='py-3 px-4'>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3'>
                          <AlertTriangle className='w-4 h-4 text-red-600' />
                        </div>
                        <span className='font-medium text-gray-900'>
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-4 text-gray-600'>
                      {student.className}
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <span className='text-red-600 font-medium'>
                        {student.absentCount}/{student.totalSessions}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-center'>
                      <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium'>
                        {student.absentRate}%
                      </span>
                    </td>
                    <td className='py-3 px-4 text-gray-600 text-sm'>
                      {student.lastAttended}
                    </td>
                    <td className='py-3 px-4'>
                      <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                        {student.phone}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
