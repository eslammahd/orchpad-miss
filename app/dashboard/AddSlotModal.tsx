'use client'
import { useState } from 'react'

export default function AddSlotModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bulk, setBulk] = useState(false)
  const [days, setDays] = useState<number[]>([])
  const [weeks, setWeeks] = useState(2)

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!startTime || !endTime) { setError('أدخل وقت البداية والنهاية'); return }
    if (!bulk && !date) { setError('أدخل التاريخ'); return }
    if (bulk && days.length === 0) { setError('اختر يوم واحد على الأقل'); return }

    setLoading(true)
    const res = await fetch('/api/appointments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, startTime, endTime, bulk, days, weeks }),
    })
    setLoading(false)
    if (res.ok) {
      onSaved()
    } else {
      const j = await res.json()
      setError(j.error || 'حدث خطأ')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" dir="rtl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">إضافة موعد جديد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBulk(false)}
              className={`flex-1 py-2 text-sm rounded-lg border font-medium transition ${
                !bulk ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              موعد واحد
            </button>
            <button
              type="button"
              onClick={() => setBulk(true)}
              className={`flex-1 py-2 text-sm rounded-lg border font-medium transition ${
                bulk ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              جدول أسبوعي
            </button>
          </div>

          {!bulk && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {bulk && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">أيام الأسبوع</label>
                <div className="flex flex-wrap gap-2">
                  {dayNames.map((name, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleDay(i)}
                      className={`px-3 py-1 text-xs rounded-full border transition ${
                        days.includes(i)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأسابيع</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وقت البداية</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وقت النهاية</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الموعد'}
          </button>
        </form>
      </div>
    </div>
  )
}
