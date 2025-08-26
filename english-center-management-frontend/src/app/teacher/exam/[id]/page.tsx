'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Save,
  Search,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { formatDateTime } from '../page';
import { ExamResponse, StudentScore, useExam } from '../../_hooks/use-exam';
import { useTeacherApi } from '../../_hooks/use-api';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

export const skillMapping = {
  listening: 'Nghe',
  speaking: 'Nói',
  reading: 'Đọc',
  writing: 'Viết',
};

export const LRSkillBand = {
  listening: 495,
  reading: 495,
  total: 990,
};

export const LSRWSkillBand = {
  listening: 200,
  reading: 200,
  speaking: 200,
  writing: 200,
  total: 1000,
};

const ExamDetailPage = () => {
  const { id: examId } = useParams<{ id: string }>();
  const [scores, setScores] = useState<StudentScore[]>([]);
  const [originalScores, setOriginalScores] = useState<StudentScore[]>([]);
  const [exam, setExam] = useState<ExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const selectedSkills = useMemo(
    () =>
      ['A1', 'A2', 'B1', 'B2'].includes(exam?.classroom.course_level)
        ? ['listening', 'reading']
        : ['speaking', 'writing'],
    [exam?.classroom.course_level]
  );

  const selectedSkillBands = useMemo(
    () =>
      ['A1', 'A2', 'B1', 'B2'].includes(exam?.classroom.course_level)
        ? LRSkillBand
        : LSRWSkillBand,
    [exam?.classroom.course_level]
  );

  const { getExamById } = useExam();
  const { updateScore } = useTeacherApi();

  useEffect(() => {
    const fetchExam = async () => {
      const exam = await getExamById(examId);
      if (exam) {
        setScores(exam?.scores ?? []);
        setOriginalScores(exam?.scores ?? []);
      }
      setExam(exam);
    };

    fetchExam();
  }, [examId, getExamById]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return scores;

    return scores.filter((score) => {
      return (
        score.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        score.student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [scores, searchTerm]);

  // Get completion stats
  const completionStats = useMemo(() => {
    const total = scores.length;
    const completed = scores.filter((student) =>
      selectedSkills.every(
        (skill) =>
          student[skill as keyof StudentScore] !== null &&
          student[skill as keyof StudentScore] !== undefined
      )
    ).length;

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [scores, selectedSkills]);

  // Check if a student's score has been modified
  const hasStudentScoreChanged = (scoreId: string) => {
    const current = scores.find((s) => s.id === scoreId);
    const original = originalScores.find((s) => s.id === scoreId);

    if (!current || !original) return false;

    return (
      current.listening !== original.listening ||
      current.speaking !== original.speaking ||
      current.reading !== original.reading ||
      current.writing !== original.writing ||
      current.feedback !== original.feedback
    );
  };

  // Calculate total score for a student
  const calculateTotalScore = (student: StudentScore) => {
    const skillScores = selectedSkills
      .map((skill) => student[skill as keyof StudentScore])
      .filter((score) => score !== null && score !== undefined) as number[];

    if (skillScores.length === 0) return null;

    const total = skillScores.reduce((sum, score) => sum + score, 0);
    return total;
  };

  const updateStudentScore = (
    scoreId: string,
    skill: string,
    value: string
  ) => {
    // Only allow empty string or integers
    if (value !== '' && (!/^\d+$/.test(value) || isNaN(parseInt(value)))) {
      return;
    }

    const numValue = value === '' ? null : parseInt(value);
    if (
      numValue !== null &&
      (numValue < 0 || numValue > selectedSkillBands[skill])
    )
      return;

    setScores((prev) =>
      prev.map((student) =>
        student.id === scoreId ? { ...student, [skill]: numValue } : student
      )
    );
  };

  const updateStudentFeedback = (scoreId: string, feedback: string) => {
    setScores((prev) =>
      prev.map((student) =>
        student.id === scoreId ? { ...student, feedback } : student
      )
    );
  };

  const saveStudentScore = async (scoreId: string) => {
    if (!updateScore) return;

    try {
      setIsLoading((prev) => ({ ...prev, [scoreId]: true }));

      const score = scores.find((s) => s.id === scoreId);
      if (!score) return;

      await updateScore(score.id, {
        listening: score.listening,
        speaking: score.speaking,
        reading: score.reading,
        writing: score.writing,
        feedback: score.feedback,
      });

      // Update original scores after successful save
      setOriginalScores((prev) =>
        prev.map((s) => (s.id === scoreId ? { ...score } : s))
      );

      toast.success(`Cập nhật điểm thành công!`);
    } catch (error) {
      console.error('Error saving score:', error);
      toast.error('Có lỗi xảy ra khi cập nhật điểm!');
    } finally {
      setIsLoading((prev) => ({ ...prev, [scoreId]: false }));
    }
  };

  const getStudentCompletion = (student: StudentScore) => {
    const completedSkills = selectedSkills.filter(
      (skill) =>
        student[skill as keyof StudentScore] !== null &&
        student[skill as keyof StudentScore] !== undefined
    ).length;
    return Math.round((completedSkills / selectedSkills.length) * 100);
  };

  return (
    <div className='mx-auto p-4'>
      {/* Header */}
      <div className='mb-4'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          {exam?.exam_name}
        </h1>

        {/* Exam Info Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <BookOpen className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Lớp học</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {exam?.classroom.class_name}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Calendar className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Thời gian thi</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {formatDateTime(exam?.start_time)}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <Clock className='w-6 h-6 text-orange-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Thời lượng</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {exam?.duration} phút
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Users className='w-6 h-6 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Học sinh</p>
                <p className='text-lg font-semibold text-gray-900'>
                  {scores?.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {exam?.description && (
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              Mô tả bài thi
            </h3>
            <p className='text-gray-700 leading-relaxed'>{exam?.description}</p>
          </div>
        )}
      </div>

      {/* Grade Management Section */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              Quản lý điểm số
            </h2>
            <p className='text-gray-600 mt-1'>
              <span>Tiến độ chấm điểm</span> {completionStats.completed}/
              {completionStats.total}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className='relative mb-6'>
          <input
            type='text'
            placeholder='Tìm kiếm học sinh theo tên hoặc email...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
        </div>
      </div>

      {/* Students List */}
      <div className='space-y-4'>
        {filteredStudents.map((score) => {
          const completion = getStudentCompletion(score);
          const hasChanged = hasStudentScoreChanged(score.id);
          const totalScore = calculateTotalScore(score);

          return (
            <div
              key={score.id}
              className='bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-all duration-200'
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-1 flex items-center space-x-2'>
                      <h3 className='text-lg font-semibold text-gray-900 '>
                        {score.student.name} -
                      </h3>
                      <p className='text-gray-600'>{score.student.email}</p>
                      {totalScore !== null && (
                        <div className='ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
                          Tổng điểm: {totalScore}/{selectedSkillBands.total}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => saveStudentScore(score.id)}
                    disabled={isLoading[score.id] || !hasChanged}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                      isLoading[score.id]
                        ? 'bg-gray-400 cursor-not-allowed'
                        : !hasChanged
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : completion === 100
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } ${
                      !hasChanged && !isLoading[score.id]
                        ? 'text-gray-500'
                        : 'text-white'
                    } shadow-sm hover:shadow-md`}
                  >
                    {isLoading[score.id] ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4' />
                        {!completion && !hasChanged
                          ? 'Chưa chấm'
                          : hasChanged
                          ? 'Cập nhật'
                          : 'Đã lưu'}
                      </>
                    )}
                  </button>
                </div>

                {/* Skills grid */}
                <div className='grid grid-cols-2 gap-8 mb-6'>
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className='space-y-3'
                    >
                      <div className='flex items-center justify-between'>
                        <label className='block text-sm font-medium text-gray-700'>
                          {skillMapping[skill as keyof typeof skillMapping]}
                        </label>
                        {score[skill as keyof StudentScore] !== null &&
                        score[skill as keyof StudentScore] !== undefined ? (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                            <CheckCircle className='w-3 h-3 mr-1' />
                            Đã chấm
                          </span>
                        ) : (
                          <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700'>
                            <AlertCircle className='w-3 h-3 mr-1' />
                            Chưa chấm
                          </span>
                        )}
                      </div>

                      <div className='relative'>
                        <input
                          type='number'
                          min='0'
                          max={selectedSkillBands[skill]}
                          step='1'
                          value={score[skill] ?? ''}
                          onChange={(e) =>
                            updateStudentScore(score.id, skill, e.target.value)
                          }
                          placeholder={`0-${selectedSkillBands[skill]}`}
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        />
                        {score[skill] !== null &&
                          score[skill] !== undefined && (
                            <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm'>
                              /{selectedSkillBands[skill]}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback */}
                <div className='space-y-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    Nhận xét
                  </label>
                  <textarea
                    value={score.feedback}
                    onChange={(e) =>
                      updateStudentFeedback(score.id, e.target.value)
                    }
                    placeholder='Thêm nhận xét về điểm của học sinh...'
                    rows={3}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all'
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Không tìm thấy học sinh
            </h3>
            <p className='text-gray-500'>
              {searchTerm
                ? `Không có học sinh nào khớp với "${searchTerm}"`
                : 'Chưa có học sinh nào trong danh sách'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetailPage;
