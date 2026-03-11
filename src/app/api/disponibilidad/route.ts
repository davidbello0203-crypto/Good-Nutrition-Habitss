import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reservas')
      .select('dia, horario, tipo, estado')
      .in('estado', ['pendiente', 'confirmada'])
      .or('archived.is.null,archived.eq.false');

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
