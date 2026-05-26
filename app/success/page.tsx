export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-soft flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-primary mb-3">تم الحجز بنجاح!</h1>
        <p className="text-gray-600 mb-6">
          شكراً ليك! تم تأكيد حجزك مع الدكتور سعد المهدي.<br />
          هتوصلك رسالة تأكيد على الإيميل قريباً.
        </p>
        <a href="/"
          className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors">
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
