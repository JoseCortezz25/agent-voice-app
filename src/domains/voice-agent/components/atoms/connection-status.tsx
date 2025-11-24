/**
 * Connection Status Indicator
 * Shows WebSocket connection state
 */

'use client';

import { Badge } from '@/components/ui/badge';
import type { ConnectionStatus as ConnectionStatusType } from '../../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  className?: string;
}

const statusConfig: Record<
  ConnectionStatusType,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  disconnected: {
    label: 'Disconnected',
    variant: 'outline'
  },
  connecting: {
    label: 'Connecting...',
    variant: 'secondary'
  },
  connected: {
    label: 'Connected',
    variant: 'default'
  },
  error: {
    label: 'Error',
    variant: 'destructive'
  }
};

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
