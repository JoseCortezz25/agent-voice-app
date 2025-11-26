'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ConversationsList } from '@/domains/voice-agent/components/organisms/conversations-list';
import { useConversationStore } from '@/domains/voice-agent/stores/conversation.store';
import { getAllConversations } from '@/domains/voice-agent/repositories/conversation.repository';
import { GEMINI_LIVE_TEXT } from '@/domains/voice-agent/text-maps/gemini-live.text-map';

export default function GeminiLivePage() {
  const { conversations, setConversations } = useConversationStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      try {
        setIsLoading(true);
        const convs = await getAllConversations();
        setConversations(convs);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error(GEMINI_LIVE_TEXT.toast.errorLoading);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [setConversations]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--color-void)] p-[var(--space-4)]">
      <div className="w-full max-w-[var(--content-width)]">
        {/* Header */}
        <header className="mb-[var(--space-8)] flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-display)] font-medium tracking-tight text-[var(--color-text)] text-[var(--text-3xl)]">
            {GEMINI_LIVE_TEXT.landing.title}
          </h1>
          <button
            onClick={() => router.push('/gemini-live/new')}
            className="h-[var(--button-height)] rounded-none bg-[var(--color-cyan)] px-[var(--space-6)] font-medium text-[var(--color-deep)] shadow-[var(--glow-cyan)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-cyan)] hover:brightness-110 active:scale-[0.98]"
          >
            {GEMINI_LIVE_TEXT.landing.newConversationButton}
          </button>
        </header>

        <div className="mb-[var(--space-8)] h-px bg-[var(--color-border)]" />

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-8)] text-center">
            <p className="font-[family-name:var(--font-display)] text-[var(--color-muted)]">
              {GEMINI_LIVE_TEXT.common.loading}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && (
          <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-12)] text-center">
            <h2 className="mb-[var(--space-3)] font-[family-name:var(--font-display)] font-medium text-[var(--color-text)] text-[var(--text-xl)]">
              {GEMINI_LIVE_TEXT.landing.emptyState.title}
            </h2>
            <p className="mb-[var(--space-6)] font-[family-name:var(--font-body)] text-[var(--color-muted)]">
              {GEMINI_LIVE_TEXT.landing.emptyState.description}
            </p>
            <button
              onClick={() => router.push('/gemini-live/new')}
              className="h-[var(--button-height)] rounded-none bg-[var(--color-cyan)] px-[var(--space-6)] font-medium text-[var(--color-deep)] shadow-[0_0_16px_var(--color-cyan-glow)] transition-all duration-[var(--duration-fast)] hover:brightness-110 active:scale-[0.98]"
            >
              {GEMINI_LIVE_TEXT.landing.emptyState.createButton}
            </button>
          </div>
        )}

        {/* Conversations List */}
        {!isLoading && conversations.length > 0 && (
          <div className="space-y-[var(--space-3)]">
            <ConversationsList />
          </div>
        )}
      </div>
    </div>
  );
}
