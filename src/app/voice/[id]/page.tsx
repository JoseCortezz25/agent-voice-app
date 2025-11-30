/**
 * Active Conversation Page
 * Real-time voice interaction with transcripts and controls
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceHeader } from '@/components/organisms/voice-header';
import { useGeminiLive } from '@/domains/voice-agent/hooks/use-gemini-live';
import { getConversationById } from '@/domains/voice-agent/repositories/conversation.repository';
import { GEMINI_LIVE_TEXT } from '@/domains/voice-agent/text-maps/gemini-live.text-map';
import type { Conversation } from '@/domains/voice-agent/types';

export default function ActiveConversationPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

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
          router.push('/voice/conversations');
          return;
        }

        setConversation(conv);
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast.error(GEMINI_LIVE_TEXT.toast.errorLoading);
        router.push('/voice/conversations');
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
        router.push('/voice/conversations');
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
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {GEMINI_LIVE_TEXT.session.loading.loadingConfig}
            </p>
          </CardContent>
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
      <VoiceHeader
        variant="session"
        onBack={handleDisconnect}
        title={conversation.title}
        subtitle={GEMINI_LIVE_TEXT.voices[conversation.config.voiceName]}
        status={status}
        backDisabled={status === 'connecting'}
      />

      {/* Main Content */}
      <main className="container mx-auto flex-1 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Connecting State */}
          {status === 'connecting' && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {GEMINI_LIVE_TEXT.session.loading.connecting}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {status === 'error' && (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
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
              </CardContent>
            </Card>
          )}

          {/* Active Session */}
          {isActive && (
            <>
              {/* Session Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">
                    {GEMINI_LIVE_TEXT.session.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">
                    {isMuted
                      ? 'Micrófono silenciado'
                      : 'Habla para comenzar la conversación'}
                  </p>
                </CardContent>
              </Card>

              {/* Controls */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={toggleMute}
                      variant={isMuted ? 'destructive' : 'default'}
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
                    <Button variant="outline" onClick={handleDisconnect}>
                      {GEMINI_LIVE_TEXT.session.controls.disconnect}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
