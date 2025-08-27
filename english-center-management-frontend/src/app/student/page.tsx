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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
} from 'recharts';
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Target,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  BookMarked,
} from 'lucide-react';
import { useStudentApi } from './_hooks/use-api';

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

const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  color?: string;
}> = ({ progress, size = 120, color = '#3B82F6' }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className='relative'>
      <svg
        width={size}
        height={size}
        className='transform -rotate-90'
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='#E5E7EB'
          strokeWidth='8'
          fill='transparent'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth='8'
          fill='transparent'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          className='transition-all duration-300'
        />
      </svg>
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='text-2xl font-bold text-gray-900'>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const [mockData, setMockData] = useState(null);

  const { getStudentDashboard } = useStudentApi();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentDashboard();
      setMockData(data);
    };

    fetchData();
  }, []);
  const pendingHomework = mockData?.totalHomework - mockData?.submittedHomework;

  return (
    <div>
      {/* Header with Student Profile */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Chào {mockData?.currentStudent?.name}!
            </h1>
            <p className='text-gray-600'>
              Trình độ hiện tại:{' '}
              <span className='font-semibold text-blue-600'>
                {mockData?.currentStudent?.level}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className='py-4'>
        {/* Quick Stats */}
        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          <StatCard
            title='Lớp Đang Học'
            value={mockData?.enrolledClasses}
            icon={<BookOpen className='w-6 h-6 text-blue-600' />}
            subtitle='lớp học đang tham gia'
            color='blue'
          />
          <StatCard
            title='Tỷ Lệ Điểm Danh'
            value={`${mockData?.personalAttendance}%`}
            icon={<CheckCircle className='w-6 h-6 text-green-600' />}
            trend='up'
            trendValue='+3.2% so với tháng trước'
            color='green'
          />
          <StatCard
            title='Bài Tập Đã Nộp'
            value={`${mockData?.submittedHomework}/${mockData?.totalHomework}`}
            icon={<FileText className='w-6 h-6 text-purple-600' />}
            subtitle={`${pendingHomework} bài chưa nộp`}
            color='purple'
          />
        </div>

        {/* Study Reminders */}
        {mockData?.studyReminders?.length > 0 && (
          <div className='bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-8'>
            <div className='flex items-center mb-4'>
              <Bell className='w-5 h-5 text-orange-600 mr-2' />
              <h2 className='text-lg font-semibold text-gray-900'>
                Nhắc Nhở Học Tập
              </h2>
            </div>
            <div className='space-y-3'>
              {mockData?.studyReminders?.map((reminder, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg ${
                    reminder.priority === 'high'
                      ? 'bg-red-100 border border-red-200'
                      : reminder.priority === 'medium'
                      ? 'bg-yellow-100 border border-yellow-200'
                      : 'bg-blue-100 border border-blue-200'
                  }`}
                >
                  <AlertCircle
                    className={`w-4 h-4 mr-3 ${
                      reminder.priority === 'high'
                        ? 'text-red-600'
                        : reminder.priority === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <p className='text-sm font-medium text-gray-800 flex-1'>
                    {reminder.message}
                  </p>
                  <span className='text-xs text-gray-500'>
                    {reminder.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Comparison */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Skill Scores */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                So Sánh Điểm Số Với Lớp
              </h2>
              <Target className='w-5 h-5 text-blue-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <BarChart
                data={mockData?.skillScores}
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
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='myScore'
                  fill='#3B82F6'
                  name='Điểm của bạn'
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey='classAvg'
                  fill='#94A3B8'
                  name='Trung bình lớp'
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Biểu Đồ Năng Lực
              </h2>
              <Award className='w-5 h-5 text-purple-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <RadarChart data={mockData?.radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey='subject'
                  tick={{ fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={0}
                  domain={[0, 100]}
                  tick={false}
                />
                <Radar
                  name='Điểm của bạn'
                  dataKey='myScore'
                  stroke='#3B82F6'
                  fill='#3B82F6'
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name='Trung bình lớp'
                  dataKey='classAvg'
                  stroke='#94A3B8'
                  fill='#94A3B8'
                  fillOpacity={0.1}
                  strokeWidth={1}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Progress & Monthly Trends */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Course Progress */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Mục Tiêu Học Tập
              </h2>
              <BookMarked className='w-5 h-5 text-green-500' />
            </div>
            <div className='flex items-center justify-around flex-wrap gap-6'>
              {mockData?.courseProgress?.map((course, index) => (
                <div
                  key={index}
                  className='text-center'
                >
                  <h3 className='font-semibold text-gray-900 mb-3'>
                    {course.courseName}
                  </h3>
                  <div className='flex items-center justify-center mb-3'>
                    <ProgressRing
                      progress={course.progress}
                      color='#10B981'
                    />
                  </div>
                  <div className='text-sm text-gray-600'>
                    <p>
                      {course.attendedSessions}/{course.totalSessions} buổi học
                    </p>
                    <p className='text-green-600 font-medium'>
                      Tỷ lệ hoàn thành: {course.completionRate}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Tiến Độ Theo Tháng
              </h2>
              <TrendingUp className='w-5 h-5 text-blue-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={250}
            >
              <LineChart data={mockData?.monthlyProgress}>
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
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='attendance'
                  stroke='#10B981'
                  strokeWidth={2}
                  name='Điểm danh %'
                />
                <Line
                  type='monotone'
                  dataKey='homework'
                  stroke='#F59E0B'
                  strokeWidth={2}
                  name='Bài tập %'
                />
                <Line
                  type='monotone'
                  dataKey='score'
                  stroke='#3B82F6'
                  strokeWidth={2}
                  name='Điểm số'
                  yAxisId='score'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Schedule & Exams */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Weekly Schedule */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Lịch Học Tuần Này
              </h2>
              <Calendar className='w-5 h-5 text-blue-500' />
            </div>
            <div className='space-y-3'>
              {mockData?.weeklySchedule.map((schedule, index) => (
                <div
                  key={index}
                  className='flex items-center p-4 bg-blue-50 rounded-lg'
                >
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='font-semibold text-gray-900'>
                        {schedule.day}
                      </span>
                      <span className='text-sm text-blue-600 font-medium'>
                        {schedule.time}
                      </span>
                    </div>
                    <p className='text-sm text-gray-700'>{schedule.subject}</p>
                    <p className='text-xs text-gray-500'>
                      {schedule.teacher} • Phòng {schedule.room}
                    </p>
                  </div>
                  <Clock className='w-5 h-5 text-blue-500 ml-3' />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Kỳ Thi Sắp Tới
              </h2>
              <FileText className='w-5 h-5 text-red-500' />
            </div>
            <div className='space-y-4'>
              {mockData?.upcomingExams.map((exam, index) => (
                <div
                  key={index}
                  className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-semibold text-gray-900'>
                      {exam.examName}
                    </h3>
                    <span className='text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full'>
                      {exam.type}
                    </span>
                  </div>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <p className='flex items-center'>
                      <Calendar className='w-4 h-4 mr-2' />
                      {exam.date} lúc {exam.time}
                    </p>
                    <p className='flex items-center'>
                      <Clock className='w-4 h-4 mr-2' />
                      {exam.duration} phút • Phòng {exam.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
