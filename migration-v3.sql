-- =============================================
-- GNH — Migración v3 (ejecutar en Supabase SQL Editor)
-- Agrega campo fecha real a reservas para soporte de semanas
-- =============================================

-- Agregar columna fecha (date real) a reservas
ALTER TABLE public.reservas
  ADD COLUMN IF NOT EXISTS fecha date;

-- Índice para queries por rango de fechas
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON public.reservas(fecha);

-- Verificar
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'reservas' ORDER BY ordinal_position;
