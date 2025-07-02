'use client';

import React from 'react';
import { TrendingUp, Headphones, Mic, BookOpen, Eye } from 'lucide-react';
import { mockTestResults } from '../../../data';
import { TestResult } from '../../../types';

const TestResultsDashboard: React.FC = () => {
  // Use mock test results data
  const testResults = mockTestResults.map((result: TestResult) => ({
    date: new Date(result.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    course: result.courseName,
    listening:
      typeof result.scores.listening === 'number'
        ? result.scores.listening
        : parseFloat(result.scores.listening.toString()),
    speaking:
      typeof result.scores.speaking === 'number'
        ? result.scores.speaking
        : parseFloat(result.scores.speaking.toString()),
    reading:
      typeof result.scores.reading === 'number'
        ? result.scores.reading
        : parseFloat(result.scores.reading.toString()),
    writing:
      typeof result.scores.writing === 'number'
        ? result.scores.writing
        : parseFloat(result.scores.writing.toString()),
    overall: result.overall,
  }));

  // Calculate averages from actual data
  const getOverallAverage = () => {
    if (testResults.length === 0) return 0;
    const sum = testResults.reduce((acc, result) => acc + result.overall, 0);
    return (sum / testResults.length).toFixed(1);
  };

  const getLatestScores = () => {
    if (testResults.length === 0)
      return { listening: 0, speaking: 0, reading: 0, writing: 0 };
    const latest = testResults[0];
    return {
      listening: latest.listening,
      speaking: latest.speaking,
      reading: latest.reading,
      writing: latest.writing,
    };
  };

  const latestScores = getLatestScores();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Rất tốt';
    if (score >= 70) return 'Cần cải thiện';
    return 'Yếu';
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Kết quả kiểm tra & Nhận xét
          </h1>
          <p className='text-gray-600'>
            Theo dõi tiến độ học tập và xem nhận xét chi tiết từ giáo viên
          </p>
        </div>

        {/* Overall Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-gray-500'>
                Điểm trung bình
              </h3>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <TrendingUp className='w-4 h-4 text-blue-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {getOverallAverage()}%
            </div>
            <div className='flex items-center text-sm text-green-600'>
              <TrendingUp className='w-4 h-4 mr-1' />
              +3.2% từ lần kiểm tra trước
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-gray-500'>Nghe</h3>
              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <Headphones className='w-4 h-4 text-blue-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {latestScores.listening}%
            </div>
            <div className='text-sm text-green-600'>
              {getScoreLabel(latestScores.listening)}
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-gray-500'>Nói</h3>
              <div className='w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'>
                <Mic className='w-4 h-4 text-red-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {latestScores.speaking}%
            </div>
            <div className='text-sm text-yellow-600'>
              {getScoreLabel(latestScores.speaking)}
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-sm font-medium text-gray-500'>Đọc</h3>
              <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                <BookOpen className='w-4 h-4 text-green-600' />
              </div>
            </div>
            <div className='text-3xl font-bold text-gray-900 mb-2'>
              {latestScores.reading}%
            </div>
            <div className='text-sm text-blue-600'>
              {getScoreLabel(latestScores.reading)}
            </div>
          </div>
        </div>

        {/* Recent Test Results */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-8'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Kết quả kiểm tra gần đây
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Ngày kiểm tra
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Khóa học
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Nghe
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Nói
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Đọc
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Viết
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tổng điểm
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {testResults.map((result, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {result.date}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {result.course}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(
                          result.listening
                        )}`}
                      >
                        {result.listening}%
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(
                          result.speaking
                        )}`}
                      >
                        {result.speaking}%
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(
                          result.reading
                        )}`}
                      >
                        {result.reading}%
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(
                          result.writing
                        )}`}
                      >
                        {result.writing}%
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900'>
                      {result.overall}%
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <button className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors'>
                        <Eye className='w-4 h-4 text-blue-600' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-xl font-semibold text-gray-900'>
              Detailed Feedback
            </h2>
          </div>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Intermediate English - Dec 15, 2024
                </h3>
                <p className='text-sm text-gray-500'>
                  Instructor: Ms. Emily Chen
                </p>
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {getOverallAverage()}%
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              <div className='border-l-4 border-green-500 pl-4'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Listening (92%)
                </h4>
                <p className='text-sm text-gray-600'>
                  Excellent comprehension skills. You demonstrated strong
                  ability to understand native speakers and identify key
                  details.
                </p>
              </div>

              <div className='border-l-4 border-blue-500 pl-4'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Reading (89%)
                </h4>
                <p className='text-sm text-gray-600'>
                  Strong reading comprehension. You effectively identified main
                  ideas and supporting details in complex texts.
                </p>
              </div>

              <div className='border-l-4 border-yellow-500 pl-4'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Speaking (78%)
                </h4>
                <p className='text-sm text-gray-600'>
                  Good progress but focus on pronunciation and fluency. Practice
                  more conversational exercises to build confidence.
                </p>
              </div>

              <div className='border-l-4 border-green-500 pl-4'>
                <h4 className='font-semibold text-gray-900 mb-2'>
                  Writing (91%)
                </h4>
                <p className='text-sm text-gray-600'>
                  Excellent writing structure and grammar. Your essays show
                  clear organization and proper use of linking words.
                </p>
              </div>
            </div>

            <div className='bg-blue-50 rounded-lg p-6'>
              <h4 className='font-semibold text-blue-900 mb-3'>
                Recommendations for Improvement:
              </h4>
              <ul className='space-y-2 text-sm text-blue-800'>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  Practice speaking exercises daily for 15-20 minutes
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  Focus on pronunciation drills for challenging sounds
                </li>
                <li className='flex items-start'>
                  <span className='w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0'></span>
                  Join conversation practice sessions twice a week
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsDashboard;
