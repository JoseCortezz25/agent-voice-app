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
    <article
      onClick={handleCardClick}
      className={cn(
        // Card structure - sharp corners (minimal austero)
        'group relative',
        'bg-[var(--bg-secondary)]',
        'border border-[var(--border-subtle)]',
        'rounded-none', // Sharp corners per design system
        'p-[var(--space-4)]',

        // Hover state - electric blue border
        'hover:border-[var(--color-electric-500)]',
        'transition-all duration-[var(--duration-fast)]',

        // Cursor and interactions
        'cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-[var(--color-electric-500)] focus-visible:ring-offset-2 focus-visible:outline-none'
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
          {/* Title - Display font (monospace) */}
          <h3
            className={cn(
              'font-[family-name:var(--font-departure-mono)]',
              'text-[var(--font-size-lg)]',
              'font-bold',
              'text-[var(--text-primary)]',
              'mb-[var(--space-2)]',
              'truncate'
            )}
          >
            {conversation.title}
          </h3>

          {/* Last message timestamp */}
          <p
            className={cn(
              'text-[var(--font-size-sm)]',
              'text-[var(--text-tertiary)]',
              'mb-[var(--space-3)]'
            )}
          >
            {GEMINI_LIVE_TEXT.landing.conversationCard.lastMessage}:{' '}
            {formatDate(conversation.lastMessageAt)}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-[var(--space-3)]">
            {/* Voice badge */}
            <span
              className={cn(
                'inline-flex items-center gap-1',
                'px-[var(--space-2)] py-1',
                'rounded-full',
                'bg-[var(--color-slate)]',
                'text-[var(--color-silver)]',
                'text-[var(--font-size-xs)]',
                'font-[family-name:var(--font-departure-mono)]',
                'tracking-wide uppercase'
              )}
            >
              {GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
            </span>

            {/* Message count */}
            <span
              className={cn(
                'inline-flex items-center gap-1',
                'text-[var(--font-size-xs)]',
                'text-[var(--text-tertiary)]'
              )}
            >
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
          className={cn(
            'flex-shrink-0',
            'h-8 w-8',
            'rounded-none', // Sharp corners
            'flex items-center justify-center',

            // Colors
            'text-[var(--color-steel)]',
            'hover:bg-[var(--color-error)]',
            'hover:text-white',

            // Transitions
            'transition-all duration-[var(--duration-fast)]',

            // Focus
            'focus-visible:ring-2 focus-visible:ring-[var(--color-error)] focus-visible:outline-none'
          )}
          aria-label={`Delete conversation: ${conversation.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
