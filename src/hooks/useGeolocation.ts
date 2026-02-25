// =====================================================
// useGeolocation - Country detection for currency
// =====================================================

import { useState, useEffect } from 'react';
import type { CurrencyCode } from '../types/course';
import { COUNTRY_CURRENCY_MAP } from '../lib/constants';

interface UseGeolocationResult {
  country: string | null;
  countryCode: string | null;
  city: string | null;
  currency: CurrencyCode;
  loading: boolean;
  error: string | null;
  setCurrencyOverride: (currency: CurrencyCode) => void;
}

interface GeoIPResponse {
  country: string;
  countryCode: string;
  city: string;
  // Different APIs may have different fields
  country_code?: string;
  country_name?: string;
}

const STORAGE_KEY = 'aijit_currency_preference';

export function useGeolocation(): UseGeolocationResult {
  const [country, setCountry] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved preference first
    const savedCurrency = localStorage.getItem(STORAGE_KEY);
    if (savedCurrency && isValidCurrency(savedCurrency)) {
      setCurrency(savedCurrency as CurrencyCode);
      setLoading(false);
      return;
    }

    // Detect country via free GeoIP API
    detectCountry();
  }, []);

  async function detectCountry() {
    try {
      setLoading(true);

      // Try free GeoIP services in order of reliability
      const response = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) throw new Error('GeoIP request failed');

      const data: GeoIPResponse = await response.json();

      const detectedCode = data.countryCode || data.country_code || '';
      const detectedCountry = data.country || data.country_name || '';
      const detectedCity = data.city || '';

      setCountryCode(detectedCode);
      setCountry(detectedCountry);
      setCity(detectedCity);

      // Map country to currency
      const mappedCurrency = COUNTRY_CURRENCY_MAP[detectedCode] || 'INR';
      setCurrency(mappedCurrency);
    } catch (err) {
      // Silently fail - default to INR
      setError('Could not detect location');
      setCurrency('INR');
    } finally {
      setLoading(false);
    }
  }

  function setCurrencyOverride(newCurrency: CurrencyCode) {
    setCurrency(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  }

  return {
    country,
    countryCode,
    city,
    currency,
    loading,
    error,
    setCurrencyOverride,
  };
}

function isValidCurrency(code: string): boolean {
  return ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED'].includes(code);
}
