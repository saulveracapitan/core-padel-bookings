-- Script para agregar columnas faltantes a la tabla bookings
-- Ejecuta este script ANTES del script add_existing_participants.sql

-- 1. Agregar columna payment_type si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'payment_type'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_type TEXT CHECK (payment_type IN ('full', 'split'));
  END IF;
END $$;

-- 2. Agregar columna payment_status si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid'));
  END IF;
END $$;

-- 3. Agregar columna share_token si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'share_token'
  ) THEN
    ALTER TABLE public.bookings 
    ADD COLUMN share_token UUID DEFAULT gen_random_uuid();
  END IF;
END $$;

-- 4. Agregar columna price_cents a courts si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'courts' 
    AND column_name = 'price_cents'
  ) THEN
    ALTER TABLE public.courts 
    ADD COLUMN price_cents INTEGER NOT NULL DEFAULT 2400;
  END IF;
END $$;

-- 5. Actualizar share_token para reservas existentes que no lo tengan
UPDATE public.bookings 
SET share_token = gen_random_uuid() 
WHERE share_token IS NULL;

-- 6. Verificar que las columnas se agregaron correctamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'bookings'
AND column_name IN ('payment_type', 'payment_status', 'share_token')
ORDER BY column_name;
