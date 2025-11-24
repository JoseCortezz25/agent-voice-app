/**
 * New Conversation Setup Page
 * Configure system instruction and voice before starting
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { Conversation, VoiceName } from '@/domains/voice-agent/types';
import { createConversation } from '@/domains/voice-agent/repositories/conversation.repository';
import { GEMINI_LIVE_TEXT } from '@/domains/voice-agent/text-maps/gemini-live.text-map';

const VOICES: VoiceName[] = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Aoede'];

export default function NewConversationPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(
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

      // Show success toast
      toast.success(GEMINI_LIVE_TEXT.toast.conversationCreated);

      // Navigate to the active session
      router.push(`/gemini-live/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error(GEMINI_LIVE_TEXT.toast.errorCreating);
      setCreating(false);
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {GEMINI_LIVE_TEXT.configuration.pageTitle}
          </h1>
          <p className="text-muted-foreground text-sm">
            {GEMINI_LIVE_TEXT.configuration.subtitle}
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Form */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {GEMINI_LIVE_TEXT.configuration.conversationTitle.label}
            </Label>
            <Input
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

          {/* System Instruction */}
          <div className="space-y-2">
            <Label htmlFor="system-instruction">
              {GEMINI_LIVE_TEXT.configuration.systemPrompt.label}
            </Label>
            <Textarea
              id="system-instruction"
              value={systemInstruction}
              onChange={e =>
                setSystemInstruction(
                  e.target
                    .value as typeof GEMINI_LIVE_TEXT.configuration.systemPrompt.default
                )
              }
              placeholder={
                GEMINI_LIVE_TEXT.configuration.systemPrompt.placeholder
              }
              rows={6}
              maxLength={2000}
            />
            <p className="text-muted-foreground text-xs">
              {GEMINI_LIVE_TEXT.configuration.systemPrompt.hint}
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
        </div>

        <Separator className="my-6" />

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={creating}
            className="flex-1"
          >
            {GEMINI_LIVE_TEXT.configuration.actions.cancel}
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={creating || !systemInstruction.trim() || !title.trim()}
            className="flex-1"
          >
            {creating
              ? GEMINI_LIVE_TEXT.configuration.actions.creating
              : GEMINI_LIVE_TEXT.configuration.actions.start}
          </Button>
        </div>
      </Card>
    </div>
  );
}
