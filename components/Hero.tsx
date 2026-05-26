export default function Hero() {
  return (
    <section className="bg-gradient-to-l from-primary to-accent text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 text-4xl">
          🧠
        </div>
        <h1 className="text-4xl font-bold mb-3">د. سعد المهدي</h1>
        <p className="text-xl font-medium mb-2 opacity-90">طبيب نفسي استشاري</p>
        <p className="text-base opacity-75 max-w-xl mx-auto">
          احجز استشارتك النفسية بكل سهولة — اختار الموعد المناسب لك وادفع أونلاين بأمان تام
        </p>
        <div className="flex justify-center gap-6 mt-8 text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">💬</span>
            <span className="opacity-80">استشارة فردية</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🔒</span>
            <span className="opacity-80">سرية تامة</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">💳</span>
            <span className="opacity-80">دفع آمن</span>
          </div>
        </div>
      </div>
    </section>
  );
}
