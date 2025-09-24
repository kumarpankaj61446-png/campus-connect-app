import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

  return (
    <section className="bg-card">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-24 md:px-6">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
            The Future of School Management
          </h1>
          <p className="max-w-[600px] text-foreground/80 md:text-xl">
            CampusConnect is an all-in-one platform that streamlines
            administration, enhances learning, and fosters communication between
            students, teachers, and parents.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center md:justify-start">
            <Button asChild size="lg">
              <Link href="#pricing">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#">Watch Demo</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </div>
      </div>
    </section>
  );
}
