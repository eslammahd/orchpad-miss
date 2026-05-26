'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, User, Plus, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  is_booked: boolean;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  payment_status?: string;
}

interface NewAppointment {
  date: string;
  time: string;
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({ date: '', time: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointment.date || !newAppointment.time) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([{
          date: newAppointment.date,
          time: newAppointment.time,
          is_booked: false
        }]);

      if (error) throw error;

      setNewAppointment({ date: '', time: '' });
      setShowAddForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('حدث خطأ في إضافة الموعد');
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  const bookedAppointments = appointments.filter(apt => apt.is_booked);
  const availableAppointments = appointments.filter(apt => !apt.is_booked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الدكتور سعد المهدي</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>إضافة موعد جديد</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
                <div className="text-sm text-gray-600">إجمالي المواعيد</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{bookedAppointments.length}</div>
                <div className="text-sm text-gray-600">محجوز</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4">
                <div className="text-2xl font-bold text-gray-900">{availableAppointments.length}</div>
                <div className="text-sm text-gray-600">متاح</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booked Appointments */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                المواعيد المحجوزة
              </h2>
            </div>
            <div className="p-6">
              {bookedAppointments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  لا توجد مواعيد محجوزة حالياً
                </div>
              ) : (
                <div className="space-y-4">
                  {bookedAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(appointment.time)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600">
                            <User className="h-4 w-4 ml-1" />
                            <span className="text-sm font-medium">محجوز</span>
                          </div>
                        </div>
                      </div>
                      {appointment.patient_name && (
                        <div className="mt-3 pt-3 border-t border-green-200">
                          <div className="text-sm text-gray-700">
                            <strong>المريض:</strong> {appointment.patient_name}
                          </div>
                          {appointment.patient_email && (
                            <div className="text-sm text-gray-600">
                              <strong>الإيميل:</strong> {appointment.patient_email}
                            </div>
                          )}
                          {appointment.patient_phone && (
                            <div className="text-sm text-gray-600">
                              <strong>الهاتف:</strong> {appointment.patient_phone}
                            </div>
                          )}
                          {appointment.payment_status && (
                            <div className="text-sm">
                              <strong>حالة الدفع:</strong>
                              <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                                appointment.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.payment_status === 'paid' ? 'تم الدفع' : 'في الانتظار'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Appointments */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-orange-600 ml-2" />
                المواعيد المتاحة
              </h2>
            </div>
            <div className="p-6">
              {availableAppointments.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  لا توجد مواعيد متاحة حالياً
                </div>
              ) : (
                <div className="space-y-4">
                  {availableAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(appointment.time)}
                          </div>
                        </div>
                        <div className="flex items-center text-orange-600">
                          <Clock className="h-4 w-4 ml-1" />
                          <span className="text-sm font-medium">متاح</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة موعد جديد</h3>
            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التاريخ
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوقت
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'جاري الإضافة...' : 'إضافة الموعد'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAppointment({ date: '', time: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}