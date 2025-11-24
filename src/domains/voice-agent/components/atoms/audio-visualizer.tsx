/**
 * Audio Visualizer Component
 * Visual feedback for audio activity
 */

'use client';

import { cn } from '@/lib/utils';

interface AudioVisualizerProps {
  isActive: boolean;
  bars?: number;
  className?: string;
}

export function AudioVisualizer({
  isActive,
  bars = 5,
  className
}: AudioVisualizerProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label={isActive ? 'Audio active' : 'Audio inactive'}
    >
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-primary w-1 rounded-full transition-all duration-150',
            isActive ? 'h-8 animate-pulse' : 'h-2'
          )}
          style={{
            animationDelay: isActive ? `${index * 0.1}s` : '0s',
            animationDuration: isActive ? `${0.6 + index * 0.1}s` : '0s'
          }}
        />
      ))}
    </div>
  );
}
