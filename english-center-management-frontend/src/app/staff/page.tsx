'use client';
import React, { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  AlertCircle,
  Award,
  FileText,
  TrendingUp,
  UserX,
} from 'lucide-react';
import { useStaffStatsApi } from './_hooks/use-stats';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  color?: string;
}> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  subtitle,
  color = 'blue',
}) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-gray-600'>{title}</p>
        <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
        {subtitle && <p className='text-xs text-gray-500 mt-1'>{subtitle}</p>}
        {change && (
          <p
            className={`text-xs mt-2 flex items-center ${
              changeType === 'positive'
                ? 'text-green-600'
                : changeType === 'negative'
                ? 'text-red-600'
                : 'text-gray-500'
            }`}
          >
            <TrendingUp className='w-3 h-3 mr-1' />
            {change}
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

const ProgressBar: React.FC<{ progress: number; color?: string }> = ({
  progress,
  color = 'blue',
}) => (
  <div className='w-full bg-gray-200 rounded-full h-2'>
    <div
      className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const StaffDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [mockData, setMockData] = useState(null);

  const { getDashboard } = useStaffStatsApi();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboard();
      setMockData(data);
    };

    fetchData();
  }, []);

  const avgAttendance =
    mockData?.attendanceData.reduce((sum, item) => sum + item.attendance, 0) /
    mockData?.attendanceData.length;

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Bảng Điều Khiển Staff
          </h1>
          <p className='text-gray-600 mt-1'>
            Quản Lý Hàng Ngày - Trung Tâm Tiếng Anh
          </p>
        </div>
        {/* <div className='flex items-center space-x-3'>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='overview'>Tổng Quan</option>
            <option value='attendance'>Điểm Danh</option>
            <option value='homework'>Bài Tập</option>
            <option value='schedule'>Lịch Học</option>
          </select>
        </div> */}
      </div>

      <div className='py-4'>
        {/* KPI Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard
            title='Tổng Số Học Viên'
            value={mockData?.totalStudents.toLocaleString()}
            icon={<Users className='w-6 h-6 text-blue-600' />}
            change=''
            changeType='positive'
            color='blue'
          />
          <StatCard
            title='Học Viên Chưa Xếp Lớp'
            value={mockData?.unassignedStudents}
            icon={<UserX className='w-6 h-6 text-orange-600' />}
            subtitle=''
            color='orange'
          />
          <StatCard
            title='Lớp Đang Hoạt Động'
            value={mockData?.activeClasses}
            icon={<BookOpen className='w-6 h-6 text-green-600' />}
            change=''
            changeType='positive'
            color='green'
          />
          <StatCard
            title='Buổi Học Tuần Này'
            value={mockData?.weeklySchedules}
            icon={<Calendar className='w-6 h-6 text-purple-600' />}
            subtitle='Trên tất cả các lớp'
            color='purple'
          />
        </div>

        {/* Secondary KPIs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <StatCard
            title='Điểm Danh Trung Bình'
            value={`${avgAttendance.toFixed(1)}%`}
            icon={<CheckCircle className='w-6 h-6 text-green-600' />}
            change=''
            changeType='positive'
            subtitle='Toàn trung tâm'
            color='green'
          />
          <StatCard
            title='Bài Tập Chưa Nộp'
            value={mockData?.homeworkStatus[1].value}
            icon={<AlertTriangle className='w-6 h-6 text-yellow-600' />}
            subtitle={`${mockData?.homeworkStatus[1].percentage}% tổng bài tập`}
            color='yellow'
          />
        </div>

        {/* Charts Row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Attendance Trends */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Xu Hướng Điểm Danh
              </h2>
              <Clock className='w-5 h-5 text-blue-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <LineChart data={mockData?.attendanceData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f0f0f0'
                />
                <XAxis
                  dataKey='week'
                  stroke='#6B7280'
                />
                <YAxis
                  stroke='#6B7280'
                  domain={[75, 95]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Tỷ lệ điểm danh']}
                />
                <Line
                  type='monotone'
                  dataKey='attendance'
                  stroke='#10B981'
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Homework Status */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Tình Trạng Bài Tập
              </h2>
              <FileText className='w-5 h-5 text-purple-500' />
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <PieChart>
                <Pie
                  data={mockData?.homeworkStatus}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey='value'
                >
                  {mockData?.homeworkStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Management Tables */}
        {mockData?.upcomingClasses.length > 0 &&
          mockData?.endingClasses.length > 0 && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
              {/* Upcoming Classes */}
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Lớp Sắp Khai Giảng
                  </h2>
                  <Play className='w-5 h-5 text-green-500' />
                </div>
                <div className='space-y-4'>
                  {mockData?.upcomingClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-900'>
                          {classItem.className}
                        </h3>
                        <span className='text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full'>
                          {classItem.startDate}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-sm text-gray-600'>
                        <span>
                          {classItem.teacher} • Phòng {classItem.room}
                        </span>
                        <span className='flex items-center'>
                          <Users className='w-4 h-4 mr-1' />
                          {classItem.students} học viên
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ending Classes */}
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold text-gray-900'>
                    Lớp Sắp Kết Thúc
                  </h2>
                  <AlertCircle className='w-5 h-5 text-orange-500' />
                </div>
                <div className='space-y-4'>
                  {mockData?.endingClasses.map((classItem, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold text-gray-900'>
                          {classItem.className}
                        </h3>
                        <span className='text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full'>
                          {classItem.endDate}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-sm text-gray-600 mb-2'>
                        <span>
                          {classItem.teacher} • Phòng {classItem.room}
                        </span>
                        <span>{classItem.students} học viên</span>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <ProgressBar
                          progress={classItem.progress}
                          color='orange'
                        />
                        <span className='text-sm font-medium text-gray-700'>
                          {classItem.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* Class Progress Tracking */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Tiến Độ Lớp Học
            </h2>
            <Award className='w-5 h-5 text-blue-500' />
          </div>
          <div className='space-y-4'>
            {mockData?.classProgress.map((classItem, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      {classItem.className}
                    </h3>
                    <p className='text-sm text-gray-600'>
                      {classItem.completedSessions}/{classItem.totalSessions}{' '}
                      buổi học • {classItem.students} học viên
                    </p>
                  </div>
                  <div className='text-right'>
                    <span className='text-lg font-bold text-gray-900'>
                      {classItem.progress.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  progress={classItem.progress}
                  color='blue'
                />
              </div>
            ))}
          </div>
        </div>

        {/* Top Students with Pending Homework */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Học Viên Có Nhiều Bài Tập Chưa Nộp
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
                    Bài Chưa Nộp
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Số Điện Thoại
                  </th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-900'>
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockData?.topLateStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className='py-3 px-4 text-center text-gray-600'
                    >
                      Không có học viên nào
                    </td>
                  </tr>
                ) : (
                  mockData?.topLateStudents.map((student, index) => (
                    <tr
                      key={index}
                      className='border-b border-gray-100 hover:bg-gray-50'
                    >
                      <td className='py-3 px-4'>
                        <div className='flex items-center'>
                          <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3'>
                            <span className='text-red-600 font-semibold text-sm'>
                              {index + 1}
                            </span>
                          </div>
                          <span className='font-medium text-gray-900'>
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className='py-3 px-4 text-gray-600'>
                        {student.className}
                      </td>
                      <td className='py-3 px-4'>
                        <span className='bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium'>
                          {student.pendingHomework} bài
                        </span>
                      </td>
                      <td className='py-3 px-4 text-gray-600'>
                        {student.phone}
                      </td>
                      <td className='py-3 px-4'>
                        <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                          Liên Hệ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
