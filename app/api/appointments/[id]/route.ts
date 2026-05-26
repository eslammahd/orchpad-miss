import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Only delete if not booked
    const { data: appt } = await supabase
      .from('appointments')
      .select('is_booked')
      .eq('id', id)
      .single();

    if (!appt) return NextResponse.json({ error: 'مش موجود' }, { status: 404 });
    if (appt.is_booked) return NextResponse.json({ error: 'الموعد محجوز، مينفعش تحذفه' }, { status: 400 });

    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
