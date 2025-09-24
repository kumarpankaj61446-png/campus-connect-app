import Link from "next/link";
import { School } from "lucide-react";


export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-6 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
           <School className="h-5 w-5 text-primary" />
           <p className="text-sm font-semibold">CampusConnect</p>
        </div>

        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} CampusConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
