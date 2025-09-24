
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Home, Wallet, TrendingUp, FileText, Settings, Folder, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/financial/dashboard', label: 'Overview', icon: <Home /> },
    { href: '/financial/fees', label: 'Fee Management', icon: <Wallet /> },
    { href: '/financial/expenses', label: 'Expenses', icon: <TrendingUp /> },
    { href: '/financial/salary', label: 'Salary Management', icon: <Users /> },
    { href: '/financial/reports', label: 'Reports & Analytics', icon: <FileText /> },
    { href: '/financial/file-manager', label: 'File Manager', icon: <Folder /> },
    { href: '/financial/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <DashboardLayout
      navItems={navItems}
      userName="Financial Officer"
      userRole="Finance"
    >
        <div className="mb-4">
            <Button asChild variant="outline">
                <Link href="/principal/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Principal Dashboard
                </Link>
            </Button>
        </div>
      {children}
    </DashboardLayout>
  );
}
