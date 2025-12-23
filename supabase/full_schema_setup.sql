-- 1. Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Create courts table
CREATE TABLE public.courts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('indoor', 'outdoor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  price_cents INTEGER NOT NULL DEFAULT 2400, -- Added from migration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Insert default courts
INSERT INTO public.courts (name, type) VALUES
  ('Pista 1', 'indoor'),
  ('Pista 2', 'indoor'),
  ('Pista 3', 'indoor'),
  ('Pista 4', 'indoor'),
  ('Pista 5', 'outdoor'),
  ('Pista 6', 'outdoor'),
  ('Pista 7', 'outdoor'),
  ('Pista 8', 'outdoor');

-- 4. Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id INTEGER NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 75,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  payment_type TEXT CHECK (payment_type IN ('full', 'split')), -- Added from migration
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')), -- Added from migration
  share_token UUID DEFAULT gen_random_uuid(), -- Added from migration
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(court_id, booking_date, start_time)
);

-- 5. Create booking_participants table
CREATE TABLE public.booking_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('owner', 'player')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id, user_id)
);

-- 6. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;

-- 7. Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. Courts policies (public read for everyone)
CREATE POLICY "Anyone can view active courts"
  ON public.courts FOR SELECT
  USING (is_active = true);

-- 9. Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for checking availability (anyone can see booked slots)
CREATE POLICY "Anyone can view confirmed bookings for availability"
  ON public.bookings FOR SELECT
  USING (status = 'confirmed');
  
-- Allow viewing bookings by share token (for guests)
CREATE POLICY "Anyone can view booking by share token"
  ON public.bookings FOR SELECT
  USING (share_token IS NOT NULL);

-- 10. Booking Participants policies
CREATE POLICY "Public view for participants of shared bookings"
  ON public.booking_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Users can join bookings"
  ON public.booking_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave bookings"
  ON public.booking_participants
  FOR DELETE
  USING (auth.uid() = user_id);

-- 11. Functions and Triggers
-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
