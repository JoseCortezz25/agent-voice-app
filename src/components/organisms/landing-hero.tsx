import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
}

export function LandingHero({
  headline,
  subheadline,
  ctaText,
  ctaHref
}: LandingHeroProps) {
  return (
    <section className="border-border bg-background relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b px-4 py-20 sm:py-32">
      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="border-border bg-muted/50 mb-8 inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <span className="bg-foreground mr-2 inline-block h-2 w-2 animate-pulse rounded-full"></span>
            Powered by Gemini 2.0 Flash
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
            {subheadline}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 min-w-[200px] px-8 text-base font-medium"
            >
              <Link href={ctaHref}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </section>
  );
}
