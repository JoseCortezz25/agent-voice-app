/**
 * Microphone Button Component
 * Primary action button for voice capture
 */

'use client';

import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <Button
      onClick={onClick}
      disabled={isDisabled}
      size="icon"
      variant={isCapturing ? 'destructive' : 'default'}
      className={cn(
        'h-20 w-20 rounded-full transition-all duration-200',
        isCapturing && 'animate-pulse',
        className
      )}
      aria-label={isCapturing ? 'Stop speaking' : 'Start speaking'}
    >
      {isCapturing ? (
        <MicOff className="h-8 w-8" />
      ) : (
        <Mic className="h-8 w-8" />
      )}
    </Button>
  );
}
