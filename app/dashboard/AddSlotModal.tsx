'use client';

import { useState } from 'react';

type Appointment = {
  id: string;
  date: string;
  time: string;
  is_booked: boolean;
};

export default function AddSlotModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (slot: Appointment) => void;
}) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) { setError('اختار التاريخ والوقت'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حصل خطأ');
      onAdded(data.appointment);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حصل خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">إضافة موعد جديد</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">التاريخ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">الوقت</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">اختار الوقت</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري الإضافة...' : 'إضافة الموعد'}
          </button>
        </form>
      </div>
    </div>
  );
}
