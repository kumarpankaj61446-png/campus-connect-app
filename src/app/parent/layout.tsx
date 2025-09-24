
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Home, Wallet, BarChart2, MessageSquare, CalendarCheck, BookOpen, Camera } from 'lucide-react';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/parent/dashboard', label: 'Dashboard', icon: <Home /> },
    { href: '/parent/attendance', label: 'Attendance', icon: <CalendarCheck /> },
    { href: '/parent/homework', label: 'Homework', icon: <BookOpen /> },
    { href: '/parent/fee-payments', label: 'Fee Payments', icon: <Wallet /> },
    { href: '/parent/growth-report', label: 'Growth Reports', icon: <BarChart2 /> },
    { href: '/parent/hostel-updates', label: 'Hostel Updates', icon: <Home /> },
    { href: '/parent/gallery', label: 'School Gallery', icon: <Camera /> },
    { href: '/parent/chat', label: 'Chat with Teacher', icon: <MessageSquare /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Demo Parent"
      userRole="Parent"
    >
      {children}
    </DashboardLayout>
  );
}
