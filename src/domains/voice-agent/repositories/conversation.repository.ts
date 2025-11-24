/**
 * Conversation Repository
 * Handles all IndexedDB operations for conversations
 * Follows Repository Pattern (Critical Constraint #6)
 */

import localforage from 'localforage';
import type {
  Conversation,
  CreateConversationInput,
  UpdateConversationInput,
  ConversationListItem
} from '../types';

// Configure IndexedDB instance for conversations
const conversationStore = localforage.createInstance({
  name: 'voice-agent',
  storeName: 'conversations',
  description: 'Stores Gemini Live conversation configurations and metadata'
});

/**
 * Generate UUID v4
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Create a new conversation with configuration
 */
export async function createConversation(
  input: CreateConversationInput
): Promise<Conversation> {
  const now = new Date();
  const conversation: Conversation = {
    id: generateId(),
    title: input.title,
    systemPrompt: input.systemPrompt,
    config: input.config,
    messages: [],
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    totalDuration: 0,
    isArchived: input.isArchived ?? false
  };

  await conversationStore.setItem(conversation.id, conversation);
  return conversation;
}

/**
 * Get conversation by ID
 */
export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  try {
    const conversation = await conversationStore.getItem<Conversation>(id);
    return conversation;
  } catch (error) {
    console.error('Error getting conversation:', error);
    return null;
  }
}

/**
 * Get all conversations (non-archived by default)
 */
export async function getAllConversations(
  includeArchived = false
): Promise<Conversation[]> {
  const conversations: Conversation[] = [];

  try {
    await conversationStore.iterate<Conversation, void>(value => {
      if (includeArchived || !value.isArchived) {
        conversations.push(value);
      }
    });

    // Sort by most recent first
    return conversations.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  } catch (error) {
    console.error('Error getting all conversations:', error);
    return [];
  }
}

/**
 * Get conversation list items (minimal data for list view)
 */
export async function getConversationList(): Promise<ConversationListItem[]> {
  const conversations = await getAllConversations(false);

  return conversations.map(conv => ({
    id: conv.id,
    title: conv.title,
    messageCount: conv.messageCount,
    lastMessageAt: conv.lastMessageAt,
    voiceName: conv.config.voiceName,
    isArchived: conv.isArchived
  }));
}

/**
 * Update conversation
 */
export async function updateConversation(
  id: string,
  updates: UpdateConversationInput
): Promise<Conversation | null> {
  const conversation = await getConversationById(id);

  if (!conversation) {
    console.error('Conversation not found:', id);
    return null;
  }

  const updated: Conversation = {
    ...conversation,
    ...updates,
    updatedAt: new Date()
  };

  await conversationStore.setItem(id, updated);
  return updated;
}

/**
 * Delete conversation
 */
export async function deleteConversation(id: string): Promise<boolean> {
  try {
    await conversationStore.removeItem(id);
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

/**
 * Archive/unarchive conversation
 */
export async function toggleArchiveConversation(
  id: string
): Promise<Conversation | null> {
  const conversation = await getConversationById(id);

  if (!conversation) {
    return null;
  }

  return updateConversation(id, {
    isArchived: !conversation.isArchived
  });
}

/**
 * Update conversation stats (message count, duration, last message time)
 */
export async function updateConversationStats(
  id: string,
  stats: {
    messageCount?: number;
    totalDuration?: number;
    lastMessageAt?: Date;
  }
): Promise<Conversation | null> {
  return updateConversation(id, stats);
}

/**
 * Clear all conversations (for testing/reset)
 */
export async function clearAllConversations(): Promise<void> {
  await conversationStore.clear();
}
