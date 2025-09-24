
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { School, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <School className="h-6 w-6 text-primary" />
          <span>CampusConnect</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-foreground/60 transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default">
                Login
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                <Link href="/login?role=principal">Principal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login?role=financial">Financial Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login?role=admin">Super Admin</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
