import Link from 'next/link';
import { ThemeToggle } from '@/components/atoms/theme-toggle';

interface LandingHeaderProps {
  appName: string;
}

export function LandingHeader({ appName }: LandingHeaderProps) {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-md">
            <span className="text-sm font-bold">AV</span>
          </div>
          <span className="hidden font-bold sm:inline-block">{appName}</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
