'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ConversationConfig, VoiceName } from '@/domains/voice-agent/types';
import { useConversationStore } from '@/domains/voice-agent/stores/conversation.store';
import { Loader2 } from 'lucide-react';

export default function NewConversationPage() {
  const router = useRouter();
  const { addConversation } = useConversationStore();
  const [systemPrompt, setSystemPrompt] = useState('');
  const [voiceName, setVoiceName] = useState<VoiceName>('Puck');
  const [title, setTitle] = useState(
    `Conversation ${new Date().toLocaleString()}`
  );
  const [isCreating, setIsCreating] = useState(false);

  const defaultConfig: ConversationConfig = {
    voiceName,
    temperature: 0.5,
    model: 'gemini-2.0-flash-exp',
    language: 'en',
    audioFormat: 'linear16',
    sampleRate: 16000
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    const {
      title: { value: titleValue },
      systemPrompt: { value: systemPromptValue }
    } = event.target as HTMLFormElement & {
      title: { value: string };
      systemPrompt: { value: string };
    };
    const conversationId = crypto.randomUUID();

    addConversation({
      id: conversationId,
      title: titleValue,
      systemPrompt: systemPromptValue,
      config: defaultConfig,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      totalDuration: 0,
      isArchived: false
    });

    setIsCreating(false);
    router.push(`/conversation/${conversationId}`);
  };

  return (
    <div className="container mx-auto flex h-screen max-w-2xl flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">New Conversation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            name="title"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="system-prompt">System Prompt</Label>
          <Textarea
            name="systemPrompt"
            id="system-prompt"
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            placeholder="e.g., You are a helpful assistant for translating languages."
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="voice-name">AI Voice</Label>
          <Select
            onValueChange={(value: VoiceName) => setVoiceName(value)}
            defaultValue={voiceName}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Puck">Puck</SelectItem>
              <SelectItem value="Charon">Charon</SelectItem>
              <SelectItem value="Kore">Kore</SelectItem>
              <SelectItem value="Fenrir">Fenrir</SelectItem>
              <SelectItem value="Aoede">Aoede</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Start Conversation'}
          {isCreating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </div>
  );
}
