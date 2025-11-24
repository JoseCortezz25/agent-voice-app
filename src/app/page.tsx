import { ConversationsList } from '@/domains/voice-agent/components/organisms/conversations-list';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <ConversationsList />
    </main>
  );
}
