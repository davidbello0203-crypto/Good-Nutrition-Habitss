import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const body = await req.json();
    const { servicio, tipo, dia, horario, objetivo, notas } = body;

    if (!servicio || !dia || !horario || !objetivo) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const base = { user_id: user.id, dia, horario, objetivo, notas: notas || '' };

    // "Ambos" → crear 2 reservas separadas
    if (tipo === 'ambos') {
      const { error } = await supabase.from('reservas').insert([
        { ...base, servicio: 'Consulta de Nutrición',     tipo: 'nutricion'     },
        { ...base, servicio: 'Entrenamiento Presencial',  tipo: 'entrenamiento' },
      ]);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    const tipoFinal = tipo === 'entrenamiento' ? 'entrenamiento' : 'nutricion';
    const { data, error } = await supabase
      .from('reservas')
      .insert({ ...base, servicio, tipo: tipoFinal })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, reserva: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al guardar la reserva' }, { status: 500 });
  }
}
