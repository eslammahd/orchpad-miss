import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم — د. سعد المهدي',
  description: 'لوحة تحكم الدكتور سعد المهدي',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
