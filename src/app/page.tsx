import { LandingHeader } from '@/components/organisms/landing-header';
import { LandingHero } from '@/components/organisms/landing-hero';
import { LandingFeatures } from '@/components/organisms/landing-features';
import { LandingTestimonials } from '@/components/organisms/landing-testimonials';
import { LandingFooter } from '@/components/organisms/landing-footer';
import { Mic, Zap, Settings } from 'lucide-react';

export default function Home() {
  // TODO: Move to text maps in Phase 5 (Domain Architect)
  const features = [
    {
      title: 'Tiempo Real',
      description:
        'Conversaciones naturales con latencia ultra-baja. Habla con tu agente como si fuera una persona real.',
      icon: Zap
    },
    {
      title: 'Múltiples Voces',
      description:
        'Elige entre diferentes voces y personalidades para que tu agente suene exactamente como lo imaginas.',
      icon: Mic
    },
    {
      title: 'System Prompts Personalizados',
      description:
        'Customiza el comportamiento de tu agente con instrucciones específicas. Define su personalidad, tono y conocimientos.',
      icon: Settings
    }
  ];

  const testimonials = [
    {
      quote:
        'La experiencia es increíble. Es como hablar con una persona real, pero con el conocimiento de una IA.',
      author: 'María González',
      role: 'Desarrolladora'
    },
    {
      quote:
        'Poder personalizar el comportamiento del agente con prompts es un game changer para mis proyectos.',
      author: 'Carlos Ramírez',
      role: 'Product Manager'
    },
    {
      quote:
        'La latencia es prácticamente imperceptible. Finalmente una solución de voz que funciona en español.',
      author: 'Ana Martínez',
      role: 'Diseñadora UX'
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader appName="Agent Voice" />

      <main className="flex-1">
        <LandingHero
          headline="Crea tus agentes y conversa con ellos"
          subheadline="Créalos, customízalos y habla con ellos"
          ctaText="Comenzar Ahora"
          ctaHref="/voice/conversations"
        />

        <LandingFeatures
          title="Características principales"
          features={features}
        />

        <LandingTestimonials
          title="Lo que dicen nuestros usuarios"
          testimonials={testimonials}
        />
      </main>

      <LandingFooter appName="Agent Voice" />
    </div>
  );
}
