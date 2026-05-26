'use client'

type Booking = {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  created_at: string
  appointments: { starts_at: string; ends_at: string } | null
}

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p>لا توجد حجوزات بعد</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">المريض</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">التواصل</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">موعد الجلسة</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-600">تاريخ الحجز</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => {
            const slot = b.appointments
            const sessionDate = slot
              ? new Date(slot.starts_at).toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '—'
            const sessionTime = slot
              ? `${new Date(slot.starts_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.ends_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`
              : ''
            const bookingDate = new Date(b.created_at).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })

            return (
              <tr
                key={b.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      {b.patient_name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-800">{b.patient_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <div>{b.patient_email}</div>
                  <div className="text-xs text-gray-400">{b.patient_phone}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <div>{sessionDate}</div>
                  <div className="text-xs text-gray-400">{sessionTime}</div>
                </td>
                <td className="px-4 py-3 text-gray-500">{bookingDate}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
