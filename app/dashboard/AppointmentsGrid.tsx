'use client'
import { useState } from 'react'

type Appointment = {
  id: string
  starts_at: string
  ends_at: string
  is_booked: boolean
}

export default function AppointmentsGrid({
  appointments,
  onRefresh,
}: {
  appointments: Appointment[]
  onRefresh: () => void
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    await fetch('/api/appointments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    onRefresh()
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📅</p>
        <p>لا توجد مواعيد — أضف موعداً جديداً</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {appointments.map((a) => {
        const date = new Date(a.starts_at)
        const endDate = new Date(a.ends_at)
        return (
          <div
            key={a.id}
            className={`rounded-xl border p-4 flex flex-col gap-3 ${
              a.is_booked
                ? 'bg-red-50 border-red-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  {date.toLocaleDateString('ar-EG', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {endDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  a.is_booked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {a.is_booked ? 'محجوز' : 'متاح'}
              </span>
            </div>
            {!a.is_booked && (
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deletingId === a.id}
                className="text-xs text-red-500 hover:text-red-700 self-end transition disabled:opacity-50"
              >
                {deletingId === a.id ? 'جاري الحذف...' : 'حذف الموعد'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
