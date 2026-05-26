import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'د. سعد المهدي — استشارات نفسية',
  description: 'احجز استشارتك النفسية مع الدكتور سعد المهدي بكل سهولة وأمان'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic">{children}</body>
    </html>
  );
}
