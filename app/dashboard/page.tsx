import { createClient } from '@supabase/supabase-js'
import DashboardClient from './DashboardClient'

export const revalidate = 0

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .order('starts_at', { ascending: true })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, appointments(starts_at, ends_at)')
    .order('created_at', { ascending: false })

  return { appointments: appointments || [], bookings: bookings || [] }
}

export default async function DashboardPage() {
  const { appointments, bookings } = await getData()
  return <DashboardClient appointments={appointments} bookings={bookings} />
}
