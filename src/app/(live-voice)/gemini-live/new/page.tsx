/**
 * New Conversation Setup Page
 * Configure system instruction and voice before starting
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-void)] p-[var(--space-4)]">
      <div className="w-full max-w-[var(--narrow-width)]">
        {/* Header */}
        <header className="mb-[var(--space-8)]">
          <h1 className="mb-[var(--space-2)] font-[family-name:var(--font-display)] font-medium tracking-tight text-[var(--color-text)] text-[var(--text-2xl)]">
            {GEMINI_LIVE_TEXT.configuration.pageTitle}
          </h1>
          <p className="text-[var(--color-muted)] text-[var(--text-sm)]">
            {GEMINI_LIVE_TEXT.configuration.subtitle}
          </p>
        </header>

        {/* Form Card */}
        <div className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)] p-[var(--space-6)]">
          {/* Form */}
          <div className="space-y-[var(--space-6)]">
            {/* Title Field */}
            <div className="space-y-[var(--space-2)]">
              <label
                htmlFor="title"
                className="block font-[family-name:var(--font-display)] font-medium tracking-wide text-[var(--color-text)] text-[var(--text-sm)] uppercase"
              >
                {GEMINI_LIVE_TEXT.configuration.conversationTitle.label}
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={
                  GEMINI_LIVE_TEXT.configuration.conversationTitle.placeholder
                }
                maxLength={100}
                className="h-[var(--input-height)] w-full rounded-none border border-[var(--color-border)] bg-[var(--color-slate)] px-[var(--space-3)] text-[var(--color-text)] transition-all duration-[var(--duration-fast)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-cyan)] focus:ring-2 focus:ring-[var(--color-cyan-subtle)] focus:outline-none"
              />
              <p className="text-[var(--color-faint)] text-[var(--text-xs)]">
                {GEMINI_LIVE_TEXT.configuration.conversationTitle.hint}
              </p>
            </div>

            {/* System Instruction Field */}
            <div className="space-y-[var(--space-2)]">
              <label
                htmlFor="system-instruction"
                className="block font-[family-name:var(--font-display)] font-medium tracking-wide text-[var(--color-text)] text-[var(--text-sm)] uppercase"
              >
                {GEMINI_LIVE_TEXT.configuration.systemPrompt.label}
              </label>
              <textarea
                id="system-instruction"
                value={systemInstruction}
                onChange={e =>
                  setSystemInstruction(
                    e.target.value as typeof systemInstruction
                  )
                }
                placeholder={
                  GEMINI_LIVE_TEXT.configuration.systemPrompt.placeholder
                }
                rows={6}
                maxLength={2000}
                className="min-h-[120px] w-full resize-y rounded-none border border-[var(--color-border)] bg-[var(--color-slate)] px-[var(--space-3)] py-[var(--space-3)] text-[var(--color-text)] transition-all duration-[var(--duration-fast)] placeholder:text-[var(--color-faint)] focus:border-[var(--color-cyan)] focus:ring-2 focus:ring-[var(--color-cyan-subtle)] focus:outline-none"
              />
              <p className="text-[var(--color-faint)] text-[var(--text-xs)]">
                {GEMINI_LIVE_TEXT.configuration.systemPrompt.hint}
              </p>
            </div>

            {/* Voice Selection */}
            <div className="space-y-[var(--space-2)]">
              <Label
                htmlFor="voice"
                className="block font-[family-name:var(--font-display)] font-medium tracking-wide text-[var(--color-text)] text-[var(--text-sm)] uppercase"
              >
                {GEMINI_LIVE_TEXT.configuration.voice.label}
              </Label>
              <Select
                value={voiceName}
                onValueChange={value => setVoiceName(value as VoiceName)}
              >
                <SelectTrigger
                  id="voice"
                  className="h-[var(--input-height)] w-full rounded-none border border-[var(--color-border)] bg-[var(--color-slate)] text-[var(--color-text)] focus:border-[var(--color-cyan)] focus:ring-2 focus:ring-[var(--color-cyan-subtle)]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border border-[var(--color-border)] bg-[var(--color-deep)]">
                  {VOICES.map(voice => (
                    <SelectItem
                      key={voice}
                      value={voice}
                      className="text-[var(--color-text)] focus:bg-[var(--color-slate)] focus:text-[var(--color-text)]"
                    >
                      {GEMINI_LIVE_TEXT.voices[voice]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[var(--color-faint)] text-[var(--text-xs)]">
                {GEMINI_LIVE_TEXT.configuration.voice.hint}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-[var(--space-6)] h-px bg-[var(--color-border)]" />

          {/* Actions */}
          <div className="flex gap-[var(--space-3)]">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={creating}
              className="h-[var(--button-height)] flex-1 rounded-none border border-[var(--color-border)] bg-transparent px-[var(--space-4)] font-medium text-[var(--color-text)] transition-all duration-[var(--duration-fast)] hover:border-[var(--color-cyan)] hover:bg-[var(--color-slate)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {GEMINI_LIVE_TEXT.configuration.actions.cancel}
            </button>
            <button
              type="button"
              onClick={handleCreateConversation}
              disabled={creating || !systemInstruction.trim() || !title.trim()}
              className="h-[var(--button-height)] flex-1 rounded-none bg-[var(--color-cyan)] px-[var(--space-4)] font-medium text-[var(--color-deep)] shadow-[var(--glow-cyan)] transition-all duration-[var(--duration-fast)] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? GEMINI_LIVE_TEXT.configuration.actions.creating
                : GEMINI_LIVE_TEXT.configuration.actions.start}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
