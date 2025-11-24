/**
 * Voice Controls Component
 * Combines mic button with audio visualizer
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
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Audio Visualizer */}
      <AudioVisualizer
        isActive={isCapturing || isPlaying}
        bars={7}
        className="h-12"
      />

      {/* Microphone Button */}
      <MicButton
        isCapturing={isCapturing}
        isDisabled={isDisabled}
        onClick={onToggleCapture}
      />

      {/* Status Text */}
      <p className="text-muted-foreground text-sm">
        {isCapturing
          ? 'Listening...'
          : isPlaying
            ? 'Speaking...'
            : 'Tap to speak'}
      </p>
    </div>
  );
}
