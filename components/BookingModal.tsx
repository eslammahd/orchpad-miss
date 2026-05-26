'use client';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Slot { id: string; date: string; time: string; }
interface Props { slot: Slot; onClose: () => void; onBooked: () => void; }

export default function BookingModal({ slot, onClose, onBooked }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId: slot.id, ...form })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'حصل خطأ');
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حصل خطأ غير متوقع');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-primary">تأكيد الحجز</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="bg-soft rounded-xl p-4 mb-5 text-center">
          <p className="text-gray-500 text-sm">الموعد المختار</p>
          <p className="text-primary font-bold text-lg mt-1">
            {format(parseISO(slot.date), 'EEEE، d MMMM', { locale: ar })} — {slot.time.slice(0, 5)}
          </p>
          <p className="text-accent font-semibold mt-1">رسوم الاستشارة: 300 جنيه</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
              placeholder="اسمك هنا"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
            <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الموبايل *</label>
            <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent"
              placeholder="01xxxxxxxxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent resize-none"
              rows={3} placeholder="أي معلومات تساعد الدكتور..."
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
            {loading ? 'جاري التحويل للدفع...' : '💳 ادفع وأكد الحجز — 300 جنيه'}
          </button>
        </form>
      </div>
    </div>
  );
}
