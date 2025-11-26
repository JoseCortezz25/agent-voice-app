/**
 * Audio Visualizer - Organic Breathing Bars
 * Sonic Architecture: Random delays, organic wave motion
 * Cyan when active, faint when idle
 */

'use client';

import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
  bars?: number;
  className?: string;
}

// Generate random animation delays for organic feel
const generateRandomDelay = (index: number) => {
  const baseDelay = index * 80;
  const randomVariation = Math.random() * 40 - 20; // ±20ms variation
  return baseDelay + randomVariation;
};

export function AudioVisualizer({
  isActive,
  bars = 7,
  className
}: AudioVisualizerProps) {
  return (
    <div
      className={cn('flex h-14 items-center justify-center gap-1', className)}
      role="status"
      aria-label={isActive ? 'Audio active' : 'Audio inactive'}
      aria-live="polite"
    >
      {Array.from({ length: bars }).map((_, index) => {
        const delay = generateRandomDelay(index);
        const duration = 800 + Math.random() * 200; // 800-1000ms

        return (
          <div
            key={index}
            className={cn(
              'w-1 rounded-full transition-all',

              // Active state - Organic wave with cyan
              isActive && [
                'bg-[var(--color-cyan)]',
                'animate-[visualizer-organic_var(--duration-slow)_ease-in-out_infinite]',
                'shadow-[0_0_8px_var(--color-cyan-glow)]'
              ],

              // Idle state - Faint grey, minimal height
              !isActive && ['bg-[var(--color-faint)]', 'h-2', 'opacity-40']
            )}
            style={{
              animationDelay: isActive ? `${delay}ms` : '0ms',
              animationDuration: isActive ? `${duration}ms` : '0ms',
              height: isActive ? undefined : '8px'
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
