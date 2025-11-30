import { TestimonialCard } from '@/components/molecules/testimonial-card';

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

interface LandingTestimonialsProps {
  title: string;
  testimonials: Testimonial[];
}

export function LandingTestimonials({
  title,
  testimonials
}: LandingTestimonialsProps) {
  return (
    <section className="border-border bg-muted/30 border-b px-4 py-20 sm:py-24 md:py-32">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            Descubre cómo están usando Agent Voice
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
