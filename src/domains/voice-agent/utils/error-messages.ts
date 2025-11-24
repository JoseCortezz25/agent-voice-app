/**
 * Error Message Mapping Utility
 * Maps technical errors to user-friendly generic messages
 */

import type { VoiceAgentError } from '../types';

/**
 * Generic error messages that don't expose technical details
 */
export const GENERIC_ERROR_MESSAGES = {
  CONNECTION_FAILED: 'Unable to connect to voice service. Please try again.',
  SERVICE_UNAVAILABLE:
    'Voice service is temporarily unavailable. Please try again later.',
  QUOTA_EXCEEDED: 'Service limit reached. Please try again later.',
  AUDIO_PERMISSION:
    'Microphone access is required. Please allow microphone permissions in your browser.',
  AUDIO_PLAYBACK_FAILED:
    'Unable to play audio. Please check your audio settings.',
  NETWORK_ERROR:
    'Network connection lost. Please check your internet connection.',
  UNEXPECTED_ERROR: 'Something went wrong. Please try again.',
  SESSION_ERROR: 'Session error occurred. Please reconnect.'
} as const;

/**
 * Maps WebSocket close codes to generic error messages
 */
export function mapWebSocketError(code: number): string {
  // Quota/billing errors
  if (code === 1011) {
    return GENERIC_ERROR_MESSAGES.QUOTA_EXCEEDED;
  }

  // Service errors (1001, 1002, 1003, 1011)
  if (code >= 1001 && code <= 1011) {
    return GENERIC_ERROR_MESSAGES.SERVICE_UNAVAILABLE;
  }

  // Network/connection errors
  if (code === 1006 || code === 1015) {
    return GENERIC_ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Default
  return GENERIC_ERROR_MESSAGES.CONNECTION_FAILED;
}

/**
 * Maps VoiceAgentError codes to generic messages
 */
export function mapVoiceAgentError(error: VoiceAgentError): string {
  switch (error.code) {
    case 'WEBSOCKET_CONNECTION_FAILED':
      return GENERIC_ERROR_MESSAGES.CONNECTION_FAILED;

    case 'WEBSOCKET_DISCONNECTED':
      // Check if it's a close event with code
      if (
        error.details &&
        typeof error.details === 'object' &&
        'code' in error.details
      ) {
        return mapWebSocketError(error.details.code as number);
      }
      return GENERIC_ERROR_MESSAGES.CONNECTION_FAILED;

    case 'WEBSOCKET_ERROR':
      return GENERIC_ERROR_MESSAGES.SERVICE_UNAVAILABLE;

    case 'AUDIO_PERMISSION_DENIED':
      return GENERIC_ERROR_MESSAGES.AUDIO_PERMISSION;

    case 'AUDIO_CAPTURE_FAILED':
      return GENERIC_ERROR_MESSAGES.AUDIO_PERMISSION;

    case 'AUDIO_PLAYBACK_FAILED':
      return GENERIC_ERROR_MESSAGES.AUDIO_PLAYBACK_FAILED;

    case 'INVALID_API_KEY':
      return GENERIC_ERROR_MESSAGES.SERVICE_UNAVAILABLE;

    case 'RATE_LIMIT_EXCEEDED':
      return GENERIC_ERROR_MESSAGES.QUOTA_EXCEEDED;

    case 'SESSION_EXPIRED':
    case 'SESSION_ERROR':
      return GENERIC_ERROR_MESSAGES.SESSION_ERROR;

    default:
      return GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR;
  }
}

/**
 * Maps generic JavaScript/network errors to user-friendly messages
 */
export function mapGenericError(error: unknown): string {
  if (error instanceof DOMException) {
    // Audio/media errors
    if (
      error.name === 'NotAllowedError' ||
      error.name === 'PermissionDeniedError'
    ) {
      return GENERIC_ERROR_MESSAGES.AUDIO_PERMISSION;
    }
    if (error.name === 'NotFoundError') {
      return GENERIC_ERROR_MESSAGES.AUDIO_PERMISSION;
    }
    if (error.name === 'NetworkError') {
      return GENERIC_ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return GENERIC_ERROR_MESSAGES.NETWORK_ERROR;
  }

  return GENERIC_ERROR_MESSAGES.UNEXPECTED_ERROR;
}
