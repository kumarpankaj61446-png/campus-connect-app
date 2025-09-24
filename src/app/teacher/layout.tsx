

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Home, QrCode, ClipboardList, MessageSquare, Star, BookOpen, BrainCircuit, Camera } from 'lucide-react';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/teacher/dashboard', label: 'Dashboard', icon: <Home /> },
    { href: '/teacher/attendance', label: 'Smart Attendance', icon: <QrCode /> },
    { href: '/teacher/homework', label: 'Homework', icon: <BookOpen /> },
    { href: '/teacher/planner', label: 'AI Planner', icon: <BrainCircuit /> },
    { href: '/teacher/ratings', label: 'My Ratings', icon: <Star /> },
    { href: '/teacher/reports', label: 'Class Reports', icon: <ClipboardList /> },
    { href: '/teacher/parent-chat', label: 'Parent Chat', icon: <MessageSquare /> },
    { href: '/teacher/gallery', label: 'School Gallery', icon: <Camera /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Demo Teacher"
      userRole="Teacher"
    >
      {children}
    </DashboardLayout>
  );
}
