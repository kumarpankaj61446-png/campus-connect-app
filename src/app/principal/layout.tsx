

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Home, Users, Folder, DollarSign, FileClock, Settings, Star, AppWindow, ShieldCheck, ClipboardList, Camera } from 'lucide-react';

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/principal/dashboard', label: 'Dashboard', icon: <Home /> },
    { href: '/financial/dashboard', label: 'Financials', icon: <DollarSign /> },
    { href: '/principal/users', label: 'User Management', icon: <Users /> },
    { href: '/principal/teacher-ratings', label: 'Teacher Ratings', icon: <Star /> },
    { href: '/principal/student-reports', label: 'Student Reports', icon: <ClipboardList /> },
    { href: '/principal/hostel-management', label: 'Hostel Management', icon: <Home /> },
    { href: '/principal/gallery', label: 'School Gallery', icon: <Camera /> },
    { href: '/principal/features', label: 'Manage Features', icon: <AppWindow /> },
    { href: '/principal/file-manager', label: 'File Manager', icon: <Folder /> },
    { href: '/principal/reports', label: 'File Analysis', icon: <FileClock /> },
    { href: '/principal/special-access', label: 'Special Access', icon: <ShieldCheck /> },
    { href: '/principal/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Demo Principal"
      userRole="Principal"
    >
      {children}
    </DashboardLayout>
  );
}
