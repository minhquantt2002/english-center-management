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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useDashboardApi } from './_hooks';
import { toast } from 'react-toastify';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}> = ({ title, value, icon, change, changeType = 'neutral', subtitle }) => (
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
      <div className='p-3 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg'>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [mockData, setMockData] = useState(null);

  const { getDashboard } = useDashboardApi();

  const loadData = async () => {
    try {
      const data = await getDashboard();
      setMockData(data);
    } catch (error) {
      toast.error('Lỗi xảy ra khi tải dữ liệu!');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Bảng Điều Khiển Admin
          </h1>
          <p className='text-gray-600 mt-1'>Quản Lý Trung Tâm Tiếng Anh</p>
        </div>
        {/* <div className='flex items-center space-x-3'>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='thisWeek'>Tuần Này</option>
            <option value='thisMonth'>Tháng Này</option>
            <option value='thisQuarter'>Quý Này</option>
            <option value='thisYear'>Năm Này</option>
          </select>
        </div> */}
      </div>

      <div className='py-4'>
        {/* KPI Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard
            title={mockData?.total_revenue?.title}
            value={mockData?.total_revenue?.value}
            icon={<DollarSign className='w-6 h-6 text-blue-600' />}
            // change={mockData?.total_revenue?.change}
            changeType={mockData?.total_revenue?.changeType}
            subtitle={mockData?.total_revenue?.subtitle}
          />
          <StatCard
            title={mockData?.active_students?.title}
            value={mockData?.active_students?.value}
            icon={<Users className='w-6 h-6 text-green-600' />}
            // change={mockData?.active_students?.change}
            changeType={mockData?.active_students?.changeType}
            subtitle={mockData?.active_students?.subtitle}
          />
          <StatCard
            title={mockData?.completion_rate?.title}
            value={mockData?.completion_rate?.value}
            icon={<GraduationCap className='w-6 h-6 text-purple-600' />}
            // change={mockData?.completion_rate?.change}
            changeType={mockData?.completion_rate?.changeType}
            subtitle={mockData?.completion_rate?.subtitle}
          />
          <StatCard
            title={mockData?.active_classes?.title}
            value={mockData?.active_classes?.value}
            icon={<BookOpen className='w-6 h-6 text-orange-600' />}
            // change={mockData?.active_classes?.change}
            changeType={mockData?.active_classes?.changeType}
            subtitle={mockData?.active_classes?.subtitle}
          />
        </div>

        {/* Charts Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Revenue Chart */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Doanh Thu Theo Tháng
              </h2>
              <div className='text-sm text-gray-500'>
                Tổng:{' '}
                {String(
                  mockData?.revenue_by_month.reduce(
                    (acc, item) => acc + item.revenue,
                    0
                  )
                ).toLocaleString()}{' '}
                ₫
              </div>
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <AreaChart data={mockData?.revenue_by_month}>
                <defs>
                  <linearGradient
                    id='colorRevenue'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor='#3B82F6'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='#3B82F6'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
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
                  tickFormatter={(value) => `${value} đ`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()}đ`,
                    'Doanh thu',
                  ]}
                />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke='#3B82F6'
                  fillOpacity={1}
                  fill='url(#colorRevenue)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Student Status Distribution */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Phân Bổ Trạng Thái Học Viên
              </h2>
              <div className='text-sm text-gray-500'>
                Tổng:{' '}
                {mockData?.student_status_distribution?.reduce(
                  (acc, item) => acc + item.value,
                  0
                )}{' '}
                học sinh
              </div>
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <PieChart>
                <Pie
                  data={mockData?.student_status_distribution}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey='value'
                >
                  {mockData?.student_status_distribution.map((entry, index) => (
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

        {/* New Students & Level Distribution */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* New Students by Month */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Học Viên Mới Theo Tháng
              </h2>
              <div className='text-sm text-gray-500'>
                {mockData?.new_students?.new_students} học viên năm nay
              </div>
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <LineChart data={mockData?.new_students_by_month}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f0f0f0'
                />
                <XAxis
                  dataKey='month'
                  stroke='#6B7280'
                />
                <YAxis stroke='#6B7280' />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='newStudents'
                  stroke='#10B981'
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Level Distribution */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Học sinh theo cấp độ
              </h2>
              <div className='text-sm text-gray-500'>
                {mockData?.level_distribution?.reduce(
                  (acc, item) => acc + item.count,
                  0
                )}{' '}
                tổng
              </div>
            </div>
            <ResponsiveContainer
              width='100%'
              height={300}
            >
              <BarChart
                data={mockData?.level_distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#f0f0f0'
                />
                <XAxis
                  dataKey='level'
                  stroke='#6B7280'
                />
                <YAxis stroke='#6B7280' />
                <Tooltip formatter={(value) => [value, 'Học sinh']} />
                <Bar
                  dataKey='count'
                  radius={[4, 4, 0, 0]}
                >
                  {mockData?.level_distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Top 5 lớp học theo số lượng tuyển sinh
              </h2>
              <Award className='w-5 h-5 text-yellow-500' />
            </div>
            <div className='space-y-4'>
              {mockData?.top_classes.map((classItem, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold'>
                      {index + 1}
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {classItem.className}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {classItem.teacher} • Lớp {classItem.room}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <UserCheck className='w-4 h-4 text-gray-400' />
                    <span className='font-semibold text-gray-900'>
                      {classItem.student_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Teachers */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Giáo viên hàng đầu theo số lượng lớp học
              </h2>
              <GraduationCap className='w-5 h-5 text-purple-500' />
            </div>
            <div className='space-y-4'>
              {mockData?.top_teachers.map((teacher, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold'>
                      {index + 1}
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {teacher.name}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {teacher.specialization}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-900'>
                      {teacher.class_count} lớp
                    </p>
                    <p className='text-sm text-gray-500'>
                      {teacher.students} học sinh
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional KPIs Row */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <StatCard
            title={mockData?.average_class_size?.title}
            value={mockData?.average_class_size?.value}
            icon={<Users className='w-6 h-6 text-blue-600' />}
            subtitle={mockData?.average_class_size?.subtitle}
          />
          <StatCard
            title={mockData?.teacher_utilization?.title}
            value={mockData?.teacher_utilization?.value}
            icon={<Clock className='w-6 h-6 text-green-600' />}
            subtitle={mockData?.teacher_utilization?.subtitle}
          />
          <StatCard
            title={mockData?.monthly_growth?.title}
            value={mockData?.monthly_growth?.value}
            icon={<TrendingUp className='w-6 h-6 text-purple-600' />}
            subtitle={mockData?.monthly_growth?.subtitle}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
