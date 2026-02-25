// =====================================================
// useCourses - Fetch courses from courses_v2
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Course, NavigationCategory, CourseNavTree } from '../types/course';

interface UseCoursesResult {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getCourseByCode: (code: string) => Course | undefined;
  getCoursesByCategory: (category: NavigationCategory) => Course[];
  getNavTree: () => CourseNavTree;
}

export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('courses_v2')
        .select('*')
        .eq('is_active', true)
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch courses';
      setError(message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const getCourseByCode = useCallback(
    (code: string) => courses.find((c) => c.course_code === code),
    [courses]
  );

  const getCoursesByCategory = useCallback(
    (category: NavigationCategory) =>
      courses.filter((c) => c.navigation_category === category),
    [courses]
  );

  const getNavTree = useCallback((): CourseNavTree => {
    return {
      techies: courses.filter((c) => c.navigation_category === 'techies'),
      non_techies: courses.filter((c) => c.navigation_category === 'non_techies'),
      students: courses.filter((c) => c.navigation_category === 'students'),
      job_seekers: courses.filter((c) => c.navigation_category === 'job_seekers'),
    };
  }, [courses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
    getCourseByCode,
    getCoursesByCategory,
    getNavTree,
  };
}
