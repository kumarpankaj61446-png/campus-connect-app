'use client';

import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { School, LogOut, Settings, Monitor, Sun, Moon, Bell, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { VoiceCommand } from './VoiceCommand';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

type DashboardLayoutProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
};

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  const themes = [
    { name: 'White', value: 'light', icon: Sun },
    { name: 'Black', value: 'dark', icon: Moon },
  ];

  return (
     <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground px-2">Theme</p>
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? 'secondary' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => setTheme(t.value)}
              >
                <t.icon className="mr-2 h-4 w-4" />
                {t.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
  )
}

const mockNotifications: Record<string, {title: string, description: string, icon?: any}[]> = {
    Principal: [
        { title: "Teacher rating received", description: "New rating for Mr. Sharma from Class 10." },
        { title: "Fee Payment Alert", description: "Invoice #1234 has been paid." },
    ],
    Teacher: [
        { title: "Homework Submitted", description: "Anjali Sharma submitted her Math homework." },
        { title: "New Parent Message", description: "You have a new message from Rohan's parent." },
    ],
    Student: [
        { title: "New Homework Assigned", description: "Your Science homework is due tomorrow." },
        { title: "Grade Updated", description: "Your recent English essay has been graded." },
    ],
     Parent: [
        { title: "Attendance Alert", description: "Anjali was marked present today at 8:30 AM." },
        { title: "New Fee Invoice", description: "A new invoice for Term 2 fees is available." },
    ],
    Admin: [
         { title: "New School Registered", description: "Oakridge International has just signed up." },
         { title: "System Update", description: "A new version of the app is available." },
         { title: "Billing Alert", description: "Greenwood High exceeded their student limit by 50.", icon: Bot },
    ],
    Financial: [
        { title: "Q2 Budget Approved", description: "The budget for the second quarter has been approved." },
        { title: "Expense Report Due", description: "The monthly expense report is due by Friday." },
    ]
}

function Notifications({ userRole }: { userRole: string }) {
    const notifications = mockNotifications[userRole as keyof typeof mockNotifications] || [];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                     {notifications.length > 0 && (
                        <Badge variant="destructive" className="absolute top-1 right-1 h-4 w-4 justify-center p-0 text-xs">
                           {notifications.length}
                        </Badge>
                     )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
                <div className="p-2 font-bold border-b">Notifications</div>
                <div className="space-y-2 p-2">
                    {notifications.length > 0 ? notifications.map((notif, index) => (
                        <div key={index} className="text-sm flex items-start gap-3">
                           {notif.icon && <notif.icon className="w-4 h-4 mt-1 text-primary" />}
                           <div>
                            <p className="font-semibold">{notif.title}</p>
                            <p className="text-muted-foreground">{notif.description}</p>
                           </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center p-4">No new notifications.</p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}


export function DashboardLayout({
  children,
  navItems,
  userName,
  userRole,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/');
    } catch (error) {
      console.error("Logout Error: ", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };

  return (
    <SidebarProvider userRole={userRole}>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <School className="size-6 text-primary" />
            <span className="text-lg font-semibold">CampusConnect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={item.active} tooltip={item.label}>
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center justify-between p-2">
             <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://avatar.vercel.sh/${userName}.png`} alt={userName} />
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="font-medium truncate text-sm">{userName}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{userRole}</p>
                </div>
            </div>
             <div className="flex items-center group-data-[collapsible=icon]:hidden">
                 <ThemeSwitcher />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <SidebarTrigger />
          <h1 className="flex-1 text-lg font-semibold">{userRole} Dashboard</h1>
          <VoiceCommand />
          <Notifications userRole={userRole} />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
