-- Script para crear/verificar la tabla booking_participants
-- Ejecuta este script en el SQL Editor de Supabase Dashboard

-- 1. Crear la tabla booking_participants (si no existe)
CREATE TABLE IF NOT EXISTS public.booking_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('owner', 'player')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(booking_id, user_id)
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.booking_participants ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes (si existen) y recrearlas
DROP POLICY IF EXISTS "Public view for participants of shared bookings" ON public.booking_participants;
DROP POLICY IF EXISTS "Users can join bookings" ON public.booking_participants;
DROP POLICY IF EXISTS "Users can leave bookings" ON public.booking_participants;

-- 4. Crear políticas de seguridad
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

-- 5. Verificar que la tabla se creó correctamente
SELECT 
  COUNT(*) as total_participants,
  COUNT(DISTINCT booking_id) as bookings_with_participants
FROM public.booking_participants;
