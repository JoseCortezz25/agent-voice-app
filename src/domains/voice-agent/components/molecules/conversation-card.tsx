/**
 * Conversation Card Molecule
 * Displays individual conversation with metadata and actions
 * Design System: Sharp corners, graphite background, electric blue hover border
 */

'use client';

import { useRouter } from 'next/navigation';
import { Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    router.push(`/voice/${conversation.id}`);
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
    <article
      onClick={handleCardClick}
      className={cn(
        // Card structure - minimalist design
        'group relative',
        'bg-card',
        'border-border border',
        'rounded-lg',
        'p-6',

        // Hover state
        'hover:bg-accent',
        'transition-colors duration-150',

        // Cursor and interactions
        'cursor-pointer',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="text-foreground mb-2 truncate text-lg font-semibold">
            {conversation.title}
          </h3>

          {/* Last message timestamp */}
          <p className="text-muted-foreground mb-3 text-sm">
            {GEMINI_LIVE_TEXT.landing.conversationCard.lastMessage}:{' '}
            {formatDate(conversation.lastMessageAt)}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Voice badge */}
            <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium tracking-wide uppercase">
              {GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
            </span>

            {/* Message count */}
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <MessageSquare className="h-3 w-3" aria-hidden="true" />
              {GEMINI_LIVE_TEXT.landing.conversationCard.messagesCount(
                conversation.messageCount
              )}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDeleteClick}
          className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-destructive flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Delete conversation: ${conversation.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
