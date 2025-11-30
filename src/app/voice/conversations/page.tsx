'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversationsList } from '@/domains/voice-agent/components/organisms/conversations-list';
import { VoiceHeader } from '@/components/organisms/voice-header';
import { Plus } from 'lucide-react';
import { getAllConversations } from '@/domains/voice-agent/repositories/conversation.repository';

export default function ConversationsPage() {
  return (
    <div className="bg-background min-h-screen">
      <VoiceHeader
        variant="simple"
        backLink={{ href: '/', label: '← Inicio' }}
      />

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <div className="mx-auto max-w-4xl">
          {/* Page Title */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Mis Conversaciones</h1>
            <Button asChild>
              <Link href="/voice/start">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Conversación
              </Link>
            </Button>
          </div>

          {/* Conversations List or Empty State */}
          <ConversationsListWrapper />
        </div>
      </main>
    </div>
  );
}

// Client component wrapper to check for empty state
function ConversationsListWrapper() {
  'use client';

  const { conversations, setConversations } = useConversationStore();
  const [isLoading, setIsLoading] = React.useState(true);

  // Load conversations from IndexedDB on mount
  React.useEffect(() => {
    async function loadConversations() {
      try {
        const allConversations = await getAllConversations();
        setConversations(allConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadConversations();
  }, [setConversations]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Cargando conversaciones...</p>
        </CardContent>
      </Card>
    );
  }

  if (conversations.length === 0) {
    return <EmptyState />;
  }

  return <ConversationsList />;
}

// Empty State Component
function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-center">
          No tienes conversaciones aún
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground mb-6">
          Crea tu primera conversación para comenzar a hablar con tu agente de
          voz personalizado.
        </p>
        <Button asChild size="lg">
          <Link href="/voice/start">
            <Plus className="mr-2 h-5 w-5" />
            Crear primera conversación
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// Import conversation store
import { useConversationStore } from '@/domains/voice-agent/stores/conversation.store';
