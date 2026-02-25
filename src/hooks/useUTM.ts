// =====================================================
// useUTM - Parse UTM parameters, auto-apply coupons
// =====================================================

import { useState, useEffect, useCallback } from 'react';

interface UTMParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  coupon_code: string | null; // ?coupon=CODE
}

interface UseUTMResult {
  params: UTMParams;
  hasUTM: boolean;
  hasCoupon: boolean;
  getParam: (key: keyof UTMParams) => string | null;
}

const UTM_STORAGE_KEY = 'aijit_utm_params';

export function useUTM(): UseUTMResult {
  const [params, setParams] = useState<UTMParams>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    coupon_code: null,
  });

  useEffect(() => {
    // Parse UTM params from URL on mount
    const urlParams = new URLSearchParams(window.location.search);

    const newParams: UTMParams = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      coupon_code: urlParams.get('coupon') || urlParams.get('coupon_code'),
    };

    // Check if any UTM params exist
    const hasAnyParam = Object.values(newParams).some((v) => v !== null);

    if (hasAnyParam) {
      // Save to sessionStorage for persistence across page navigation
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newParams));
      setParams(newParams);
    } else {
      // Try to restore from sessionStorage
      const saved = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (saved) {
        try {
          const savedParams = JSON.parse(saved) as UTMParams;
          setParams(savedParams);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  const hasUTM = Boolean(params.utm_source || params.utm_medium || params.utm_campaign);
  const hasCoupon = Boolean(params.coupon_code);

  const getParam = useCallback(
    (key: keyof UTMParams): string | null => params[key],
    [params]
  );

  return {
    params,
    hasUTM,
    hasCoupon,
    getParam,
  };
}
