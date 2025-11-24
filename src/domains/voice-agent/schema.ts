/**
 * Zod schemas for Gemini Live API validation
 */

import { z } from 'zod';

// ============================================================================
// Session Schemas
// ============================================================================

export const sessionMetadataSchema = z.object({
  audioFormat: z.enum(['linear16', 'opus']),
  sampleRate: z.enum(['16000', '24000']),
  language: z.string().length(2), // ISO 639-1
  voiceName: z.string().min(1),
  connectionType: z.literal('websocket'),
  totalTurns: z.number().int().nonnegative().optional(),
  errorCount: z.number().int().nonnegative().optional()
});

export const voiceSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().optional(),
  status: z.enum([
    'idle',
    'connecting',
    'connected',
    'active',
    'paused',
    'ended',
    'error'
  ]),
  startedAt: z.date(),
  endedAt: z.date().optional(),
  duration: z.number().nonnegative(),
  model: z.string().startsWith('gemini-'),
  metadata: sessionMetadataSchema
});

export type VoiceSessionInput = z.infer<typeof voiceSessionSchema>;

// ============================================================================
// WebSocket Config Schema
// ============================================================================

export const webSocketConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  model: z
    .string()
    .startsWith('gemini-', 'Model must be a Gemini model')
    .default('gemini-2.0-flash-exp'),
  baseUrl: z.string().url().optional(),
  headers: z.record(z.string(), z.string()).optional()
});

export type WebSocketConfigInput = z.infer<typeof webSocketConfigSchema>;

// ============================================================================
// Audio Schemas
// ============================================================================

export const audioConfigSchema = z.object({
  sampleRate: z.enum(['16000', '24000']),
  channels: z.literal(1), // mono only
  encoding: z.enum(['linear16', 'opus']),
  chunkSize: z.number().int().min(50).max(500) // 50-500ms
});

export type AudioConfigInput = z.infer<typeof audioConfigSchema>;

export const vadConfigSchema = z.object({
  enabled: z.boolean(),
  speechStartThreshold: z.number().min(-100).max(0), // dB
  speechEndThreshold: z.number().min(-100).max(0), // dB
  silenceDuration: z.number().int().min(100).max(3000) // 100ms - 3s
});

export type VADConfigInput = z.infer<typeof vadConfigSchema>;

export const audioChunkSchema = z.object({
  data: z.instanceof(ArrayBuffer),
  timestamp: z.number().positive(),
  sequenceNumber: z.number().int().nonnegative()
});

// ============================================================================
// Gemini Live API Message Schemas
// ============================================================================

export const geminiSetupMessageSchema = z.object({
  setup: z.object({
    model: z.string(),
    generation_config: z
      .object({
        response_modalities: z.array(z.enum(['AUDIO', 'TEXT'])).optional(),
        speech_config: z
          .object({
            voice_config: z
              .object({
                prebuilt_voice_config: z
                  .object({
                    voice_name: z.string()
                  })
                  .optional()
              })
              .optional()
          })
          .optional()
      })
      .optional()
  })
});

export const geminiAudioInputSchema = z.object({
  realtime_input: z.object({
    media_chunks: z.array(
      z.object({
        mime_type: z.literal('audio/pcm'),
        data: z.string() // base64
      })
    )
  })
});

export const geminiTextInputSchema = z.object({
  client_content: z.object({
    turns: z.array(
      z.object({
        role: z.literal('user'),
        parts: z.array(
          z.object({
            text: z.string()
          })
        )
      })
    ),
    turn_complete: z.boolean()
  })
});

// ============================================================================
// Conversation Schemas
// ============================================================================

export const conversationTurnSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  type: z.enum(['audio', 'text', 'multimodal']),
  content: z.union([z.string(), z.instanceof(ArrayBuffer)]),
  timestamp: z.date(),
  metadata: z
    .object({
      duration: z.number().nonnegative().optional(),
      interrupted: z.boolean().optional(),
      confidence: z.number().min(0).max(1).optional(),
      latency: z.number().nonnegative().optional()
    })
    .optional()
});

export type ConversationTurnInput = z.infer<typeof conversationTurnSchema>;

// ============================================================================
// Error Schema
// ============================================================================

export const voiceAgentErrorSchema = z.object({
  code: z.enum([
    'WEBSOCKET_CONNECTION_FAILED',
    'WEBSOCKET_DISCONNECTED',
    'AUDIO_PERMISSION_DENIED',
    'AUDIO_DEVICE_NOT_FOUND',
    'AUDIO_PROCESSING_ERROR',
    'API_KEY_INVALID',
    'API_QUOTA_EXCEEDED',
    'NETWORK_ERROR',
    'UNKNOWN_ERROR'
  ]),
  message: z.string().min(1),
  details: z.unknown().optional(),
  timestamp: z.date()
});

export type VoiceAgentErrorInput = z.infer<typeof voiceAgentErrorSchema>;

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_AUDIO_CONFIG: AudioConfigInput = {
  sampleRate: '16000',
  channels: 1,
  encoding: 'linear16',
  chunkSize: 100 // 100ms
};

export const DEFAULT_VAD_CONFIG: VADConfigInput = {
  enabled: true,
  speechStartThreshold: -50, // dB
  speechEndThreshold: -55, // dB
  silenceDuration: 500 // ms
};

export const DEFAULT_SESSION_METADATA: z.infer<typeof sessionMetadataSchema> = {
  audioFormat: 'linear16',
  sampleRate: '16000',
  language: 'en',
  voiceName: 'Puck',
  connectionType: 'websocket'
};

// ============================================================================
// Voice Name Schema
// ============================================================================

export const voiceNameSchema = z.enum([
  'Puck',
  'Charon',
  'Kore',
  'Fenrir',
  'Aoede'
]);

export type VoiceNameInput = z.infer<typeof voiceNameSchema>;

// ============================================================================
// Conversation Config Schema
// ============================================================================

export const conversationConfigSchema = z.object({
  voiceName: voiceNameSchema,
  temperature: z.number().min(0).max(2).default(1),
  model: z.string().default('gemini-2.5-flash-native-audio-preview-09-2025'),
  language: z.string().length(2).default('en'),
  audioFormat: z.enum(['linear16', 'opus']).default('linear16'),
  sampleRate: z.enum(['16000', '24000']).default('16000')
});

export type ConversationConfigInput = z.infer<typeof conversationConfigSchema>;

// ============================================================================
// Create Conversation Schema
// ============================================================================

export const createConversationSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(100),
  systemPrompt: z
    .string()
    .min(1, 'La instrucción del sistema es requerida')
    .max(2000),
  config: conversationConfigSchema
});

export type CreateConversationSchemaInput = z.infer<
  typeof createConversationSchema
>;

// ============================================================================
// Default Conversation Config
// ============================================================================

export const DEFAULT_CONVERSATION_CONFIG: ConversationConfigInput = {
  voiceName: 'Puck',
  temperature: 1,
  model: 'gemini-2.5-flash-native-audio-preview-09-2025',
  language: 'en',
  audioFormat: 'linear16',
  sampleRate: '16000'
};
