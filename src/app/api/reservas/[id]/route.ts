import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'bryangil0203@gmail.com';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { archived } = body;

    if (typeof archived !== 'boolean') {
      return NextResponse.json({ error: 'Campo archived requerido (boolean)' }, { status: 400 });
    }

    const isAdmin = user.email === ADMIN_EMAIL;

    // Fetch the reservation to verify ownership or admin access
    const { data: reserva, error: fetchErr } = await supabase
      .from('reservas')
      .select('id, user_id, estado')
      .eq('id', id)
      .single();

    if (fetchErr || !reserva) {
      return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Only allow archiving cancelled reservations
    if (reserva.estado !== 'cancelada') {
      return NextResponse.json({ error: 'Solo se pueden ocultar citas canceladas' }, { status: 400 });
    }

    // Must be admin or owner
    if (!isAdmin && reserva.user_id !== user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { error: updateErr } = await supabase
      .from('reservas')
      .update({ archived })
      .eq('id', id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const isAdmin = user.email === ADMIN_EMAIL;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Solo el administrador puede eliminar citas' }, { status: 403 });
    }

    const { id } = await params;

    const { error } = await supabase.from('reservas').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al eliminar la reserva' }, { status: 500 });
  }
}
