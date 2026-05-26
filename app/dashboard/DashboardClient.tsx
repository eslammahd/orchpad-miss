'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import AddSlotModal from './AddSlotModal';
import StatsCard from './StatsCard';

type Appointment = {
  id: string;
  date: string;
  time: string;
  is_booked: boolean;
  bookings?: Booking[];
};

type Booking = {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  status: string;
  created_at: string;
  appointments?: { date: string; time: string };
};

export default function DashboardClient({
  appointments,
  bookings,
}: {
  appointments: Appointment[];
  bookings: Booking[];
}) {
  const [tab, setTab] = useState<'overview' | 'slots' | 'patients'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localAppointments, setLocalAppointments] = useState(appointments);

  const totalSlots = localAppointments.length;
  const bookedSlots = localAppointments.filter((a) => a.is_booked).length;
  const availableSlots = totalSlots - bookedSlots;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setLocalAppointments((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  };

  const handleSlotAdded = (newSlot: Appointment) => {
    setLocalAppointments((prev) => [...prev, newSlot].sort((a, b) =>
      a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-[var(--font-cairo)]" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">س</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">لوحة تحكم الدكتور سعد المهدي</h1>
              <p className="text-sm text-slate-500">طبيب نفسي — إدارة المواعيد والحجوزات</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span>
            إضافة موعد جديد
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="إجمالي المواعيد" value={totalSlots} color="blue" />
          <StatsCard label="محجوز" value={bookedSlots} color="red" />
          <StatsCard label="متاح" value={availableSlots} color="green" />
          <StatsCard label="مدفوع ومؤكد" value={confirmedBookings} color="teal" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
          {([
            { key: 'overview', label: 'نظرة عامة' },
            { key: 'slots', label: 'المواعيد' },
            { key: 'patients', label: 'المرضى' },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 mb-4">آخر الحجوزات</h2>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-slate-400">لا توجد حجوزات بعد</div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">المريض</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">التاريخ</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">الوقت</th>
                      <th className="text-right px-4 py-3 font-medium text-slate-600">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 10).map((b) => (
                      <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{b.patient_name}</div>
                          <div className="text-slate-500 text-xs">{b.patient_email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {b.appointments?.date ? format(parseISO(b.appointments.date), 'dd MMM yyyy', { locale: ar }) : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{b.appointments?.time || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            b.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : b.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {b.status === 'confirmed' ? 'مؤكد' : b.status === 'pending' ? 'معلق' : 'ملغي'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'slots' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 mb-4">كل المواعيد</h2>
            {localAppointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-slate-400">لا توجد مواعيد — اضغط «إضافة موعد جديد»</div>
            ) : (
              localAppointments.map((appt) => (
                <div key={appt.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">
                        {format(parseISO(appt.date), 'EEEE، dd MMMM yyyy', { locale: ar })}
                      </div>
                      <div className="text-sm text-slate-500">{appt.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appt.is_booked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {appt.is_booked ? 'محجوز' : 'متاح'}
                    </span>
                    {!appt.is_booked && (
                      <button
                        onClick={() => handleDelete(appt.id)}
                        disabled={deletingId === appt.id}
                        className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                      >
                        {deletingId === appt.id ? '...' : 'حذف'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'patients' && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 mb-4">قائمة المرضى</h2>
            {bookings.filter((b) => b.status === 'confirmed').length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-slate-400">لا يوجد مرضى مؤكدين بعد</div>
            ) : (
              bookings
                .filter((b) => b.status === 'confirmed')
                .map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                          {b.patient_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{b.patient_name}</div>
                          <div className="text-sm text-slate-500">{b.patient_phone}</div>
                        </div>
                      </div>
                      <div className="text-left text-sm text-slate-500">
                        <div>{b.appointments?.date ? format(parseISO(b.appointments.date), 'dd MMM yyyy', { locale: ar }) : '—'}</div>
                        <div>{b.appointments?.time || '—'}</div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 text-sm text-slate-500">{b.patient_email}</div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddSlotModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleSlotAdded}
        />
      )}
    </div>
  );
}
