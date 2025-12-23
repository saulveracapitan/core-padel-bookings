CREATE TABLE IF NOT EXISTS public.booking_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('owner', 'player')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id, user_id)
);

-- Enable RLS
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public view for participants of shared bookings"
  ON public.booking_participants
  FOR SELECT
  USING (true); -- Allow anyone to see participants if they have the link (handled by app logic/query) or just public for simplicity in this context

CREATE POLICY "Users can join bookings"
  ON public.booking_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave bookings"
  ON public.booking_participants
  FOR DELETE
  USING (auth.uid() = user_id);
