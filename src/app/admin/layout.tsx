
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Building, DollarSign, Bell, Settings, Tags, AppWindow, Palette, Users, LayoutDashboard, Folder, Bot, BarChart2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <Building /> },
    { href: '/admin/pricing', label: 'Pricing', icon: <Tags /> },
    { href: '/admin/features', label: 'Features', icon: <AppWindow /> },
    { href: '/admin/design', label: 'Design', icon: <Palette /> },
    { href: '/admin/users', label: 'User Management', icon: <Users /> },
    { href: '/admin/dashboards', label: 'Dashboards', icon: <LayoutDashboard /> },
    { href: '/admin/file-manager', label: 'File Manager', icon: <Folder /> },
    { href: '/admin/feature-analytics', label: 'Feature Analytics', icon: <BarChart2 /> },
    { href: '#', label: 'Reminders', icon: <Bell /> },
    { href: '/admin/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Super Admin"
      userRole="Admin"
    >
      {children}
    </DashboardLayout>
  );
}
