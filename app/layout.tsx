import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'الدكتور سعد المهدي - استشارات نفسية',
  description: 'احجز استشارة نفسية مع الدكتور سعد المهدي. مواعيد مرنة ودفع آمن أونلاين.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}