/**
 * Active Conversation Page
 * Real-time voice interaction with transcripts and controls
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {GEMINI_LIVE_TEXT.session.loading.loadingConfig}
          </p>
        </Card>
      </div>
    );
  }

  // Show error if conversation not found
  if (!conversation) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDisconnect}
              disabled={status === 'connecting'}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{conversation.title}</h1>
              <p className="text-muted-foreground text-xs">
                {GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
              </p>
            </div>
          </div>
          <ConnectionStatus status={status} />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Connecting State */}
          {status === 'connecting' && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">
                {GEMINI_LIVE_TEXT.session.loading.connecting}
              </p>
            </Card>
          )}

          {/* Error State */}
          {status === 'error' && (
            <Card className="border-destructive p-6 text-center">
              <p className="text-destructive mb-4">
                {error || GEMINI_LIVE_TEXT.session.errors.connectionFailed}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    connect({
                      voiceName: conversation.config.voiceName,
                      systemPrompt: conversation.systemPrompt,
                      model: conversation.config.model,
                      conversationId: conversation.id
                    })
                  }
                >
                  {GEMINI_LIVE_TEXT.common.retry}
                </Button>
                <Button variant="outline" onClick={handleDisconnect}>
                  {GEMINI_LIVE_TEXT.common.back}
                </Button>
              </div>
            </Card>
          )}

          {/* Active Session */}
          {isActive && (
            <>
              {/* Controls */}
              <Card className="p-6">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    onClick={toggleMute}
                    variant={isMuted ? 'destructive' : 'default'}
                    size="lg"
                    className="flex items-center gap-2"
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
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="lg"
                  >
                    {GEMINI_LIVE_TEXT.session.controls.disconnect}
                  </Button>
                </div>
              </Card>

              {/* Session Info */}
              <Card className="p-4">
                <div className="text-muted-foreground text-center text-sm">
                  <p className="font-medium">
                    {GEMINI_LIVE_TEXT.session.title}
                  </p>
                  <p className="text-xs">
                    {isMuted
                      ? 'Micrófono silenciado'
                      : 'Habla para comenzar la conversación'}
                  </p>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
