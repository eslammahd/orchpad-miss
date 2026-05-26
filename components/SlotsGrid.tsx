'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import BookingModal from './BookingModal';

interface Slot {
  id: string;
  date: string;
  time: string;
  is_available: boolean;
}

export default function SlotsGrid() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Slot | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      const { data } = await supabase
        .from('slots')
        .select('*')
        .eq('is_available', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      setSlots(data || []);
      setLoading(false);
    }
    fetchSlots();
  }, []);

  const grouped = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-primary mb-8 text-center">المواعيد المتاحة</h2>
      {loading ? (
        <div className="text-center text-gray-400 py-20">جاري تحميل المواعيد...</div>
      ) : slots.length === 0 ? (
        <div className="text-center text-gray-400 py-20">مفيش مواعيد متاحة دلوقتي</div>
      ) : (
        Object.entries(grouped).map(([date, daySlots]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-3">
              {format(parseISO(date), 'EEEE، d MMMM yyyy', { locale: ar })}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {daySlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelected(slot)}
                  className="bg-white border-2 border-accent/30 hover:border-accent hover:bg-accent/5 rounded-xl py-4 px-3 text-center transition-all duration-200 shadow-sm hover:shadow-md group"
                >
                  <span className="text-2xl block mb-1">🕐</span>
                  <span className="text-primary font-bold text-lg block">
                    {slot.time.slice(0, 5)}
                  </span>
                  <span className="text-xs text-accent group-hover:font-semibold">احجز دلوقتي</span>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
      {selected && (
        <BookingModal
          slot={selected}
          onClose={() => setSelected(null)}
          onBooked={() => {
            setSlots(prev => prev.filter(s => s.id !== selected.id));
            setSelected(null);
          }}
        />
      )}
    </section>
  );
}
