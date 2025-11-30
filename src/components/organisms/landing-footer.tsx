import Link from 'next/link';

interface LandingFooterProps {
  appName: string;
  year?: number;
}

export function LandingFooter({
  appName,
  year = new Date().getFullYear()
}: LandingFooterProps) {
  return (
    <footer className="border-border bg-background border-t">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center space-x-2">
              <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-md">
                <span className="text-sm font-bold">AV</span>
              </div>
              <span className="font-bold">{appName}</span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              Crea agentes de voz inteligentes con tecnología Gemini 2.0 Flash.
              Conversaciones naturales en tiempo real.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Producto</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/voice/conversations"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mis Conversaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/voice/start"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Crear Agente
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://ai.google.dev/gemini-api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentación
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-12 border-t pt-8">
          <p className="text-muted-foreground text-center text-sm">
            &copy; {year} {appName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
