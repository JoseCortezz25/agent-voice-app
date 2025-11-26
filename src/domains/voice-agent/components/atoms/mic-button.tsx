/**
 * Microphone Button - GIANT Focal Point
 * Sonic Architecture: 120px circular button with dual-glow system
 * Cyan (default) → Orange (active/listening)
 */

'use client';

import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicButtonProps {
  isCapturing: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  className?: string;
}

export function MicButton({
  isCapturing,
  isDisabled = false,
  onClick,
  className
}: MicButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        // Size - GIANT 120px
        'relative flex items-center justify-center',
        'rounded-full',
        'transition-all duration-[var(--duration-normal)]',

        // Size variants
        isCapturing
          ? 'h-[var(--mic-button-active)] w-[var(--mic-button-active)]'
          : 'h-[var(--mic-button-size)] w-[var(--mic-button-size)]',

        // Default state - Cyan glow
        !isCapturing &&
          !isDisabled && [
            'bg-[var(--color-deep)]',
            'border-2 border-[var(--color-cyan)]',
            'text-[var(--color-cyan)]',
            'shadow-[var(--glow-cyan)]',
            'hover:scale-105 hover:border-[var(--color-cyan)]',
            'active:scale-100'
          ],

        // Active/Capturing state - Orange glow + breathe animation
        isCapturing &&
          !isDisabled && [
            'bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-error)]',
            'border-2 border-[var(--color-orange)]',
            'text-white',
            'shadow-[var(--glow-orange)]',
            'animate-[glow-pulse-orange_2s_ease-in-out_infinite]',
            'scale-105'
          ],

        // Disabled state
        isDisabled && [
          'bg-[var(--color-slate)]',
          'border-2 border-[var(--color-border)]',
          'text-[var(--color-faint)]',
          'cursor-not-allowed',
          'opacity-50'
        ],

        // Focus states
        'focus:ring-4 focus:outline-none',
        isCapturing
          ? 'focus:ring-[var(--color-orange-subtle)]'
          : 'focus:ring-[var(--color-cyan-subtle)]',

        className
      )}
      aria-label={isCapturing ? 'Stop listening' : 'Start listening'}
      aria-pressed={isCapturing}
    >
      {/* Icon - Large 48px */}
      {isCapturing ? (
        <MicOff className="h-12 w-12" strokeWidth={2} />
      ) : (
        <Mic className="h-12 w-12" strokeWidth={2} />
      )}

      {/* Outer ring pulse when active */}
      {isCapturing && !isDisabled && (
        <>
          <span
            className="absolute inset-[-4px] animate-ping rounded-full border border-[var(--color-orange)] opacity-60"
            style={{ animationDuration: '2s' }}
            aria-hidden="true"
          />
          <span
            className="absolute inset-[-8px] animate-ping rounded-full border border-[var(--color-orange)] opacity-40"
            style={{ animationDuration: '2.5s', animationDelay: '0.3s' }}
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}
