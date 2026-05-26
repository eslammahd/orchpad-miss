import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة تحكم الدكتور - الدكتور سعد المهدي',
  description: 'لوحة تحكم الدكتور لإدارة المواعيد والحجوزات',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}