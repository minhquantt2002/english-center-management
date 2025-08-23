'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  BookOpen,
  Calendar,
  Users,
} from 'lucide-react';
import ExamCreateModal from './_components/create-exam';
import ExamEditModal from './_components/edit-exam';
import { ExamResponse, useExam } from '../_hooks/use-exam';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type ExamStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

const getExamStatus = (startTime: string, duration: number): ExamStatus => {
  const now = new Date();
  const examStart = new Date(startTime);
  const examEnd = new Date(examStart.getTime() + duration * 60 * 1000); // Convert duration from minutes to milliseconds

  if (now < examStart) {
    return 'NOT_STARTED';
  } else if (now > examEnd) {
    return 'COMPLETED';
  } else {
    return 'IN_PROGRESS';
  }
};

const StatusBadge: React.FC<{ startTime: string; duration: number }> = ({
  startTime,
  duration,
}) => {
  const status = getExamStatus(startTime, duration);

  const statusConfig = {
    NOT_STARTED: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      text: 'Chưa bắt đầu',
    },
    IN_PROGRESS: {
      color: 'bg-green-100 text-green-800 border-green-200',
      text: 'Đang diễn ra',
    },
    COMPLETED: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      text: 'Đã kết thúc',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} border`}
    >
      {config.text}
    </span>
  );
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const ExamManagement: React.FC = () => {
  const router = useRouter();
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const { getExams, deleteExam } = useExam();

  const fetchExams = async () => {
    const exams = await getExams();
    setExams(exams);
  };

  useEffect(() => {
    fetchExams();
  }, [getExams]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const showTooltip = (text: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.exam_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.classroom.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteExam = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này?')) {
      await deleteExam(id);
      toast.success('Xóa bài kiểm tra thành công!');
      fetchExams();
    }
  };

  const gradeExam = (exam: ExamResponse) => {
    router.push(`/teacher/exam/${exam.id}`);
  };

  return (
    <div className='p-4'>
      {isCreateModalOpen && (
        <ExamCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          refetch={fetchExams}
        />
      )}

      {editModalOpen !== null && (
        <ExamEditModal
          isOpen={editModalOpen !== null}
          examData={editModalOpen}
          onClose={() => setEditModalOpen(null)}
          refetch={fetchExams}
        />
      )}

      <div className=''>
        {/* Header */}
        <div className='mb-4'>
          <div className='flex items-center gap-3 mb-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                Quản lý bài kiểm tra
              </h1>
              <p className='text-gray-500 mt-1'>
                Hệ thống quản lý và theo dõi bài kiểm tra
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm bài kiểm tra...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='border border-gray-200 rounded-xl px-4 py-3 pl-10 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm'
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className={`px-3 py-2 rounded-lg items-center flex font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md`}
          >
            <Plus className='h-4 w-4 mr-1.5' />
            Thêm bài kiểm tra
          </button>
        </div>

        {/* Table */}
        <div className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    <div className='flex items-center gap-2'>
                      <BookOpen className='h-4 w-4' />
                      Tên bài thi
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      Lớp học
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Mô tả
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    <div className='flex items-center gap-2'>Trạng thái</div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      Thời gian
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      Bắt đầu
                    </div>
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className='text-sm font-semibold text-gray-900 hover:cursor-pointer hover:underline'
                        onClick={() => gradeExam(exam)}
                      >
                        {exam.exam_name}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center font-semibold px-3 py-1 rounded-full text-xs bg-gradient-to-r from-orange-100 to-orange-100 text-orange-800 border border-orange-700'>
                        {exam.classroom.class_name.substring(0, 16) +
                          (exam.classroom.class_name.length > 16 ? '...' : '')}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>
                      {exam.description.substring(0, 50) +
                        (exam.description.length > 50 ? '...' : '')}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <StatusBadge
                        startTime={exam.start_time}
                        duration={exam.duration}
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-1 text-sm text-gray-900'>
                        <Clock className='h-4 w-4 text-gray-500' />
                        {exam.duration || 0} phút
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDateTime(exam.start_time)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => gradeExam(exam)}
                          onMouseEnter={(e) => showTooltip('Chấm điểm', e)}
                          onMouseLeave={hideTooltip}
                          className='text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-green-200'
                        >
                          <CheckCircle className='w-4 h-4' />
                        </button>

                        <button
                          onClick={() => setEditModalOpen(exam)}
                          onMouseEnter={(e) => showTooltip('Sửa', e)}
                          onMouseLeave={hideTooltip}
                          className='text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-orange-200'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>

                        <button
                          onClick={() => handleDeleteExam(exam.id)}
                          onMouseEnter={(e) => showTooltip('Xóa', e)}
                          onMouseLeave={hideTooltip}
                          className='text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredExams.length === 0 && (
          <div className='text-center py-16'>
            <div className='bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto'>
              <BookOpen className='h-16 w-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500 text-lg'>
                Không tìm thấy bài kiểm tra nào
              </p>
              <p className='text-gray-400 text-sm mt-2'>
                Hãy thử tìm kiếm với từ khóa khác
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip */}
      {tooltip && (
        <div
          className='fixed z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full border border-gray-700'
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.text}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
