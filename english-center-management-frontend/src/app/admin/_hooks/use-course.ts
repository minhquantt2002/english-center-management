import { useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { Course, CourseLevel, CourseStatus } from '../../../types';

// Type definitions for course operations
export interface CourseFormData {
  name: string;
  description: string;
  level: CourseLevel;
  duration: string;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  price?: number;
  maxStudents?: number;
  syllabus: string[];
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  level: CourseLevel;
  duration: string;
  start_date: string;
  end_date: string;
  status: CourseStatus;
  price?: number;
  max_students?: number;
  syllabus: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
}

export const useCourseApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(async (courseData: CourseFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform frontend data to API format
      const apiData: CreateCourseRequest = {
        name: courseData.name,
        description: courseData.description,
        level: courseData.level,
        duration: courseData.duration,
        start_date: courseData.startDate,
        end_date: courseData.endDate,
        status: courseData.status,
        price: courseData.price,
        max_students: courseData.maxStudents,
        syllabus: courseData.syllabus,
      };

      const response = await api.post('/admin/courses', apiData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(
    async (id: string, courseData: CourseFormData) => {
      setLoading(true);
      setError(null);
      try {
        // Transform frontend data to API format
        const apiData: Partial<CreateCourseRequest> = {
          name: courseData.name,
          description: courseData.description,
          level: courseData.level,
          duration: courseData.duration,
          start_date: courseData.startDate,
          end_date: courseData.endDate,
          status: courseData.status,
          price: courseData.price,
          max_students: courseData.maxStudents,
          syllabus: courseData.syllabus,
        };

        const response = await api.put(`/admin/courses/${id}`, apiData);
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCourse = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/admin/courses/${id}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourses = useCallback(async (): Promise<Course[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/courses');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseById = useCallback(async (id: string): Promise<Course> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/admin/courses/${id}`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourses,
    getCourseById,
  };
};
