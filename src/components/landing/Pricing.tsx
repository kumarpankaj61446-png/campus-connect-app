import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Pro",
    price: "₹25",
    per: "/student/month",
    description: "Essential features for schools getting started.",
    features: [
      "Role-Based Dashboards",
      "AI Study Buddy",
      "Basic Report Generation",
      "Parent-Teacher Chat",
    ],
    cta: "Choose Pro",
    plan: "pro"
  },
  {
    name: "Premium",
    price: "₹55",
    per: "/student/month",
    description: "The complete suite for advanced school management.",
    features: [
      "All features in Pro",
      "Full Financial Dashboard",
      "Advanced Analytics",
      "File Manager & Storage",
      "Payment Gateway Integration",
    ],
    cta: "Choose Premium",
    popular: true,
    plan: "premium"
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto px-4 py-12 md:px-6 md:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-foreground/80 md:text-lg">
          Choose the plan that's right for your institution. No hidden fees.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
            <CardHeader className="text-center">
              {tier.popular && <div className="text-sm font-semibold text-primary mb-2">MOST POPULAR</div>}
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-foreground/70">{tier.per}</span>
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                <Link href={`/billing?plan=${tier.plan}`}>{tier.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
