import { FeatureCard } from '@/components/molecules/feature-card';
import type { LucideIcon } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  icon?: LucideIcon;
}

interface LandingFeaturesProps {
  title: string;
  features: Feature[];
}

export function LandingFeatures({ title, features }: LandingFeaturesProps) {
  return (
    <section className="border-border bg-background border-b px-4 py-20 sm:py-24 md:py-32">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            Todo lo que necesitas para crear agentes de voz inteligentes
          </p>
        </div>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
