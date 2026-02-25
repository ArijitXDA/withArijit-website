// =====================================================
// useEnrollment - Enrollment state management
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { StudentEnrollmentV2 } from '../types/enrollment';
import { FREE_INTRO_BATCH_CODE } from '../lib/constants';

interface UseEnrollmentResult {
  enrollments: StudentEnrollmentV2[];
  activeEnrollment: StudentEnrollmentV2 | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createFreeEnrollment: (email: string, name: string) => Promise<StudentEnrollmentV2 | null>;
  selectBatch: (enrollmentId: string, batchId: string) => Promise<boolean>;
  hasPaidEnrollment: boolean;
  hasFreeEnrollment: boolean;
  needsBatchSelection: boolean;
}

export function useEnrollment(userEmail?: string): UseEnrollmentResult {
  const [enrollments, setEnrollments] = useState<StudentEnrollmentV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = useCallback(async () => {
    if (!userEmail) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('student_enrollments_v2')
        .select('*')
        .eq('student_email', userEmail)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEnrollments(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch enrollments';
      setError(message);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  // Auto-create free enrollment with Batch #101
  const createFreeEnrollment = useCallback(
    async (email: string, name: string): Promise<StudentEnrollmentV2 | null> => {
      try {
        // Check if already has a free enrollment
        const existing = enrollments.find((e) => e.enrollment_type === 'free');
        if (existing) return existing;

        // Get the free intro batch ID
        const { data: batch } = await supabase
          .from('batches_v2')
          .select('id')
          .eq('batch_code', FREE_INTRO_BATCH_CODE)
          .single();

        if (!batch) throw new Error('Free intro batch not found');

        const { data: enrollment, error: insertError } = await supabase
          .from('student_enrollments_v2')
          .insert({
            student_email: email,
            student_name: name,
            batch_id: batch.id,
            enrollment_type: 'free',
            enrollment_status: 'active',
            payment_status: 'completed', // Free enrollment = no payment
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Refresh enrollments
        await fetchEnrollments();
        return enrollment;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create enrollment';
        setError(message);
        return null;
      }
    },
    [enrollments, fetchEnrollments]
  );

  // Select a batch for a paid enrollment
  const selectBatch = useCallback(
    async (enrollmentId: string, batchId: string): Promise<boolean> => {
      try {
        const { error: updateError } = await supabase
          .from('student_enrollments_v2')
          .update({
            batch_id: batchId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', enrollmentId);

        if (updateError) throw updateError;

        await fetchEnrollments();
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to select batch';
        setError(message);
        return false;
      }
    },
    [fetchEnrollments]
  );

  const activeEnrollment =
    enrollments.find(
      (e) => e.enrollment_status === 'active' && e.enrollment_type === 'paid'
    ) ||
    enrollments.find((e) => e.enrollment_status === 'active') ||
    null;

  const hasPaidEnrollment = enrollments.some(
    (e) => e.enrollment_type === 'paid' && e.enrollment_status === 'active'
  );
  const hasFreeEnrollment = enrollments.some(
    (e) => e.enrollment_type === 'free' && e.enrollment_status === 'active'
  );
  const needsBatchSelection = enrollments.some(
    (e) =>
      e.enrollment_type === 'paid' &&
      e.enrollment_status === 'active' &&
      !e.batch_id
  );

  return {
    enrollments,
    activeEnrollment,
    loading,
    error,
    refetch: fetchEnrollments,
    createFreeEnrollment,
    selectBatch,
    hasPaidEnrollment,
    hasFreeEnrollment,
    needsBatchSelection,
  };
}
