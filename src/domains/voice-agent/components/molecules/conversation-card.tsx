/**
 * Conversation Card Molecule
 * Displays individual conversation with metadata and actions
 */

'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { GEMINI_LIVE_TEXT } from '../../text-maps/gemini-live.text-map';
import type { Conversation } from '../../types';

interface ConversationCardProps {
  conversation: Conversation;
  onDelete: (id: string) => void;
}

export function ConversationCard({
  conversation,
  onDelete
}: ConversationCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/gemini-live/${conversation.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };

  const formatDate = (date?: Date) => {
    if (!date) return GEMINI_LIVE_TEXT.landing.conversationCard.never;
    return new Date(date).toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Card
      onClick={handleCardClick}
      className="hover:bg-accent cursor-pointer transition-colors"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-1">{conversation.title}</CardTitle>
            <CardDescription className="mb-2">
              {GEMINI_LIVE_TEXT.landing.conversationCard.lastMessage}:{' '}
              {formatDate(conversation.lastMessageAt)}
            </CardDescription>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {GEMINI_LIVE_TEXT.landing.conversationCard.messagesCount(
                  conversation.messageCount
                )}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
