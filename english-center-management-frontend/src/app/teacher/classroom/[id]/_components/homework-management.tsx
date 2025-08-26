import React, { useEffect, useState } from 'react';
import { UserCheck, X, Users, Check, UserX, Eye, Save } from 'lucide-react';
import {
  HomeworkStatus,
  SessionHomeworkResponse,
  useHomeworkApi,
} from '../../../_hooks/use-homework';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
}

interface EnrollmentNested {
  id: string;
  student?: Student;
}

const HomeworkManagement: React.FC<{
  classId: string;
  enrollments: EnrollmentNested[];
}> = ({ classId, enrollments }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<SessionHomeworkResponse | null>(null);

  const [sessionHomeworks, setSessionHomeworks] = useState<
    SessionHomeworkResponse[]
  >([]);

  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({});
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});

  const { updateHomework, getSessionHomeworks } = useHomeworkApi();

  const fetchData = async () => {
    try {
      const response = await getSessionHomeworks(classId);
      setSessionHomeworks(response);

      const initialFeedbacks: { [key: string]: string } = {};
      response.forEach((session) => {
        session.homeworks.forEach((homework) => {
          initialFeedbacks[homework.id] = homework.feedback || '';
        });
      });
      setFeedbacks(initialFeedbacks);
    } catch (err) {
      console.error('Error fetching class data:', err);
    }
  };

  const toggleHomeworkStatus = async (
    homeworkId: string,
    studentId: string,
    newStatus: HomeworkStatus
  ) => {
    try {
      await updateHomework(homeworkId, {
        status: newStatus,
        student_id: studentId,
        feedback: feedbacks[homeworkId] || '',
      });

      setSessionHomeworks((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          homeworks: session.homeworks.map((homework) =>
            homework.id === homeworkId
              ? { ...homework, status: newStatus }
              : homework
          ),
        }))
      );

      if (selectedSession) {
        setSelectedSession((prevSession) => ({
          ...prevSession!,
          homeworks: prevSession!.homeworks.map((homework) =>
            homework.id === homeworkId
              ? { ...homework, status: newStatus }
              : homework
          ),
        }));
      }
      toast.success('Cập nhật thành công!');
    } catch (error) {
      console.error('Error updating homework status:', error);
      toast.error(error.detail || 'Cập nhật không thành công!');
    }
  };

  const updateFeedback = async (homeworkId: string, studentId: string) => {
    try {
      setUpdating((prev) => ({ ...prev, [homeworkId]: true }));

      const homework = selectedSession?.homeworks.find(
        (h) => h.id === homeworkId
      );

      await updateHomework(homeworkId, {
        status: homework?.status || HomeworkStatus.PENDING,
        student_id: studentId,
        feedback: feedbacks[homeworkId] || '',
      });

      // Cập nhật feedback trong state
      setSessionHomeworks((prevSessions) =>
        prevSessions.map((session) => ({
          ...session,
          homeworks: session.homeworks.map((homework) =>
            homework.id === homeworkId
              ? { ...homework, feedback: feedbacks[homeworkId] || '' }
              : homework
          ),
        }))
      );

      if (selectedSession) {
        setSelectedSession((prevSession) => ({
          ...prevSession!,
          homeworks: prevSession!.homeworks.map((homework) =>
            homework.id === homeworkId
              ? { ...homework, feedback: feedbacks[homeworkId] || '' }
              : homework
          ),
        }));
      }

      toast.success('Cập nhật thành công!');
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error(error.detail || 'Cập nhật không thành công!');
    } finally {
      setUpdating((prev) => ({ ...prev, [homeworkId]: false }));
    }
  };

  const handleFeedbackChange = (homeworkId: string, value: string) => {
    setFeedbacks((prev) => ({
      ...prev,
      [homeworkId]: value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Quản lý bài tập về nhà
        </h3>
      </div>

      {sessionHomeworks.length === 0 ? (
        <div className='bg-gray-50 rounded-lg p-6 text-center'>
          <UserCheck className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h4 className='text-lg font-medium text-gray-900 mb-2'>
            Không có bài tập về nhà
          </h4>
        </div>
      ) : (
        <div className='space-y-3'>
          {sessionHomeworks
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((session) => {
              const pendingCount = session.homeworks.filter(
                (a) => a.status === HomeworkStatus.PENDING
              ).length;
              const passedCount = session.homeworks.filter(
                (a) => a.status === HomeworkStatus.PASSED
              ).length;
              const failedCount = session.homeworks.filter(
                (a) => a.status === HomeworkStatus.FAILED
              ).length;

              return (
                <div
                  key={session.id}
                  className='p-4 border border-gray-200 rounded-lg bg-white shadow-sm'
                >
                  <div className='flex items-center justify-between'>
                    <h4 className='text-base font-semibold text-gray-900'>
                      {session.topic || 'Buổi học'}
                    </h4>
                    <span className='text-sm text-gray-500'>
                      {new Date(session.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className='mt-2 flex space-x-4 items-center justify-between'>
                    <div className='flex space-x-4 text-sm'>
                      <span className='inline-flex items-center text-green-600'>
                        <div className='w-2 h-2 rounded-full bg-green-500 mr-1'></div>
                        Đạt: {passedCount}
                      </span>
                      <span className='inline-flex items-center text-red-600'>
                        <div className='w-2 h-2 rounded-full bg-red-500 mr-1'></div>
                        Không đạt: {failedCount}
                      </span>
                      <span className='inline-flex items-center text-orange-600'>
                        <div className='w-2 h-2 rounded-full bg-orange-500 mr-1'></div>
                        Chưa chấm: {pendingCount}
                      </span>
                      <span className='text-gray-700'>
                        Tổng: {session.homeworks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowDetailModal(true);
                      }}
                      className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <Eye className='w-4 h-4 mr-2' />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {showDetailModal && selectedSession && (
        <div className='fixed inset-0 bg-black !mt-0 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-6xl w-[95vw] mx-4 max-h-[90vh] flex flex-col'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <div className='flex items-center'>
                <Eye className='w-6 h-6 text-blue-600 mr-3' />
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Đánh giá bài tập về nhà
                  </h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    {selectedSession.topic || 'Buổi học'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {selectedSession.homeworks.length}
                  </div>
                  <div className='text-sm text-gray-600'>Tổng học viên</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {
                      selectedSession.homeworks.filter(
                        (a) => a.status === HomeworkStatus.PASSED
                      ).length
                    }
                  </div>
                  <div className='text-sm text-gray-600'>Đạt</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {
                      selectedSession.homeworks.filter(
                        (a) => a.status === HomeworkStatus.FAILED
                      ).length
                    }
                  </div>
                  <div className='text-sm text-gray-600'>Không đạt</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {Math.round(
                      (selectedSession.homeworks.filter(
                        (a) => a.status === HomeworkStatus.PASSED
                      ).length /
                        selectedSession.homeworks.length) *
                        100
                    )}
                    %
                  </div>
                  <div className='text-sm text-gray-600'>Tỷ lệ đạt</div>
                </div>
              </div>
            </div>

            <div className='p-6 overflow-y-auto flex-1'>
              <div className='mb-4'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Danh sách học viên
                </h3>

                <div className='space-y-4'>
                  {selectedSession.homeworks.map((homework, index) => {
                    const student = enrollments?.find(
                      (s) => s.student.id === homework.student_id
                    );
                    return (
                      <div
                        key={index}
                        className='border border-gray-200 rounded-lg bg-white'
                      >
                        <div className='flex items-center justify-between p-4'>
                          <div className='flex items-center'>
                            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                              <span className='text-blue-600 font-medium text-sm'>
                                {student?.student?.name?.charAt(0) || '-'}
                              </span>
                            </div>
                            <div>
                              <h4 className='font-medium text-gray-900'>
                                {student?.student?.name || '-'}
                              </h4>
                              <p className='text-sm text-gray-500'>
                                ID: {homework.student_id}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center space-x-3'>
                            {homework.status === HomeworkStatus.PASSED ? (
                              <button
                                onClick={() =>
                                  toggleHomeworkStatus(
                                    homework.id,
                                    homework.student_id,
                                    HomeworkStatus.FAILED
                                  )
                                }
                                className='flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors cursor-pointer'
                              >
                                <Check className='w-4 h-4 mr-1' />
                                Đạt
                              </button>
                            ) : homework.status === HomeworkStatus.FAILED ? (
                              <button
                                onClick={() =>
                                  toggleHomeworkStatus(
                                    homework.id,
                                    homework.student_id,
                                    HomeworkStatus.PASSED
                                  )
                                }
                                className='flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer'
                              >
                                <X className='w-4 h-4 mr-1' />
                                Không đạt
                              </button>
                            ) : (
                              <div className='flex items-center space-x-2'>
                                <button
                                  onClick={() =>
                                    toggleHomeworkStatus(
                                      homework.id,
                                      homework.student_id,
                                      HomeworkStatus.PASSED
                                    )
                                  }
                                  className='flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium hover:bg-green-200 transition-colors'
                                >
                                  <Check className='w-4 h-4 mr-1' />
                                  Đạt
                                </button>
                                <button
                                  onClick={() =>
                                    toggleHomeworkStatus(
                                      homework.id,
                                      homework.student_id,
                                      HomeworkStatus.FAILED
                                    )
                                  }
                                  className='flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium hover:bg-red-200 transition-colors'
                                >
                                  <UserX className='w-4 h-4 mr-1' />
                                  Không đạt
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Phần feedback */}
                        <div className='px-4 pb-4 border-t border-gray-100 bg-gray-50'>
                          <div className='pt-3'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              Nhận xét
                            </label>
                            <div className='flex space-x-2'>
                              <input
                                value={feedbacks[homework.id] || ''}
                                onChange={(e) =>
                                  handleFeedbackChange(
                                    homework.id,
                                    e.target.value
                                  )
                                }
                                placeholder='Nhập nhận xét cho học viên...'
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                              />
                              <button
                                onClick={() =>
                                  updateFeedback(
                                    homework.id,
                                    homework.student_id
                                  )
                                }
                                disabled={updating[homework.id]}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                              >
                                {updating[homework.id] ? (
                                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2'></div>
                                ) : (
                                  <Save className='w-4 h-4 mr-2' />
                                )}
                                {updating[homework.id]
                                  ? 'Đang lưu...'
                                  : 'Cập nhật'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedSession.homeworks.length === 0 && (
                  <div className='text-center py-8'>
                    <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500'>
                      Không có dữ liệu bài tập về nhà
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg'>
              <div className='flex items-center justify-between'>
                <div></div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkManagement;
