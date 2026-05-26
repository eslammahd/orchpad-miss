import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة التحكم — د. سعد المهدي',
  description: 'إدارة المواعيد والحجوزات',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
