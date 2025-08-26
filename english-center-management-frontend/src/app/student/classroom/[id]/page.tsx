'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  MapPin,
  User,
  Award,
  MessageCircle,
  ArrowLeft,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  TrendingUp,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import { useStudentApi } from '../../_hooks/use-api';
import {
  AttendanceStudentResponse,
  ClassroomResponse,
  EnrollmentScoreResponse,
  HomeworkStudentResponse,
} from '../../../../types/student';
import { formatDays } from '../../../staff/list-classroom/[id]/page';
import { HomeworkStatus } from '../../../teacher/_hooks/use-homework';
import { ExamResponse } from '../../../teacher/_hooks/use-exam';
import { LRSkillBand, LSRWSkillBand } from '../../../teacher/exam/[id]/page';
import { render } from 'react-dom';

export interface ScoreNested {
  id: string;
  listening: number | null;
  reading: number | null;
  speaking: number | null;
  writing: number | null;
  feedback: string | null;
}

const ClassDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const {
    loading,
    getClassDetails,
    getScoresByStudentId,
    getExamsByStudentId,
    getHomeworksByStudentId,
    getAttendancesByStudentId,
  } = useStudentApi();
  const [classData, setClassData] = useState<ClassroomResponse | null>(null);
  const [scores, setScores] = useState<EnrollmentScoreResponse>();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [exams, setExams] = useState<ExamResponse[]>();
  const [homeworks, setHomeworks] = useState<HomeworkStudentResponse[]>();
  const [attendances, setAttendances] = useState<AttendanceStudentResponse[]>();
  const [activeTab, setActiveTab] = useState<
    'homeworks' | 'scores' | 'attendances' | 'exams'
  >('scores');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classId = params.id as string;
        const [
          classDetails,
          scoresDetail,
          homeworksDetail,
          attendancesDetail,
          examsDetail,
        ] = await Promise.all([
          getClassDetails(classId),
          getScoresByStudentId(classId),
          getHomeworksByStudentId(),
          getAttendancesByStudentId(),
          getExamsByStudentId(classId),
        ]);
        setClassData(classDetails);
        setScores(scoresDetail);
        setHomeworks(
          homeworksDetail.filter((v) => v.session.class_id === classId)
        );
        setAttendances(
          attendancesDetail.filter((v) => v.session.class_id === classId)
        );
        setExams(examsDetail.exams);
        setStudentId(examsDetail.student_id);
      } catch (err) {
        console.error('Error fetching class details:', err);
        router.push('/student/classroom');
      }
    };

    fetchClassData();
  }, [params.id, router, getClassDetails]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case HomeworkStatus.PASSED:
        return 'bg-green-100 text-green-800 border-green-200';
      case HomeworkStatus.FAILED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case HomeworkStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number | null) => {
    if (score === null) return 'bg-gray-50';
    if (score >= 8) return 'bg-green-50';
    if (score >= 6) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Đang tải thông tin lớp...</p>
        </div>
      </div>
    );
  }

  const renderAchievementsTab = () => (
    <div className='space-y-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg flex items-center justify-center'>
          <Award className='w-5 h-5 text-orange-600' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>Bài thi</h3>
      </div>

      {exams.length > 0 ? (
        <div className='space-y-4'>
          {exams.map((exam) => {
            const skills = !['A1', 'A2', 'B1', 'B2'].includes(
              exam.classroom.course_level.toUpperCase()
            )
              ? ['speaking', 'writing']
              : ['listening', 'reading'];

            const selectedSkillBands = ['A1', 'A2', 'B1', 'B2'].includes(
              exam.classroom.course_level.toUpperCase()
            )
              ? LRSkillBand
              : LSRWSkillBand;
            return (
              <div
                key={exam.id}
                className='group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center'>
                      <GraduationCap className='w-6 h-6 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 group-hover:text-purple-700 transition-colors'>
                        {exam?.classroom.class_name}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        #{exam.classroom.id.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-8 mb-4'>
                  {skills.includes('listening') && (
                    <div className='text-center p-3 bg-blue-50 rounded-lg'>
                      <div className='text-lg font-bold text-blue-600 mb-1'>
                        {exam.scores.find(
                          (score) => score.student_id === studentId
                        ).listening || '--'}{' '}
                        / {selectedSkillBands.listening}
                      </div>
                      <div className='text-xs text-gray-600'>Nghe</div>
                    </div>
                  )}

                  {skills.includes('reading') && (
                    <div className='text-center p-3 bg-green-50 rounded-lg'>
                      <div className='text-lg font-bold text-green-600 mb-1'>
                        {exam.scores.find(
                          (score) => score.student_id === studentId
                        ).reading || '--'}{' '}
                        / {selectedSkillBands.reading}
                      </div>
                      <div className='text-xs text-gray-600'>Đọc</div>
                    </div>
                  )}

                  {skills.includes('speaking') && (
                    <div className='text-center p-3 bg-orange-50 rounded-lg'>
                      <div className='text-lg font-bold text-orange-600 mb-1'>
                        {exam.scores.find(
                          (score) => score.student_id === studentId
                        ).speaking || '--'}
                        / {(selectedSkillBands as any).speaking}
                      </div>
                      <div className='text-xs text-gray-600'>Nói</div>
                    </div>
                  )}

                  {skills.includes('writing') && (
                    <div className='text-center p-3 bg-purple-50 rounded-lg'>
                      <div className='text-lg font-bold text-purple-600 mb-1'>
                        {exam.scores.find(
                          (score) => score.student_id === studentId
                        ).writing || '--'}{' '}
                        / {(selectedSkillBands as any).writing}
                      </div>
                      <div className='text-xs text-gray-600'>Viết</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Award className='w-8 h-8 text-gray-400' />
          </div>
          <h4 className='text-lg font-medium text-gray-900 mb-2'>
            Chưa có thành tích học tập
          </h4>
          <p className='text-gray-500'>
            Thành tích và điểm số sẽ được hiển thị ở đây khi học viên hoàn thành
            các bài kiểm tra.
          </p>
        </div>
      )}
    </div>
  );

  if (!classData) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Không tìm thấy lớp
          </h2>
          <p className='text-gray-600 mb-6'>
            Lớp bạn đang tìm kiếm không tồn tại.
          </p>
          <button
            onClick={() => router.push('/student/classroom')}
            className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors'
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const renderScoresTab = () => {
    const skills = ['A1', 'A2', 'B1', 'B2'].includes(
      scores?.classroom?.course_level
    )
      ? ['listening', 'reading']
      : ['speaking', 'writing'];

    const skillBands = ['A1', 'A2', 'B1', 'B2'].includes(
      scores?.classroom?.course_level
    )
      ? LRSkillBand
      : LSRWSkillBand;

    return (
      <div className='space-y-6'>
        {scores?.score ? (
          <div className='space-y-6'>
            <div className='bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-5 h-5 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    Tổng quan điểm số
                  </h4>
                  <p className='text-sm text-gray-600'>
                    Kết quả đánh giá các kỹ năng
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-8'>
                {[
                  { key: 'listening', label: 'Nghe', icon: '🎧' },
                  { key: 'reading', label: 'Đọc', icon: '📖' },
                  { key: 'speaking', label: 'Nói', icon: '🗣️' },
                  { key: 'writing', label: 'Viết', icon: '✍️' },
                ]
                  .filter((skill) => skills.includes(skill.key))
                  .map((skill) => {
                    const score =
                      scores.score[
                        skill.key as keyof Omit<ScoreNested, 'id' | 'feedback'>
                      ];
                    return (
                      <div
                        key={skill.key}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreBackground(
                          score
                        )} hover:shadow-md`}
                      >
                        <div className='text-center'>
                          <div className='text-2xl mb-2'>{skill.icon}</div>
                          <p className='text-sm font-medium text-gray-700 mb-1'>
                            {skill.label}
                          </p>
                          <p
                            className={`text-2xl font-bold ${getScoreColor(
                              score
                            )}`}
                          >
                            {score ? score : '--'}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            / {skillBands[skill.key]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Feedback Section */}
            {scores.score.feedback && (
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200'>
                <div className='flex items-start gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-1'>
                    <MessageCircle className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      Nhận xét từ giáo viên
                    </h4>
                    <p className='text-gray-700 leading-relaxed'>
                      {scores.score.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Award className='w-8 h-8 text-gray-400' />
            </div>
            <h4 className='text-lg font-medium text-gray-900 mb-2'>
              Chưa có điểm số
            </h4>
            <p className='text-gray-500'>
              Điểm số sẽ được cập nhật sau khi giáo viên chấm bài và đánh giá.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <button
          onClick={() => router.push('/student/classroom')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Quay lại</span>
        </button>
        <div className='flex-1'>
          <h1 className='text-xl font-bold text-gray-900'>
            {classData.class_name}
          </h1>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
              <User className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Giáo viên</p>
              <p className='font-medium text-gray-900'>
                {classData.teacher?.name}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
              <Clock className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Lịch học</p>
              <p className='font-medium text-gray-900'>
                {classData.schedules && classData.schedules.length > 0
                  ? formatDays(classData.schedules.map((s) => s.weekday))
                  : 'Chưa có lịch học'}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
              <MapPin className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Phòng học</p>
              <p className='font-medium text-gray-900'>{classData.room}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-4 border border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
              <Target className='w-5 h-5 text-orange-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Trạng thái</p>
              <p className='font-medium text-gray-900'>
                {classData.status === 'active' && 'Đang học'}
                {classData.status === 'cancelled' && 'Đã hủy'}
                {classData.status === 'completed' && 'Hoàn thành'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex border-b border-gray-200'>
          {[
            { id: 'scores', label: 'Điểm số', icon: Award },
            { id: 'exams', label: 'Kỳ thi', icon: ClipboardList },
            { id: 'homeworks', label: 'Bài tập về nhà', icon: BookOpen },
            { id: 'attendances', label: 'Điểm danh', icon: CheckCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className='w-4 h-4' />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'homeworks' && (
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <BookOpen className='w-4 h-4 text-blue-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Danh sách bài tập
                </h3>
                <span className='px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full'>
                  {homeworks?.length || 0} bài tập
                </span>
              </div>

              <div className='space-y-4'>
                {homeworks && homeworks.length > 0 ? (
                  homeworks
                    .sort(
                      (a, b) =>
                        new Date(b.session.created_at).getTime() -
                        new Date(a.session.created_at).getTime()
                    )
                    .map((homework) => (
                      <div
                        key={homework.id}
                        className='group p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-purple-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50'
                      >
                        <div className='flex items-start justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center'>
                              <FileText className='w-5 h-5 text-purple-600' />
                            </div>
                            <div>
                              <h4 className='font-semibold text-gray-900 group-hover:text-purple-700 transition-colors'>
                                {homework.session.topic}
                              </h4>
                              <div className='flex items-center gap-2 mt-1'>
                                <Calendar className='w-3 h-3 text-gray-400' />
                                <span className='text-xs text-gray-500'>
                                  Buổi học: #
                                  {homework.session.id.substring(0, 5)} -{' '}
                                  {new Date(
                                    homework.session.created_at
                                  ).toLocaleString('vi-VN', {
                                    timeZone: 'Asia/Ho_Chi_Minh',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                homework.status
                              )}`}
                            >
                              {homework.status === HomeworkStatus.PASSED
                                ? 'Đạt'
                                : homework.status === HomeworkStatus.PENDING
                                ? 'Chờ đánh giá'
                                : 'Không đạt'}
                            </span>
                            {homework.status === HomeworkStatus.PASSED ? (
                              <CheckCircle className='w-4 h-4 text-green-500' />
                            ) : homework.status === HomeworkStatus.FAILED ? (
                              <XCircle className='w-4 h-4 text-red-500' />
                            ) : (
                              <Clock className='w-4 h-4 text-yellow-500' />
                            )}
                          </div>
                        </div>

                        <div className='mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400'>
                          <div className='flex items-start gap-2'>
                            <MessageCircle className='w-4 h-4 text-blue-600 mt-0.5' />
                            <div>
                              <p className='text-sm font-medium text-blue-900 mb-1'>
                                Phản hồi từ giáo viên:
                              </p>
                              <p className='text-sm text-blue-800'>
                                {homework.feedback
                                  ? homework.feedback
                                  : 'Chưa đánh giá'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <BookOpen className='w-8 h-8 text-gray-400' />
                    </div>
                    <h4 className='text-lg font-medium text-gray-900 mb-2'>
                      Chưa có bài tập nào
                    </h4>
                    <p className='text-gray-500'>
                      Bài tập về nhà sẽ được hiển thị ở đây khi giáo viên giao
                      bài.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'scores' && renderScoresTab()}

          {activeTab === 'exams' && renderAchievementsTab()}

          {activeTab === 'attendances' && (
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <Calendar className='w-4 h-4 text-green-600' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Lịch sử điểm danh
                </h3>
                <span className='px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                  {attendances?.length || 0} buổi học
                </span>
              </div>

              <div className='space-y-4'>
                {attendances && attendances.length > 0 ? (
                  attendances
                    .sort(
                      (a, b) =>
                        new Date(b.session.created_at).getTime() -
                        new Date(a.session.created_at).getTime()
                    )
                    .map((attendance) => (
                      <div
                        key={attendance.id}
                        className='group p-5 border border-gray-200 rounded-xl hover:shadow-md hover:border-green-200 transition-all duration-200 bg-gradient-to-r from-white to-gray-50'
                      >
                        <div className='flex items-start justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center'>
                              <Calendar className='w-5 h-5 text-green-600' />
                            </div>
                            <div>
                              <h4 className='font-semibold text-gray-900 group-hover:text-green-700 transition-colors'>
                                {attendance.session.topic}
                              </h4>
                              <div className='flex items-center gap-2 mt-1'>
                                <Clock className='w-3 h-3 text-gray-400' />
                                <span className='text-xs text-gray-500'>
                                  Buổi học: #
                                  {attendance.session.id.substring(0, 5)} -{' '}
                                  {new Date(
                                    attendance.session.created_at
                                  ).toLocaleString('vi-VN', {
                                    timeZone: 'Asia/Ho_Chi_Minh',
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center gap-2'>
                            {attendance.is_present ? (
                              <>
                                <span className='px-3 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200'>
                                  Có mặt
                                </span>
                                <CheckCircle className='w-4 h-4 text-green-500' />
                              </>
                            ) : (
                              <>
                                <span className='px-3 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200'>
                                  Vắng mặt
                                </span>
                                <XCircle className='w-4 h-4 text-red-500' />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className='text-center py-12'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                      <Calendar className='w-8 h-8 text-gray-400' />
                    </div>
                    <h4 className='text-lg font-medium text-gray-900 mb-2'>
                      Chưa có dữ liệu điểm danh
                    </h4>
                    <p className='text-gray-500'>
                      Lịch sử điểm danh sẽ được hiển thị ở đây sau các buổi học.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
