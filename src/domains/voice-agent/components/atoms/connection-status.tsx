/**
 * Connection Status Indicator
 * Shows WebSocket connection state
 * Design System: Pill shape, color-coded states, pulsing dot when connecting
 */

'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ConnectionStatus as ConnectionStatusType } from '../../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  className?: string;
}

const statusConfig: Record<
  ConnectionStatusType,
  {
    label: string;
    bgColor: string;
    textColor: string;
    dotColor: string;
    showSpinner?: boolean;
    pulsingDot?: boolean;
  }
> = {
  disconnected: {
    label: 'Disconnected',
    bgColor: 'bg-[var(--color-slate)]',
    textColor: 'text-[var(--color-silver)]',
    dotColor: 'bg-[var(--color-steel)]'
  },
  connecting: {
    label: 'Connecting...',
    bgColor: 'bg-[var(--color-slate)]',
    textColor: 'text-[var(--color-silver)]',
    dotColor: 'bg-[var(--color-electric-500)]',
    showSpinner: true,
    pulsingDot: true
  },
  connected: {
    label: 'Connected',
    bgColor: 'bg-[var(--color-electric-500)]',
    textColor: 'text-white',
    dotColor: 'bg-white'
  },
  error: {
    label: 'Error',
    bgColor: 'bg-[var(--color-error)]',
    textColor: 'text-white',
    dotColor: 'bg-white'
  }
};

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        // Pill shape
        'inline-flex items-center gap-2 px-3 py-1.5',
        'rounded-full',

        // Colors from config
        config.bgColor,
        config.textColor,

        // Typography
        'text-[var(--font-size-xs)]',
        'font-[family-name:var(--font-departure-mono)]',
        'font-medium tracking-wide uppercase',

        // Transitions
        'transition-all duration-[var(--duration-fast)]',

        className
      )}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Status indicator dot or spinner */}
      {config.showSpinner ? (
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      ) : (
        <span
          className={cn(
            'inline-block h-2 w-2 rounded-full',
            config.dotColor,
            config.pulsingDot && 'animate-pulse'
          )}
          aria-hidden="true"
        />
      )}

      {/* Status label */}
      <span>{config.label}</span>
    </div>
  );
}
