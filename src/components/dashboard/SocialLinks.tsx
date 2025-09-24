import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Instagram, Facebook, Youtube, Globe } from "lucide-react";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export function SocialLinks() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Connect with Us</CardTitle>
            <CardDescription>Follow our school's official social media channels to stay updated.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-6 md:gap-8">
            <Link href="#" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="text-xs">Instagram</span>
            </Link>
             <Link href="#" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="text-xs">Facebook</span>
            </Link>
             <Link href="#" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <WhatsAppIcon />
                <span className="text-xs">WhatsApp</span>
            </Link>
             <Link href="#" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
                <span className="text-xs">YouTube</span>
            </Link>
             <Link href="#" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-6 w-6" />
                <span className="text-xs">Website</span>
            </Link>
        </CardContent>
    </Card>
  );
}
