// =====================================================
// useBatches - Batch listing and selection
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { BatchV2 } from '../types/enrollment';

interface UseBatchesResult {
  batches: BatchV2[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getBatchesByCourse: (courseId: string) => BatchV2[];
  getAvailableBatches: (courseId: string) => BatchV2[];
  getFreeBatch: () => BatchV2 | undefined;
}

export function useBatches(courseId?: string): UseBatchesResult {
  const [batches, setBatches] = useState<BatchV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('batches_v2')
        .select('*')
        .eq('is_active', true)
        .eq('is_visible_for_enrollment', true)
        .order('start_date', { ascending: true });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setBatches(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch batches';
      setError(message);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const getBatchesByCourse = useCallback(
    (cId: string) => batches.filter((b) => b.course_id === cId),
    [batches]
  );

  const getAvailableBatches = useCallback(
    (cId: string) =>
      batches.filter(
        (b) => b.course_id === cId && !b.is_full && b.is_active && b.is_visible_for_enrollment
      ),
    [batches]
  );

  const getFreeBatch = useCallback(
    () => batches.find((b) => b.batch_type === 'free_intro'),
    [batches]
  );

  return {
    batches,
    loading,
    error,
    refetch: fetchBatches,
    getBatchesByCourse,
    getAvailableBatches,
    getFreeBatch,
  };
}
