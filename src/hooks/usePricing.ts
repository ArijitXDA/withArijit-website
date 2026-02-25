// =====================================================
// usePricing - Multi-currency pricing logic
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { CurrencyCode, PricingRule } from '../types/course';
import { getLocalPricing } from '../lib/currency';

interface UsePricingResult {
  pricingRules: PricingRule[];
  loading: boolean;
  error: string | null;
  getPricingForCourse: (courseId: string, currency: CurrencyCode) => PricingRule | undefined;
  getAllPricingForCourse: (courseId: string) => PricingRule[];
  refetch: () => void;
}

export function usePricing(courseIds?: string[]): UsePricingResult {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('pricing_rules_v2').select('*');

      if (courseIds && courseIds.length > 0) {
        query = query.in('course_id', courseIds);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPricingRules(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch pricing';
      setError(message);
      setPricingRules([]);
    } finally {
      setLoading(false);
    }
  }, [courseIds]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const getPricingForCourse = useCallback(
    (courseId: string, currency: CurrencyCode): PricingRule | undefined => {
      const courseRules = pricingRules.filter((p) => p.course_id === courseId);
      return getLocalPricing(courseRules, currency);
    },
    [pricingRules]
  );

  const getAllPricingForCourse = useCallback(
    (courseId: string): PricingRule[] => {
      return pricingRules.filter((p) => p.course_id === courseId);
    },
    [pricingRules]
  );

  return {
    pricingRules,
    loading,
    error,
    getPricingForCourse,
    getAllPricingForCourse,
    refetch: fetchPricing,
  };
}
