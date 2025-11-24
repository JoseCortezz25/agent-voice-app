/**
 * Message Repository
 * Handles all IndexedDB operations for conversation messages
 * Follows Repository Pattern (Critical Constraint #6)
 */

import localforage from 'localforage';
import type { Message, CreateMessageInput } from '../types';

// Configure IndexedDB instance for messages
const messageStore = localforage.createInstance({
  name: 'voice-agent',
  storeName: 'messages',
  description: 'Stores conversation messages and transcripts'
});

/**
 * Generate UUID v4
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate composite key for message storage
 * Format: conversationId:messageId
 */
function getMessageKey(conversationId: string, messageId: string): string {
  return `${conversationId}:${messageId}`;
}

/**
 * Create a new message in a conversation
 */
export async function createMessage(
  input: CreateMessageInput
): Promise<Message> {
  const messageId = generateId();
  const message: Message = {
    id: messageId,
    conversationId: input.conversationId,
    role: input.role,
    type: input.type,
    content: input.content,
    transcript: input.transcript,
    timestamp: new Date(),
    metadata: input.metadata
  };

  const key = getMessageKey(input.conversationId, messageId);
  await messageStore.setItem(key, message);

  return message;
}

/**
 * Get all messages for a conversation
 */
export async function getMessagesByConversationId(
  conversationId: string
): Promise<Message[]> {
  const messages: Message[] = [];
  const prefix = `${conversationId}:`;

  try {
    await messageStore.iterate<Message, void>((value, key) => {
      if (key.startsWith(prefix)) {
        messages.push(value);
      }
    });

    // Sort by timestamp (oldest first)
    return messages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

/**
 * Get a specific message
 */
export async function getMessageById(
  conversationId: string,
  messageId: string
): Promise<Message | null> {
  try {
    const key = getMessageKey(conversationId, messageId);
    const message = await messageStore.getItem<Message>(key);
    return message;
  } catch (error) {
    console.error('Error getting message:', error);
    return null;
  }
}

/**
 * Delete all messages for a conversation
 */
export async function deleteMessagesByConversationId(
  conversationId: string
): Promise<number> {
  const prefix = `${conversationId}:`;
  const keysToDelete: string[] = [];

  // Collect keys to delete
  await messageStore.iterate<Message, void>((_value, key) => {
    if (key.startsWith(prefix)) {
      keysToDelete.push(key);
    }
  });

  // Delete all messages
  for (const key of keysToDelete) {
    await messageStore.removeItem(key);
  }

  return keysToDelete.length;
}

/**
 * Delete a specific message
 */
export async function deleteMessage(
  conversationId: string,
  messageId: string
): Promise<boolean> {
  try {
    const key = getMessageKey(conversationId, messageId);
    await messageStore.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}

/**
 * Get message count for a conversation
 */
export async function getMessageCount(conversationId: string): Promise<number> {
  const messages = await getMessagesByConversationId(conversationId);
  return messages.length;
}

/**
 * Clear all messages (for testing/reset)
 */
export async function clearAllMessages(): Promise<void> {
  await messageStore.clear();
}
