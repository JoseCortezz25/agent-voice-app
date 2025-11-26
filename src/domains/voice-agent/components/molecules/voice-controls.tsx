/**
 * Voice Controls Component
 * Combines mic button with audio visualizer
 * Design System: Vertical layout, centered, proper spacing
 */

'use client';

import { MicButton } from '../atoms/mic-button';
import { AudioVisualizer } from '../atoms/audio-visualizer';
import { cn } from '@/lib/utils';

interface VoiceControlsProps {
  isCapturing: boolean;
  isPlaying: boolean;
  isDisabled?: boolean;
  onToggleCapture: () => void;
  className?: string;
}

export function VoiceControls({
  isCapturing,
  isPlaying,
  isDisabled = false,
  onToggleCapture,
  className
}: VoiceControlsProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center',
        'gap-[var(--space-6)]', // 24px spacing
        className
      )}
    >
      {/* Audio Visualizer - above button */}
      <AudioVisualizer isActive={isCapturing || isPlaying} bars={5} />

      {/* Microphone Button - center focal point */}
      <MicButton
        isCapturing={isCapturing}
        isDisabled={isDisabled}
        onClick={onToggleCapture}
      />

      {/* Status Text - below button */}
      <p
        className={cn(
          'font-[family-name:var(--font-geist-sans)]',
          'text-[var(--font-size-sm)]',
          'transition-colors duration-[var(--duration-fast)]',

          // Dynamic color based on state
          isCapturing && 'text-[var(--color-cyan-500)]',
          isPlaying && 'text-[var(--color-electric-500)]',
          !isCapturing && !isPlaying && 'text-[var(--color-silver)]'
        )}
        aria-live="polite"
      >
        {isCapturing
          ? 'Listening...'
          : isPlaying
            ? 'Speaking...'
            : 'Tap to speak'}
      </p>
    </div>
  );
}
