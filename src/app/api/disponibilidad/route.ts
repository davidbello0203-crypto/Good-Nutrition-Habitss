import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const semana = req.nextUrl.searchParams.get('semana'); // YYYY-MM-DD (lunes de la semana)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('reservas')
      .select('dia, horario, tipo, estado, fecha')
      .in('estado', ['pendiente', 'confirmada'])
      .or('archived.is.null,archived.eq.false');

    if (semana) {
      // Calcular domingo de esa semana
      const monday = new Date(semana + 'T12:00:00Z');
      const sunday = new Date(monday);
      sunday.setUTCDate(monday.getUTCDate() + 6);
      const sundayStr = sunday.toISOString().split('T')[0];
      query = query.gte('fecha', semana).lte('fecha', sundayStr);
    } else {
      // Sin semana: excluir reservas pasadas (fecha < hoy)
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      query = query.or(`fecha.is.null,fecha.gte.${todayStr}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('disponibilidad error:', error);
      return NextResponse.json({ slots: [] });
    }

    return NextResponse.json({ slots: data || [] });
  } catch (err) {
    console.error('disponibilidad exception:', err);
    return NextResponse.json({ slots: [] });
  }
}
