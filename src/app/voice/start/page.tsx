/**
 * New Conversation Setup Page
 * Configure system instruction and voice before starting
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceHeader } from '@/components/organisms/voice-header';
import type { Conversation, VoiceName } from '@/domains/voice-agent/types';
import { createConversation } from '@/domains/voice-agent/repositories/conversation.repository';
import { useConversationStore } from '@/domains/voice-agent/stores/conversation.store';
import { GEMINI_LIVE_TEXT } from '@/domains/voice-agent/text-maps/gemini-live.text-map';

const VOICES: VoiceName[] = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'];

export default function NewConversationPage() {
  const router = useRouter();
  const { addConversation } = useConversationStore();
  const [title, setTitle] = useState('');
  const [systemInstruction, setSystemInstruction] = useState<string>(
    GEMINI_LIVE_TEXT.configuration.systemPrompt.default
  );
  const [voiceName, setVoiceName] = useState<VoiceName>('Puck');
  const [creating, setCreating] = useState(false);

  const handleCreateConversation = async () => {
    try {
      // Validation
      if (!title.trim()) {
        toast.error(GEMINI_LIVE_TEXT.configuration.validation.titleRequired);
        return;
      }

      if (!systemInstruction.trim()) {
        toast.error(
          GEMINI_LIVE_TEXT.configuration.validation.systemPromptRequired
        );
        return;
      }

      setCreating(true);

      // Create conversation with repository
      const conversation = await createConversation({
        title: title.trim(),
        systemPrompt: systemInstruction.trim(),
        config: {
          voiceName,
          temperature: 0.7,
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          language: 'es',
          audioFormat: 'linear16',
          sampleRate: 16000
        }
      } as Conversation);

      // Update Zustand store for immediate UI update
      addConversation(conversation);

      // Show success toast
      toast.success(GEMINI_LIVE_TEXT.toast.conversationCreated);

      // Navigate to the active session
      router.push(`/voice/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error(GEMINI_LIVE_TEXT.toast.errorCreating);
      setCreating(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <VoiceHeader
        variant="simple"
        backLink={{ href: '/voice/conversations', label: '← Conversaciones' }}
      />

      {/* Main Content */}
      <main className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
        <div className="w-full max-w-2xl">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">
              {GEMINI_LIVE_TEXT.configuration.pageTitle}
            </h1>
            <p className="text-muted-foreground">
              {GEMINI_LIVE_TEXT.configuration.subtitle}
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Agente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {GEMINI_LIVE_TEXT.configuration.conversationTitle.label}
                </Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={
                    GEMINI_LIVE_TEXT.configuration.conversationTitle.placeholder
                  }
                  maxLength={100}
                />
                <p className="text-muted-foreground text-xs">
                  {GEMINI_LIVE_TEXT.configuration.conversationTitle.hint}
                </p>
              </div>

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label htmlFor="voice">
                  {GEMINI_LIVE_TEXT.configuration.voice.label}
                </Label>
                <Select
                  value={voiceName}
                  onValueChange={value => setVoiceName(value as VoiceName)}
                >
                  <SelectTrigger id="voice">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map(voice => (
                      <SelectItem key={voice} value={voice}>
                        {GEMINI_LIVE_TEXT.voices[voice]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground text-xs">
                  {GEMINI_LIVE_TEXT.configuration.voice.hint}
                </p>
              </div>

              {/* System Instruction Field */}
              <div className="space-y-2">
                <Label htmlFor="system-instruction">
                  {GEMINI_LIVE_TEXT.configuration.systemPrompt.label}
                </Label>
                <Textarea
                  id="system-instruction"
                  value={systemInstruction}
                  onChange={e => setSystemInstruction(e.target.value)}
                  placeholder={
                    GEMINI_LIVE_TEXT.configuration.systemPrompt.placeholder
                  }
                  rows={6}
                  maxLength={2000}
                  className="min-h-[120px] resize-y"
                />
                <p className="text-muted-foreground text-xs">
                  {GEMINI_LIVE_TEXT.configuration.systemPrompt.hint}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={creating}
                  className="flex-1"
                >
                  {GEMINI_LIVE_TEXT.configuration.actions.cancel}
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateConversation}
                  disabled={
                    creating || !systemInstruction.trim() || !title.trim()
                  }
                  className="flex-1"
                >
                  {creating
                    ? GEMINI_LIVE_TEXT.configuration.actions.creating
                    : GEMINI_LIVE_TEXT.configuration.actions.start}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
