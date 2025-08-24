import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Plus,
  AlertCircle,
  X,
  Users,
  Check,
  UserX,
  Eye,
} from 'lucide-react';
import {
  SessionAttendanceResponse,
  useAttendanceApi,
} from '../../../_hooks/use-attendance';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
}

interface EnrollmentNested {
  id: string;
  student?: Student;
}

interface ScheduleNested {
  id: string;
  weekday: string;
  start_time: string;
  end_time: string;
}

const weekdayMap: Record<string, string> = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};

const weekdayOrder: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

function formatSchedules(list: ScheduleNested[]) {
  const today = new Date();
  const weekdayEn = today
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();

  return list
    .filter((v) => v.weekday.toLowerCase() === weekdayEn)
    .sort((a, b) => weekdayOrder[a.weekday] - weekdayOrder[b.weekday])
    .map((v) => {
      const weekdayVi = weekdayMap[v.weekday.toLowerCase()] || v.weekday;
      return {
        value: v.id,
        label: `${weekdayVi}: ${v.start_time.substring(
          0,
          5
        )} - ${v.end_time.substring(0, 5)}`,
      };
    });
}

const AttendanceManagement: React.FC<{
  classId: string;
  schedules?: ScheduleNested[];
  enrollments?: EnrollmentNested[];
}> = ({ schedules, enrollments, classId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [attendance, setAttendance] = useState<{
    [key: string]: boolean | null;
  }>({});
  const [topic, setTopic] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<SessionAttendanceResponse | null>(null);

  const [sessionAttendances, setSessionAttendances] = useState<
    SessionAttendanceResponse[]
  >([]);

  const { createAttendance, getSessionAttendances } = useAttendanceApi();

  const fetchData = async () => {
    try {
      const sessionsAttendances = await getSessionAttendances(classId);
      setSessionAttendances(sessionsAttendances);
    } catch (err) {
      console.error('Error fetching class data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEnglishWeekday = (date: Date): string => {
    const weekdays = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    return weekdays[date.getDay() as keyof typeof weekdays];
  };

  const checkTodaySchedule = (): ScheduleNested[] => {
    const today = new Date();
    const todayWeekday = getEnglishWeekday(today);

    return schedules.filter(
      (schedule) =>
        schedule.weekday.toLowerCase() === todayWeekday.toLowerCase()
    );
  };

  const handleCreateAttendance = () => {
    const todaySchedules = checkTodaySchedule();

    if (
      todaySchedules.length === 0 ||
      todaySchedules.filter(
        (v) => !sessionAttendances.map((v) => v.schedule_id).includes(v.id)
      ).length === 0
    ) {
      setShowAlert(true);
      return;
    }

    setShowModal(true);
    setAlertMessage('');
    const initialAttendance: { [key: string]: boolean } = {};
    enrollments.forEach((student) => {
      initialAttendance[student.student.id] = null;
    });
    setAttendance(initialAttendance);
  };

  const toggleAttendance = (studentId: string, status: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const saveAttendance = async () => {
    if (Object.values(attendance).findIndex((v) => v === null) !== -1) {
      setAlertMessage('Vui lòng điểm danh hết cho tất cả học viên');
      return;
    }

    if (topic.trim() == '') {
      setAlertMessage('Vui lòng nhập chủ đề buổi học');
      return;
    }

    if (selectedSchedule === null || selectedSchedule == '') {
      setAlertMessage('Vui lòng chọn ca học');
      return;
    }

    try {
      await createAttendance({
        topic,
        class_id: classId,
        schedule_id: selectedSchedule,
        attendances: Object.entries(attendance).map(
          ([student_id, is_present]) => ({
            student_id,
            is_present,
          })
        ),
      });

      setShowModal(false);

      fetchData();
      setAlertMessage('');
      setTopic('');
      setSelectedSchedule(null);
      toast.success('Điểm danh thành công!');
    } catch (error) {
      setAlertMessage('Điểm danh không thành công! Vui lòng thử lại.');
    }
  };

  const todaySchedules = checkTodaySchedule();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Quản lý điểm danh
        </h3>
        <button
          onClick={handleCreateAttendance}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <UserCheck className='w-4 h-4 mr-2' />
          Điểm danh
        </button>
      </div>

      {showAlert && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
          <div className='flex items-center'>
            <AlertCircle className='w-5 h-5 text-yellow-600 mr-3' />
            <div>
              <h4 className='text-sm font-medium text-yellow-800'>
                Không có lịch học hôm nay
              </h4>
              <p className='text-sm text-yellow-700 mt-1'>
                Hôm nay không có giờ học nào được lên lịch.
              </p>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className='ml-auto text-yellow-600 hover:text-yellow-800'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}

      {todaySchedules.filter(
        (v) => !sessionAttendances.map((v) => v.schedule_id).includes(v.id)
      ).length > 0 && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <h4 className='font-medium text-green-800 mb-2'>Lịch học hôm nay</h4>

          <div className='space-y-1'>
            {todaySchedules
              .filter(
                (v) =>
                  !sessionAttendances.map((v) => v.schedule_id).includes(v.id)
              )
              .map((schedule, index) => (
                <p
                  key={schedule.id}
                  className='text text-green-700'
                >
                  • Ca {index + 1} -{' '}
                  <strong>
                    {schedule.start_time.substring(0, 5)} -{' '}
                    {schedule.end_time.substring(0, 5)}
                  </strong>
                </p>
              ))}
          </div>
        </div>
      )}

      {sessionAttendances.length === 0 ? (
        <div className='bg-gray-50 rounded-lg p-6 text-center'>
          <UserCheck className='w-12 h-12 text-gray-400 mx-auto mb-4' />
          <h4 className='text-lg font-medium text-gray-900 mb-2'>
            Chưa có phiên điểm danh
          </h4>
          <p className='text-gray-500 mb-4'>
            Tạo phiên điểm danh mới để bắt đầu theo dõi sự hiện diện của học
            viên
          </p>
          <button
            onClick={handleCreateAttendance}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <Plus className='w-4 h-4 mr-2' />
            Tạo phiên điểm danh
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          {sessionAttendances
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            .map((session) => {
              const presentCount = session.attendances.filter(
                (a) => a.is_present
              ).length;
              const absentCount = session.attendances.filter(
                (a) => !a.is_present
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
                        Có mặt: {presentCount}
                      </span>
                      <span className='inline-flex items-center text-red-600'>
                        <div className='w-2 h-2 rounded-full bg-red-500 mr-1'></div>
                        Vắng mặt: {absentCount}
                      </span>
                      <span className='text-gray-700'>
                        Tổng: {session.attendances.length}
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

      {showModal && (
        <div className='fixed inset-0 bg-black !mt-0 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-4xl w-[90vw] mx-4 max-h-[85vh] flex flex-col'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <div className='flex items-center'>
                <Users className='w-6 h-6 text-blue-600 mr-3' />
                <h2 className='text-xl font-semibold text-gray-900'>
                  Điểm danh - {getEnglishWeekday(new Date())}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            {alertMessage && (
              <div className='px-6 py-3 bg-red-50 border-b border-red-200'>
                <div className='flex items-center'>
                  <AlertCircle className='w-5 h-5 text-red-600 mr-3' />
                  <div>
                    <p className='text-sm text-red-700'>{alertMessage}</p>
                  </div>
                  <button
                    onClick={() => setAlertMessage('')}
                    className='ml-auto text-red-600 hover:text-red-800'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}

            <div className='px-6 py-4 border-b border-gray-200'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Chủ đề buổi học
              </label>
              <input
                type='text'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='Nhập chủ đề buổi học...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              />

              <label className='block text-sm font-medium text-gray-700 mt-4'>
                Ca học
              </label>
              <select
                title='Ca học'
                className='mt-1 block px-3 py-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                onChange={(e) => {
                  setSelectedSchedule(e.target.value);
                }}
              >
                <option value=''>-- Chọn ca học --</option>
                {formatSchedules(schedules).map((v) => {
                  return (
                    <option
                      key={v.value}
                      value={v.value}
                    >
                      {v.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='p-6 overflow-y-auto flex-1'>
              <div className='mb-4'>
                <p className='text-sm text-gray-600'>
                  Tổng số học viên: {enrollments.length}
                </p>
              </div>

              <div className='space-y-3'>
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment?.student?.id}
                    className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                  >
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                        <span className='text-blue-600 font-medium text-sm'>
                          {enrollment.student?.name?.charAt(0) || '-'}
                        </span>
                      </div>
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {enrollment.student?.name || 'Không có tên'}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          #{enrollment?.student?.id?.substring(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div className='relative'>
                      <div className='flex bg-gray-100 rounded-full p-1 space-x-1'>
                        <button
                          onClick={() =>
                            toggleAttendance(enrollment?.student?.id, true)
                          }
                          className={`relative flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            attendance[enrollment?.student?.id] === true
                              ? 'bg-green-500 text-white'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Check className='w-4 h-4 mr-1' />
                          Có mặt
                        </button>

                        <button
                          onClick={() =>
                            toggleAttendance(enrollment?.student?.id, false)
                          }
                          className={`relative flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            attendance[enrollment?.student?.id] === false
                              ? 'bg-red-500 text-white'
                              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <UserX className='w-4 h-4 mr-1' />
                          Vắng mặt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {enrollments.length === 0 && (
                <div className='text-center py-8'>
                  <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-500'>
                    Chưa có học viên nào trong lớp
                  </p>
                </div>
              )}
            </div>

            <div className='px-6 rounded-b-lg py-4 border-t border-gray-200 bg-gray-50'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='text-sm text-gray-600'>
                    <span className='inline-flex items-center'>
                      <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                      Có mặt:{' '}
                      {
                        Object.values(attendance).filter(
                          (status) => status === true
                        ).length
                      }
                    </span>
                  </div>
                  <div className='text-sm text-gray-600'>
                    <span className='inline-flex items-center'>
                      <div className='w-2 h-2 bg-red-500 rounded-full mr-2'></div>
                      Vắng mặt:{' '}
                      {
                        Object.values(attendance).filter(
                          (status) => status === false
                        ).length
                      }
                    </span>
                  </div>

                  <div className='text-sm text-gray-600'>
                    <span className='inline-flex items-center'>
                      <div className='w-2 h-2 bg-orange-500 rounded-full mr-2'></div>
                      Chưa điểm danh:{' '}
                      {
                        Object.values(attendance).filter(
                          (status) => status === null
                        ).length
                      }
                    </span>
                  </div>

                  <div className='text-sm font-medium text-gray-700'>
                    Tổng: {enrollments.length}
                  </div>
                </div>
                <div className='flex space-x-3'>
                  <button
                    onClick={() => setShowModal(false)}
                    className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50'
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveAttendance}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700'
                  >
                    Lưu điểm danh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedSession && (
        <div className='fixed inset-0 bg-black !mt-0 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-xl max-w-4xl w-[90vw] mx-4 max-h-[85vh] flex flex-col'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <div className='flex items-center'>
                <Eye className='w-6 h-6 text-blue-600 mr-3' />
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Chi tiết điểm danh
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
                    {selectedSession.attendances.length}
                  </div>
                  <div className='text-sm text-gray-600'>Tổng học viên</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {
                      selectedSession.attendances.filter((a) => a.is_present)
                        .length
                    }
                  </div>
                  <div className='text-sm text-gray-600'>Có mặt</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {
                      selectedSession.attendances.filter((a) => !a.is_present)
                        .length
                    }
                  </div>
                  <div className='text-sm text-gray-600'>Vắng mặt</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {Math.round(
                      (selectedSession.attendances.filter((a) => a.is_present)
                        .length /
                        selectedSession.attendances.length) *
                        100
                    )}
                    %
                  </div>
                  <div className='text-sm text-gray-600'>Tỷ lệ có mặt</div>
                </div>
              </div>
            </div>

            <div className='p-6 overflow-y-auto flex-1'>
              <div className='mb-4'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Thông tin buổi học
                </h3>
                <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Chủ đề:</span>
                    <span className='font-medium'>
                      {selectedSession.topic || 'Chưa có chủ đề'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Thời gian điểm danh:</span>
                    <span className='font-medium'>
                      {new Date(selectedSession.created_at).toLocaleString(
                        'vi-VN'
                      )}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Ca học:</span>
                    <span className='font-medium'>
                      {schedules
                        ?.find((s) => s.id === selectedSession.schedule_id)
                        ?.start_time?.substring(0, 5)}{' '}
                      -{' '}
                      {schedules
                        ?.find((s) => s.id === selectedSession.schedule_id)
                        ?.end_time?.substring(0, 5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mb-4'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Danh sách học viên
                </h3>

                <div className='space-y-3'>
                  {selectedSession.attendances.map((attendance, index) => {
                    const student = enrollments?.find(
                      (s) => s.student.id === attendance.student_id
                    );

                    return (
                      <div
                        key={index}
                        className='flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white'
                      >
                        <div className='flex items-center'>
                          <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4'>
                            <span className='text-blue-600 font-medium text-sm'>
                              {student?.student?.name?.charAt(0) || '-'}
                            </span>
                          </div>
                          <div>
                            <h4 className='font-medium text-gray-900'>
                              {student?.student?.name || 'Không có tên'}
                            </h4>
                            <p className='text-sm text-gray-500'>
                              ID: {attendance.student_id}
                            </p>
                          </div>
                        </div>

                        <div className='flex items-center'>
                          {attendance.is_present ? (
                            <div className='flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium'>
                              <Check className='w-4 h-4 mr-1' />
                              Có mặt
                            </div>
                          ) : (
                            <div className='flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium'>
                              <UserX className='w-4 h-4 mr-1' />
                              Vắng mặt
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedSession.attendances.length === 0 && (
                  <div className='text-center py-8'>
                    <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                    <p className='text-gray-500'>Không có dữ liệu điểm danh</p>
                  </div>
                )}
              </div>
            </div>

            <div className='px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4 text-sm text-gray-600'>
                  <span className='inline-flex items-center'>
                    <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                    Có mặt:{' '}
                    {
                      selectedSession.attendances.filter((a) => a.is_present)
                        .length
                    }
                  </span>
                  <span className='inline-flex items-center'>
                    <div className='w-2 h-2 bg-red-500 rounded-full mr-2'></div>
                    Vắng mặt:{' '}
                    {
                      selectedSession.attendances.filter((a) => !a.is_present)
                        .length
                    }
                  </span>
                  <span className='font-medium text-gray-700'>
                    Tổng: {selectedSession.attendances.length}
                  </span>
                </div>
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

export default AttendanceManagement;
