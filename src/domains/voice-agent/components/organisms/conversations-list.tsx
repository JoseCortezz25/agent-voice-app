/**
 * Conversations List Organism
 * Displays list of conversations with delete functionality
 */

'use client';

import { toast } from 'sonner';
import { useConversationStore } from '../../stores/conversation.store';
import { deleteConversation } from '../../repositories/conversation.repository';
import { GEMINI_LIVE_TEXT } from '../../text-maps/gemini-live.text-map';
import type { Conversation } from '../../types';
import { ConversationCard } from '../molecules/conversation-card';

export function ConversationsList() {
  const { conversations, removeConversation } = useConversationStore();

  const handleDelete = async (conversationId: string) => {
    try {
      // Delete from IndexedDB via repository
      const success = await deleteConversation(conversationId);

      if (success) {
        // Update UI state
        removeConversation(conversationId);
        toast.success(GEMINI_LIVE_TEXT.toast.conversationDeleted);
      } else {
        toast.error(GEMINI_LIVE_TEXT.toast.errorDeleting);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error(GEMINI_LIVE_TEXT.toast.errorDeleting);
    }
  };

  if (conversations.length === 0) {
    return null; // Empty state handled by parent page
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation: Conversation) => (
        <ConversationCard
          key={conversation.id}
          conversation={conversation}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
