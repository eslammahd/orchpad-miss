'use client'
import { useState } from 'react'
import AddSlotModal from './AddSlotModal'
import BookingsTable from './BookingsTable'
import AppointmentsGrid from './AppointmentsGrid'
import { useRouter } from 'next/navigation'

type Appointment = {
  id: string
  starts_at: string
  ends_at: string
  is_booked: boolean
}

type Booking = {
  id: string
  patient_name: string
  patient_email: string
  patient_phone: string
  created_at: string
  appointments: { starts_at: string; ends_at: string } | null
}

export default function DashboardClient({
  appointments,
  bookings,
}: {
  appointments: Appointment[]
  bookings: Booking[]
}) {
  const [tab, setTab] = useState<'bookings' | 'slots'>('bookings')
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const totalBooked = appointments.filter((a) => a.is_booked).length
  const totalAvailable = appointments.filter((a) => !a.is_booked).length

  function refresh() {
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
            س
          </div>
          <div>
            <p className="font-bold text-gray-800">د. سعد المهدي</p>
            <p className="text-xs text-gray-500">لوحة التحكم</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + إضافة موعد
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="إجمالي الحجوزات" value={bookings.length} color="teal" />
          <StatCard label="مواعيد محجوزة" value={totalBooked} color="indigo" />
          <StatCard label="مواعيد متاحة" value={totalAvailable} color="emerald" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <TabBtn active={tab === 'bookings'} onClick={() => setTab('bookings')}>
            الحجوزات
          </TabBtn>
          <TabBtn active={tab === 'slots'} onClick={() => setTab('slots')}>
            المواعيد
          </TabBtn>
        </div>

        {tab === 'bookings' && <BookingsTable bookings={bookings} />}
        {tab === 'slots' && <AppointmentsGrid appointments={appointments} onRefresh={refresh} />}
      </main>

      {showModal && (
        <AddSlotModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            refresh()
          }}
        />
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: 'teal' | 'indigo' | 'emerald'
}) {
  const colors = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
        active
          ? 'border-teal-600 text-teal-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}
