-- =====================================================
-- Group Booking Fixes Migration
-- Date: 2026-02-26
-- Purpose:
--   1. Add increment_group_seats RPC function (called in GroupBookingSignup.tsx)
--   2. Add group_booking_id FK to payments_v2 (for linking group payments)
--   3. Ensure invite_token is auto-generated on group_bookings insert
-- =====================================================

-- ─── 1. increment_group_seats RPC ─────────────────────────────────────────────
-- Increments filled_seats on a group_booking record.
-- Called when an invited member claims their seat.
CREATE OR REPLACE FUNCTION increment_group_seats(booking_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE group_bookings
  SET filled_seats = COALESCE(filled_seats, 0) + 1
  WHERE id = booking_id;
END;
$$;

-- ─── 2. Auto-generate invite_token if not set ─────────────────────────────────
-- Ensures every group_booking gets a unique invite token automatically.
CREATE OR REPLACE FUNCTION set_group_invite_token()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.invite_token IS NULL THEN
    NEW.invite_token := encode(gen_random_bytes(24), 'base64url');
  END IF;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if present, then recreate
DROP TRIGGER IF EXISTS trg_set_group_invite_token ON group_bookings;
CREATE TRIGGER trg_set_group_invite_token
  BEFORE INSERT ON group_bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_group_invite_token();

-- ─── 3. Add group_booking_id to payments_v2 (if not already present) ──────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments_v2'
      AND column_name = 'group_booking_id'
  ) THEN
    ALTER TABLE payments_v2
      ADD COLUMN group_booking_id UUID REFERENCES group_bookings(id) ON DELETE SET NULL;
  END IF;
END;
$$;

-- ─── 4. Add booking_type to payments_v2 (individual / group) ─────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments_v2'
      AND column_name = 'booking_type'
  ) THEN
    ALTER TABLE payments_v2
      ADD COLUMN booking_type TEXT DEFAULT 'individual' CHECK (booking_type IN ('individual', 'group'));
  END IF;
END;
$$;

-- ─── 5. Index for faster group invite queries ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_group_booking_members_invite_sent
  ON group_booking_members(group_booking_id, invite_sent);

CREATE INDEX IF NOT EXISTS idx_group_bookings_invite_token
  ON group_bookings(invite_token);
