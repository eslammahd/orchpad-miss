'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, Plus, CheckCircle, XCircle } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  available: boolean;
  patient_name?: string;
  patient_email?: string;
  patient_phone?: string;
  payment_status?: string;
}

export default function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
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
  }

  async function addAppointment() {
    if (!newDate || !newTime) return;
    
    setAdding(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          date: newDate,
          time: newTime,
          available: true
        });

      if (error) throw error;
      
      setNewDate('');
      setNewTime('');
      setShowAddForm(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error adding appointment:', error);
    } finally {
      setAdding(false);
    }
  }

  const bookedAppointments = appointments.filter(apt => !apt.available);
  const availableAppointments = appointments.filter(apt => apt.available);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الدكتور سعد</h1>
              <p className="text-gray-600">إدارة المواعيد والحجوزات</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              إضافة موعد جديد
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الحجوزات المؤكدة</p>
                <p className="text-2xl font-bold text-gray-900">{bookedAppointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المواعيد المتاحة</p>
                <p className="text-2xl font-bold text-gray-900">{availableAppointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المواعيد</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">الحجوزات المؤكدة</h2>
          </div>
          <div className="overflow-x-auto">
            {bookedAppointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ والوقت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      بيانات المريض
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة الدفع
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookedAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {format(parseISO(appointment.date), 'EEEE، d MMMM yyyy', { locale: ar })}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 ml-1" />
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <User className="w-4 h-4 text-gray-400 ml-2" />
                            {appointment.patient_name}
                          </div>
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 text-gray-400 ml-2" />
                            {appointment.patient_email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 ml-2" />
                            {appointment.patient_phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          تم الدفع
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد حجوزات بعد</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Appointments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">المواعيد المتاحة</h2>
          </div>
          <div className="p-6">
            {availableAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {format(parseISO(appointment.date), 'EEEE، d MMMM', { locale: ar })}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 ml-1" />
                          {appointment.time}
                        </div>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 ml-1" />
                        <span className="text-xs">متاح</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد مواعيد متاحة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة موعد جديد</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التاريخ
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوقت
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر الوقت</option>
                  <option value="09:00">9:00 صباحاً</option>
                  <option value="10:00">10:00 صباحاً</option>
                  <option value="11:00">11:00 صباحاً</option>
                  <option value="12:00">12:00 ظهراً</option>
                  <option value="14:00">2:00 مساءً</option>
                  <option value="15:00">3:00 مساءً</option>
                  <option value="16:00">4:00 مساءً</option>
                  <option value="17:00">5:00 مساءً</option>
                  <option value="18:00">6:00 مساءً</option>
                  <option value="19:00">7:00 مساءً</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={addAppointment}
                disabled={!newDate || !newTime || adding}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? 'جاري الإضافة...' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}