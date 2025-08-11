'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Briefcase,
  Target,
  Baby,
  MessageCircle,
  Award,
} from 'lucide-react';
import { useStaffCourseApi } from '../_hooks';
import { CourseResponse } from '../../../types/staff';

export default function CourseManagement() {
  const { loading, error, getCourses } = useStaffCourseApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [courses, setCourses] = useState<CourseResponse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, [getCourses]);

  const processedCourses = courses.map(
    (course: CourseResponse, index: number) => ({
      id: course.id,
      title: course.course_name || 'Khóa học không có tên',
      description: course.description || 'Không có mô tả',
      classCount: 8, // Default class count
      levels: [
        course.level
          ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
          : 'N/A',
      ],
      icon:
        index % 4 === 0
          ? 'book'
          : index % 4 === 1
          ? 'briefcase'
          : index % 4 === 2
          ? 'target'
          : 'baby',
      color:
        index % 4 === 0
          ? 'teal'
          : index % 4 === 1
          ? 'purple'
          : index % 4 === 2
          ? 'red'
          : 'yellow',
    })
  );

  const getIcon = (iconType: string) => {
    const iconProps = { className: 'w-8 h-8' };
    switch (iconType) {
      case 'book':
        return <BookOpen {...iconProps} />;
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'baby':
        return <Baby {...iconProps} />;
      case 'message':
        return <MessageCircle {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      default:
        return <BookOpen {...iconProps} />;
    }
  };

  const filteredCourses = processedCourses.filter((course) => {
    const matchesSearch =
      (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (course.description?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      );

    const matchesLevel =
      levelFilter === 'all' ||
      course.levels.some((level) =>
        (level?.toLowerCase() || '').includes(levelFilter.toLowerCase())
      );

    return matchesSearch && matchesLevel;
  });

  return (
    <div className='h-full w-full'>
      <div>
        {/* Page Title */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Danh sách khóa học
          </h2>
        </div>

        {/* Loading state */}
        {loading && (
          <div className='flex justify-center items-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className='flex gap-4 mb-6'>
          <div className='flex-1 max-w-md relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='Tìm kiếm khóa học...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
            />
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent'
          >
            <option value='all'>Tất cả trình độ</option>
            <option value='beginner'>Sơ cấp</option>
            <option value='intermediate'>Trung cấp</option>
            <option value='advanced'>Nâng cao</option>
          </select>
        </div>

        {/* Course Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div
                    className={`p-3 rounded-lg bg-${course.color}-100 text-${course.color}-600`}
                  >
                    {getIcon(course.icon)}
                  </div>
                  <span className='px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                    Đang hoạt động
                  </span>
                </div>

                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {course.title}
                </h3>
                <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                  {course.description}
                </p>

                <div className='flex items-center justify-between text-sm text-gray-500'>
                  <span>{course.classCount} lớp</span>
                  <div className='flex gap-1'>
                    {course.levels.map((level, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs'
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>

                <button className='w-full mt-4 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors'>
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
