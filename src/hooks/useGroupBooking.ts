// =====================================================
// useGroupBooking - Group booking flow
// =====================================================

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { GroupBooking, GroupBookingMember } from '../types/payment';

interface UseGroupBookingResult {
  loading: boolean;
  error: string | null;
  createGroupBooking: (params: CreateGroupBookingParams) => Promise<GroupBooking | null>;
  getGroupBooking: (id: string) => Promise<GroupBooking | null>;
  getGroupBookingByToken: (token: string) => Promise<GroupBooking | null>;
  getGroupMembers: (bookingId: string) => Promise<GroupBookingMember[]>;
  addGroupMember: (bookingId: string, email: string, name?: string) => Promise<boolean>;
}

interface CreateGroupBookingParams {
  entityName: string;
  entityEmail: string;
  entityPhone?: string;
  entityOrganization?: string;
  courseId: string;
  totalSeats: number;
  memberEmails: string[];
  pricePerSeat: number;
  discountAmount?: number;
  couponId?: string;
  currency?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function useGroupBooking(): UseGroupBookingResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroupBooking = useCallback(
    async (params: CreateGroupBookingParams): Promise<GroupBooking | null> => {
      setLoading(true);
      setError(null);

      try {
        const totalAmount = params.pricePerSeat * params.totalSeats;
        const discountAmount = params.discountAmount || 0;
        const finalAmount = totalAmount - discountAmount;

        // Create the group booking
        const { data: booking, error: bookingError } = await supabase
          .from('group_bookings')
          .insert({
            entity_name: params.entityName,
            entity_email: params.entityEmail,
            entity_phone: params.entityPhone,
            entity_organization: params.entityOrganization,
            course_id: params.courseId,
            total_seats: params.totalSeats,
            price_per_seat: params.pricePerSeat,
            total_amount: totalAmount,
            discount_amount: discountAmount,
            final_amount: finalAmount,
            coupon_id: params.couponId,
            currency: params.currency || 'INR',
            booking_status: 'pending',
            payment_status: 'pending',
            utm_source: params.utmSource,
            utm_medium: params.utmMedium,
            utm_campaign: params.utmCampaign,
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        // Create member records
        if (params.memberEmails.length > 0) {
          const members = params.memberEmails.map((email) => ({
            group_booking_id: booking.id,
            member_email: email.toLowerCase().trim(),
          }));

          const { error: membersError } = await supabase
            .from('group_booking_members')
            .insert(members);

          if (membersError) throw membersError;
        }

        return booking;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create group booking';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getGroupBooking = useCallback(async (id: string): Promise<GroupBooking | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('group_bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch {
      return null;
    }
  }, []);

  const getGroupBookingByToken = useCallback(
    async (token: string): Promise<GroupBooking | null> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('group_bookings')
          .select('*')
          .eq('invite_token', token)
          .single();

        if (fetchError) throw fetchError;
        return data;
      } catch {
        return null;
      }
    },
    []
  );

  const getGroupMembers = useCallback(
    async (bookingId: string): Promise<GroupBookingMember[]> => {
      try {
        const { data, error: fetchError } = await supabase
          .from('group_booking_members')
          .select('*')
          .eq('group_booking_id', bookingId)
          .order('created_at');

        if (fetchError) throw fetchError;
        return data || [];
      } catch {
        return [];
      }
    },
    []
  );

  const addGroupMember = useCallback(
    async (bookingId: string, email: string, name?: string): Promise<boolean> => {
      try {
        const { error: insertError } = await supabase.from('group_booking_members').insert({
          group_booking_id: bookingId,
          member_email: email.toLowerCase().trim(),
          member_name: name,
        });

        return !insertError;
      } catch {
        return false;
      }
    },
    []
  );

  return {
    loading,
    error,
    createGroupBooking,
    getGroupBooking,
    getGroupBookingByToken,
    getGroupMembers,
    addGroupMember,
  };
}
