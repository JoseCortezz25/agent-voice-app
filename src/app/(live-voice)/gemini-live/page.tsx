'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <div className="bg-background flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {GEMINI_LIVE_TEXT.landing.title}
          </h1>
          <Button onClick={() => router.push('/gemini-live/new')} size="lg">
            {GEMINI_LIVE_TEXT.landing.newConversationButton}
          </Button>
        </div>

        <Separator className="mb-6" />

        {/* Loading State */}
        {isLoading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {GEMINI_LIVE_TEXT.common.loading}
            </p>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && conversations.length === 0 && (
          <Card className="p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">
              {GEMINI_LIVE_TEXT.landing.emptyState.title}
            </h2>
            <p className="text-muted-foreground mb-4">
              {GEMINI_LIVE_TEXT.landing.emptyState.description}
            </p>
            <Button onClick={() => router.push('/gemini-live/new')}>
              {GEMINI_LIVE_TEXT.landing.emptyState.createButton}
            </Button>
          </Card>
        )}

        {/* Conversations List */}
        {!isLoading && conversations.length > 0 && (
          <div className="space-y-3">
            <ConversationsList />
          </div>
        )}
      </div>
    </div>
  );
}
