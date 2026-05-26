import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      bookings (*)
    `)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      appointments (date, time)
    `)
    .order('created_at', { ascending: false });

  return <DashboardClient appointments={appointments || []} bookings={bookings || []} />;
}
