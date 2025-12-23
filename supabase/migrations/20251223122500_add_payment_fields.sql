-- Add price to courts
ALTER TABLE public.courts ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 2400;

-- Add payment fields to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('full', 'split'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid'));
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid();
