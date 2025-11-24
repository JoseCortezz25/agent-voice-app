/**
 * Conversation UI Store
 * Manages UI state for conversations (Zustand for client state only)
 * Data persistence handled by conversation.repository.ts
 */

import { create } from 'zustand';
import type { Conversation } from '../types';

interface ConversationStore {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: string) => void;
  updateConversationInList: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => void;
}

export const useConversationStore = create<ConversationStore>(set => ({
  conversations: [],

  setConversations: (conversations: Conversation[]) => {
    set({ conversations });
  },

  addConversation: (conversation: Conversation) => {
    set(state => ({
      conversations: [conversation, ...state.conversations]
    }));
  },

  removeConversation: (conversationId: string) => {
    set(state => ({
      conversations: state.conversations.filter(
        conv => conv.id !== conversationId
      )
    }));
  },

  updateConversationInList: (
    conversationId: string,
    updates: Partial<Conversation>
  ) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    }));
  }
}));
