-- Script de diagnóstico para verificar el estado de las reservas y participantes
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Ver todas las reservas activas
SELECT 
  id,
  booking_date,
  start_time,
  user_id,
  status,
  payment_type,
  share_token
FROM public.bookings
WHERE status = 'confirmed'
ORDER BY booking_date DESC, start_time DESC
LIMIT 10;

-- 2. Ver todos los participantes
SELECT 
  bp.id,
  bp.booking_id,
  bp.user_id,
  bp.role,
  bp.payment_status,
  bp.joined_at
FROM public.booking_participants bp
ORDER BY bp.joined_at DESC
LIMIT 10;

-- 3. Ver reservas con su conteo de participantes
SELECT 
  b.id,
  b.booking_date,
  b.start_time,
  b.status,
  COUNT(bp.id) as participant_count
FROM public.bookings b
LEFT JOIN public.booking_participants bp ON b.id = bp.booking_id
WHERE b.status = 'confirmed'
GROUP BY b.id, b.booking_date, b.start_time, b.status
ORDER BY b.booking_date DESC, b.start_time DESC
LIMIT 10;

-- 4. Verificar si hay reservas sin participantes
SELECT 
  b.id,
  b.booking_date,
  b.start_time,
  b.user_id as booking_owner
FROM public.bookings b
WHERE b.status = 'confirmed'
AND NOT EXISTS (
  SELECT 1 FROM public.booking_participants bp 
  WHERE bp.booking_id = b.id
)
ORDER BY b.created_at DESC;
