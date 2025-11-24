/**
 * Live Voice Session Component
 * Main organism for Gemini Live voice interaction
 */

'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ConnectionStatus } from '../atoms/connection-status';
import { useGeminiLive } from '../../hooks/use-gemini-live-enhanced';
import { GENERIC_ERROR_MESSAGES } from '../../utils/error-messages';
import type { VoiceName } from '../../types';

interface LiveVoiceSessionProps {
  apiKey: string;
  voiceName?: VoiceName;
  systemInstruction?: string;
}

export function LiveVoiceSession({
  apiKey,
  voiceName = 'Puck',
  systemInstruction = 'You are a helpful voice assistant.'
}: LiveVoiceSessionProps) {
  const {
    connect,
    disconnect,
    toggleMute,
    isMuted,
    status,
    userTranscript,
    aiTranscript,
    history,
    currentSessionId
  } = useGeminiLive();

  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, userTranscript, aiTranscript]);

  // Show error if connection fails
  useEffect(() => {
    if (status === 'error') {
      toast.error(GENERIC_ERROR_MESSAGES.CONNECTION_FAILED);
    }
  }, [status]);

  // Connect on mount
  useEffect(() => {
    if (apiKey && status === 'disconnected') {
      connect({
        apiKey,
        voiceName,
        systemInstruction
      });
    }

    return () => {
      if (status === 'connected') {
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = status === 'connected';

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gemini Live Voice</h1>
          <ConnectionStatus status={status} />
        </div>

        <Separator className="mb-6" />

        {/* Connection Section */}
        {!isActive ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center">
              {status === 'connecting'
                ? 'Connecting to Gemini Live API...'
                : status === 'error'
                  ? 'Connection failed. Please check your API key and try again.'
                  : 'Initializing voice assistant...'}
            </p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="mb-6 flex items-center justify-center gap-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? 'destructive' : 'secondary'}
                size="lg"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button onClick={disconnect} variant="outline" size="lg">
                Disconnect
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Live Transcripts */}
            {(userTranscript || aiTranscript) && (
              <>
                <div className="mb-6 space-y-3">
                  <h2 className="text-muted-foreground text-sm font-medium">
                    Live Transcripts
                  </h2>
                  {userTranscript && (
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                        You:
                      </p>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">
                        {userTranscript}
                      </p>
                    </div>
                  )}
                  {aiTranscript && (
                    <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950">
                      <p className="text-xs font-medium text-purple-900 dark:text-purple-100">
                        AI:
                      </p>
                      <p className="mt-1 text-sm text-purple-700 dark:text-purple-200">
                        {aiTranscript}
                      </p>
                    </div>
                  )}
                </div>
                <Separator className="mb-6" />
              </>
            )}

            {/* Message History */}
            {history.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-muted-foreground text-sm font-medium">
                  Conversation History
                </h2>
                <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border p-4">
                  {history.map(message => (
                    <div
                      key={message.id}
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-50 dark:bg-blue-950'
                          : 'bg-purple-50 dark:bg-purple-950'
                      }`}
                    >
                      <p
                        className={`text-xs font-medium ${
                          message.role === 'user'
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-purple-900 dark:text-purple-100'
                        }`}
                      >
                        {message.role === 'user' ? 'You' : 'AI'}:
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          message.role === 'user'
                            ? 'text-blue-700 dark:text-blue-200'
                            : 'text-purple-700 dark:text-purple-200'
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  ))}
                  <div ref={historyEndRef} />
                </div>
              </div>
            )}

            {/* Session Info */}
            {currentSessionId && (
              <div className="text-muted-foreground mt-6 text-center text-xs">
                Session ID: {currentSessionId}
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
