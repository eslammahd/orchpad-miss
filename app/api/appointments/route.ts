import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { date, time } = await req.json();
    if (!date || !time) {
      return NextResponse.json({ error: 'التاريخ والوقت مطلوبين' }, { status: 400 });
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'الموعد ده موجود بالفعل' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert({ date, time, is_booked: false })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ appointment: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
