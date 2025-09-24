
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School, Eye, EyeOff } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';


export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const capitalizedRole = role === 'financial' ? 'Financial Dashboard' : role.charAt(0).toUpperCase() + role.slice(1);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const getRedirectUrl = () => {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'principal':
        return '/principal/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'financial':
        return '/financial/dashboard';
      default:
        return '/student/dashboard';
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
            <School className="h-6 w-6 text-primary" />
            <span>CampusConnect</span>
          </Link>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Sign in to the {capitalizedRole} to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {role !== 'admin' && role !== 'financial' && (
               <div className="space-y-2">
                <Label htmlFor="school-code">School Code</Label>
                <Input id="school-code" type="text" placeholder="Enter your school's unique code" required />
              </div>
            )}
             {(role === 'principal' || role === 'financial') && (
               <div className="space-y-2">
                <Label htmlFor="school-code">School ID</Label>
                <Input id="school-code" type="text" placeholder="Enter your school's ID" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="#"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} required />
                    <Button 
                        type="button"
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(prev => !prev)}
              />
              <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href={getRedirectUrl()}>Login with Email</Link>
            </Button>
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
             <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
