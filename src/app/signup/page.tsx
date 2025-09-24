
import Link from 'next/link';
import { School } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <Link href="/" className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
            <School className="h-6 w-6 text-primary" />
            <span>CampusConnect</span>
          </Link>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Choose your role to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
             <Button asChild className="w-full mb-4">
                <Link href="/signup/principal">Principal (Register Your School)</Link>
            </Button>
            <p className="text-xs text-muted-foreground mb-4">Or sign up as an individual user:</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Sign up as... <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full" align="start">
                 <DropdownMenuItem asChild>
                  <Link href="/login?role=student">Student</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/login?role=teacher">Teacher</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/login?role=parent">Parent</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/login?role=financial">Financial Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
