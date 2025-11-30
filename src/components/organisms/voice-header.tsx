/**
 * Voice Header Organism
 * Reusable header for voice-related pages
 * Supports two variants: simple (with link) and session (with button and status)
 */

'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/atoms/theme-toggle';
import { ConnectionStatus } from '@/domains/voice-agent/components/atoms/connection-status';
import type { ConnectionStatus as ConnectionStatusType } from '@/domains/voice-agent/types';

interface VoiceHeaderSimpleProps {
  variant: 'simple';
  backLink: {
    href: string;
    label: string;
  };
}

interface VoiceHeaderSessionProps {
  variant: 'session';
  onBack: () => void;
  title: string;
  subtitle?: string;
  status: ConnectionStatusType;
  backDisabled?: boolean;
}

type VoiceHeaderProps = VoiceHeaderSimpleProps | VoiceHeaderSessionProps;

export function VoiceHeader(props: VoiceHeaderProps) {
  return (
    <header className="border-border bg-background border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Left Side */}
        {props.variant === 'simple' ? (
          <Link
            href={props.backLink.href}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {props.backLink.label}
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={props.onBack}
              disabled={props.backDisabled}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{props.title}</h1>
              {props.subtitle && (
                <p className="text-muted-foreground text-xs">
                  {props.subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {props.variant === 'session' && (
            <ConnectionStatus status={props.status} />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
