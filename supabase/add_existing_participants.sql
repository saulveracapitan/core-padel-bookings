-- Script para agregar retroactivamente participantes a reservas existentes
-- EJECUTA ESTE SCRIPT DESPUÉS de:
-- 1. create_booking_participants.sql
-- 2. add_missing_columns.sql

-- Este script agregará automáticamente al creador de cada reserva
-- como participante con rol 'owner' en todas las reservas existentes

INSERT INTO public.booking_participants (booking_id, user_id, role, payment_status)
SELECT 
  b.id as booking_id,
  b.user_id,
  'owner' as role,
  'paid' as payment_status  -- Por defecto, asumimos que el owner ya pagó
FROM public.bookings b
WHERE b.status = 'confirmed'
AND NOT EXISTS (
  -- Evitar duplicados: solo insertar si no existe ya un participante para este usuario en esta reserva
  SELECT 1 FROM public.booking_participants bp 
  WHERE bp.booking_id = b.id AND bp.user_id = b.user_id
)
ON CONFLICT (booking_id, user_id) DO NOTHING;

-- Verificar cuántos participantes se agregaron
SELECT 
  COUNT(*) as total_participants,
  COUNT(DISTINCT booking_id) as bookings_with_participants
FROM public.booking_participants;
