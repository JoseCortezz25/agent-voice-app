/**
 * Text Map for Gemini Live Voice Agent
 * Externalizes all user-facing text (Critical Constraint)
 * Language: Spanish
 */

export const GEMINI_LIVE_TEXT = {
  // ============================================================================
  // Landing Page
  // ============================================================================
  landing: {
    title: 'Gemini Live Voice',
    newConversationButton: 'Nueva Conversación',
    emptyState: {
      title: 'No hay conversaciones todavía',
      description: 'Crea tu primera conversación con el asistente de voz',
      createButton: 'Crear Primera Conversación'
    },
    conversationCard: {
      messagesCount: (count: number) =>
        count === 1 ? '1 mensaje' : `${count} mensajes`,
      lastMessage: 'Último mensaje',
      never: 'Nunca',
      deleteConfirm: '¿Eliminar esta conversación?',
      deleteButton: 'Eliminar',
      cancelButton: 'Cancelar'
    }
  },

  // ============================================================================
  // Configuration Form
  // ============================================================================
  configuration: {
    pageTitle: 'Nueva Conversación',
    subtitle: 'Configura tu asistente de voz antes de comenzar',
    systemPrompt: {
      label: 'Instrucción del Sistema',
      placeholder: 'Describe cómo debe comportarse el asistente...',
      hint: 'Define la personalidad y el comportamiento del asistente',
      default:
        'Eres un asistente de voz amigable y útil. Responde de manera concisa y conversacional.'
    },
    voice: {
      label: 'Voz del Asistente',
      hint: 'Selecciona la voz que usará el asistente',
      placeholder: 'Selecciona una voz'
    },
    conversationTitle: {
      label: 'Título de la Conversación',
      placeholder: 'Mi conversación con Gemini',
      hint: 'Un nombre descriptivo para identificar esta conversación'
    },
    actions: {
      cancel: 'Cancelar',
      start: 'Iniciar Conversación',
      creating: 'Creando...'
    },
    validation: {
      systemPromptRequired: 'La instrucción del sistema es requerida',
      titleRequired: 'El título es requerido',
      voiceRequired: 'Debes seleccionar una voz'
    }
  },

  // ============================================================================
  // Active Session
  // ============================================================================
  session: {
    title: 'Conversación en Vivo',
    back: 'Volver',
    controls: {
      mute: 'Silenciar Micrófono',
      unmute: 'Activar Micrófono',
      disconnect: 'Cerrar Sesión',
      connect: 'Conectar'
    },
    status: {
      disconnected: 'Desconectado',
      connecting: 'Conectando...',
      connected: 'Conectado',
      error: 'Error de conexión'
    },
    transcript: {
      title: 'Transcripción en Vivo',
      you: 'Tú',
      ai: 'IA',
      noTranscript: 'Comienza a hablar para ver la transcripción'
    },
    history: {
      title: 'Historial de Conversación',
      empty: 'No hay mensajes todavía',
      loading: 'Cargando historial...'
    },
    loading: {
      initializing: 'Inicializando asistente de voz...',
      connecting: 'Conectando al asistente de voz...',
      loadingConfig: 'Cargando configuración...'
    },
    errors: {
      connectionFailed:
        'No se pudo conectar. Verifica tu API key e intenta nuevamente.',
      configNotFound: 'No se encontró la configuración de la conversación',
      microphonePermissionDenied:
        'Se requiere permiso para acceder al micrófono',
      audioError: 'Error al procesar el audio',
      networkError: 'Error de red. Verifica tu conexión.'
    }
  },

  // ============================================================================
  // Connection Status
  // ============================================================================
  connectionStatus: {
    disconnected: 'Desconectado',
    connecting: 'Conectando',
    connected: 'Conectado',
    error: 'Error'
  },

  // ============================================================================
  // Toast Notifications
  // ============================================================================
  toast: {
    conversationCreated: 'Conversación creada exitosamente',
    conversationDeleted: 'Conversación eliminada',
    conversationUpdated: 'Conversación actualizada',
    errorCreating: 'Error al crear la conversación',
    errorDeleting: 'Error al eliminar la conversación',
    errorLoading: 'Error al cargar la conversación',
    errorConnecting: 'Error al conectar con el asistente',
    microphoneBlocked:
      'Micrófono bloqueado. Por favor, permite el acceso al micrófono.',
    copied: 'Copiado al portapapeles'
  },

  // ============================================================================
  // Voice Names (Display)
  // ============================================================================
  voices: {
    Puck: 'Puck',
    Charon: 'Charon',
    Kore: 'Kore',
    Fenrir: 'Fenrir',
    Aoede: 'Aoede'
  },

  // ============================================================================
  // Common
  // ============================================================================
  common: {
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    confirm: 'Confirmar',
    back: 'Volver'
  }
} as const;

/**
 * Type-safe text accessor
 */
export type GeminiLiveTextKey = typeof GEMINI_LIVE_TEXT;
