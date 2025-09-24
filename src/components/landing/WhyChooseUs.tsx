import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle2 } from "lucide-react";

export function WhyChooseUs() {
  const demoVideoImage = PlaceHolderImages.find((img) => img.id === "demo-video");

  return (
    <section className="bg-card">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-12 md:grid-cols-2 md:py-24 md:px-6">
        <div className="flex justify-center">
          {demoVideoImage && (
             <div className="relative group">
             <Image
               src={demoVideoImage.imageUrl}
               alt={demoVideoImage.description}
               width={1024}
               height={576}
               className="rounded-xl shadow-2xl"
               data-ai-hint={demoVideoImage.imageHint}
             />
             <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                 <button className="bg-white/80 backdrop-blur-sm text-primary rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                 </button>
             </div>
           </div>
          )}
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
            Designed for Modern Education
          </h2>
          <p className="text-foreground/80 md:text-lg">
            We built CampusConnect from the ground up to be intuitive, powerful, and secure.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">All-in-One Solution</h4>
                <p className="text-foreground/70">
                  Replace multiple disconnected tools with a single, unified platform.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">Secure & Scalable</h4>
                <p className="text-foreground/70">
                  Built on enterprise-grade infrastructure to ensure your data is safe and the platform grows with you.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h4 className="font-semibold">Dedicated Support</h4>
                <p className="text-foreground/70">
                  Our team is here to help you get the most out of CampusConnect, every step of the way.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
