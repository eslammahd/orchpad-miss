import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { date, startTime, endTime, bulk, days, weeks } = await req.json()

  try {
    if (!bulk) {
      // Single appointment
      const startsAt = new Date(`${date}T${startTime}:00`)
      const endsAt = new Date(`${date}T${endTime}:00`)

      const { error } = await supabase.from('appointments').insert({
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        is_booked: false,
      })
      if (error) throw error
    } else {
      // Bulk: generate slots for N weeks
      const slots = []
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      for (let w = 0; w < weeks; w++) {
        for (const day of days) {
          const d = new Date(now)
          // Find next occurrence of this weekday
          const diff = (day - d.getDay() + 7) % 7
          d.setDate(d.getDate() + diff + w * 7)

          const [sh, sm] = startTime.split(':').map(Number)
          const [eh, em] = endTime.split(':').map(Number)

          const startsAt = new Date(d)
          startsAt.setHours(sh, sm, 0, 0)
          const endsAt = new Date(d)
          endsAt.setHours(eh, em, 0, 0)

          slots.push({
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
            is_booked: false,
          })
        }
      }

      const { error } = await supabase.from('appointments').insert(slots)
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
