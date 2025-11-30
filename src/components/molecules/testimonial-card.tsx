import { Card, CardContent } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <Card className="border-border bg-card border">
      <CardContent className="pt-6">
        <blockquote className="space-y-4">
          <p className="text-foreground text-base leading-relaxed">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="text-sm">
            <cite className="not-italic">
              <strong className="text-foreground font-semibold">
                {author}
              </strong>
              {role && <span className="text-muted-foreground"> · {role}</span>}
            </cite>
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
