/**
 * Active Conversation Page
 * Real-time voice interaction with transcripts and controls
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import { ConnectionStatus } from '@/domains/voice-agent/components/atoms/connection-status';
import { useGeminiLive } from '@/domains/voice-agent/hooks/use-gemini-live';
import { getConversationById } from '@/domains/voice-agent/repositories/conversation.repository';
import { GEMINI_LIVE_TEXT } from '@/domains/voice-agent/text-maps/gemini-live.text-map';
import type { Conversation } from '@/domains/voice-agent/types';

export default function ActiveConversationPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const hasConnectedRef = useRef(false);
  const isDisconnectingRef = useRef(false);

  const { status, isMuted, toggleMute, connect, disconnect, error } =
    useGeminiLive();

  // Load conversation configuration
  useEffect(() => {
    async function loadConversation() {
      try {
        setIsLoadingConfig(true);
        const conv = await getConversationById(sessionId);

        if (!conv) {
          toast.error(GEMINI_LIVE_TEXT.session.errors.configNotFound);
          router.push('/gemini-live');
          return;
        }

        setConversation(conv);
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast.error(GEMINI_LIVE_TEXT.toast.errorLoading);
        router.push('/gemini-live');
      } finally {
        setIsLoadingConfig(false);
      }
    }

    // Clear the disconnect flag when entering this page (allows reconnection)
    sessionStorage.removeItem(`disconnected_${sessionId}`);
    hasConnectedRef.current = false; // Reset connection flag to allow reconnect

    loadConversation();
  }, [sessionId, router]);

  // Auto-connect when conversation is loaded (only once per session)
  useEffect(() => {
    // Check sessionStorage to prevent reconnect after manual disconnect
    const hasDisconnected = sessionStorage.getItem(`disconnected_${sessionId}`);

    if (!conversation) return;

    if (
      conversation &&
      status === 'disconnected' &&
      !hasConnectedRef.current &&
      !hasDisconnected
    ) {
      hasConnectedRef.current = true;
      connect({
        voiceName: conversation.config.voiceName,
        systemPrompt: conversation.systemPrompt,
        model: conversation.config.model,
        conversationId: conversation.id
      });
    }
  }, [conversation, status, connect, sessionId]);

  // Handle disconnect and navigation
  const handleDisconnect = async () => {
    // Mark this session as disconnected in sessionStorage
    sessionStorage.setItem(`disconnected_${sessionId}`, 'true');
    isDisconnectingRef.current = true;

    try {
      await disconnect().then(() => {
        router.push('/gemini-live');
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  // Clear disconnect flag when leaving the page completely (refresh/close browser)
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(`disconnected_${sessionId}`);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId]);

  const isActive = status === 'connected';

  // Show loading while fetching configuration
  if (isLoadingConfig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-void)] p-[var(--space-4)]">
        <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-8)] text-center">
          <p className="font-[family-name:var(--font-display)] text-[var(--color-muted)]">
            {GEMINI_LIVE_TEXT.session.loading.loadingConfig}
          </p>
        </div>
      </div>
    );
  }

  // Show error if conversation not found
  if (!conversation) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-void)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-deep)]">
        <div className="container mx-auto flex items-center justify-between p-[var(--space-4)]">
          <div className="flex items-center gap-[var(--space-3)]">
            <button
              onClick={handleDisconnect}
              disabled={status === 'connecting'}
              className="flex h-10 w-10 items-center justify-center rounded-none border border-[var(--color-border)] text-[var(--color-cyan)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-slate)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-[family-name:var(--font-display)] font-medium text-[var(--color-text)] text-[var(--text-lg)]">
                {conversation.title}
              </h1>
              <p className="text-[var(--color-faint)] text-[var(--text-xs)]">
                {GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
              </p>
            </div>
          </div>
          <ConnectionStatus status={status} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex-1 p-[var(--space-4)]">
        <div className="mx-auto max-w-3xl space-y-[var(--space-6)]">
          {/* Connecting State */}
          {status === 'connecting' && (
            <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-8)] text-center">
              <p className="font-[family-name:var(--font-display)] text-[var(--color-muted)]">
                {GEMINI_LIVE_TEXT.session.loading.connecting}
              </p>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="rounded-none border border-[var(--color-error)] bg-[var(--color-deep)] p-[var(--space-6)] text-center">
              <p className="mb-[var(--space-4)] font-[family-name:var(--font-display)] text-[var(--color-error)]">
                {error || GEMINI_LIVE_TEXT.session.errors.connectionFailed}
              </p>
              <div className="flex justify-center gap-[var(--space-3)]">
                <button
                  onClick={() =>
                    connect({
                      voiceName: conversation.config.voiceName,
                      systemPrompt: conversation.systemPrompt,
                      model: conversation.config.model,
                      conversationId: conversation.id
                    })
                  }
                  className="h-[var(--button-height)] rounded-none border border-[var(--color-border)] bg-transparent px-[var(--space-4)] font-medium text-[var(--color-text)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-slate)]"
                >
                  {GEMINI_LIVE_TEXT.common.retry}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="h-[var(--button-height)] rounded-none border border-[var(--color-border)] bg-transparent px-[var(--space-4)] font-medium text-[var(--color-text)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-slate)]"
                >
                  {GEMINI_LIVE_TEXT.common.back}
                </button>
              </div>
            </div>
          )}

          {/* Active Session */}
          {isActive && (
            <>
              {/* Controls */}
              <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-6)]">
                <div className="flex items-center justify-center gap-[var(--space-4)]">
                  <button
                    onClick={toggleMute}
                    className={`flex h-[var(--button-height)] items-center gap-[var(--space-2)] rounded-none px-[var(--space-6)] font-medium transition-all duration-[var(--duration-fast)] ${
                      isMuted
                        ? 'border border-[var(--color-error)] bg-[var(--color-error)] text-white hover:brightness-110'
                        : 'border border-[var(--color-cyan)] bg-[var(--color-cyan)] text-[var(--color-deep)] hover:brightness-110'
                    } `}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="h-5 w-5" />
                        {GEMINI_LIVE_TEXT.session.controls.unmute}
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5" />
                        {GEMINI_LIVE_TEXT.session.controls.mute}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="h-[var(--button-height)] rounded-none border border-[var(--color-border)] bg-transparent px-[var(--space-6)] font-medium text-[var(--color-text)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-slate)]"
                  >
                    {GEMINI_LIVE_TEXT.session.controls.disconnect}
                  </button>
                </div>
              </div>

              {/* Session Info */}
              <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-4)]">
                <div className="text-center text-[var(--text-sm)]">
                  <p className="mb-[var(--space-1)] font-[family-name:var(--font-display)] font-medium text-[var(--color-text)]">
                    {GEMINI_LIVE_TEXT.session.title}
                  </p>
                  <p className="text-[var(--color-muted)] text-[var(--text-xs)]">
                    {isMuted
                      ? 'Micrófono silenciado'
                      : 'Habla para comenzar la conversación'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
