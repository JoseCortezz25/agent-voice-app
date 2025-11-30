import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function FeatureCard({
  title,
  description,
  icon: Icon
}: FeatureCardProps) {
  return (
    <Card className="group border-border bg-card hover:border-foreground/20 relative overflow-hidden border transition-all duration-200 hover:shadow-sm">
      <CardHeader className="pb-4">
        {Icon && (
          <div className="bg-foreground/5 group-hover:bg-foreground/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
            <Icon className="text-foreground h-6 w-6" />
          </div>
        )}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
