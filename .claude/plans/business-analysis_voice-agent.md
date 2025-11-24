# Business Analysis: Voice Agent Platform

**Project Name**: Voice Agent Platform
**Version**: 1.0
**Last Updated**: 2025-11-18
**Document Owner**: Business Analyst Agent
**Status**: Draft - Ready for Review

---

## Executive Summary

The Voice Agent Platform is a real-time conversational AI application that enables natural voice and text interactions through two distinct integration approaches: White Library (chat-based voice messaging) and Gemini Live API (real-time voice streaming). This platform addresses the need for flexible, high-quality voice AI interactions suitable for different use cases ranging from asynchronous voice messaging to low-latency real-time conversations.

**Key Value Propositions**:
- Dual integration approach provides flexibility for different latency and complexity requirements
- White Library offers turnkey chat-based voice messaging with pre-built UI components
- Gemini Live API enables custom real-time voice streaming with sub-second latency
- Unified platform architecture supports both approaches with shared session management

**Target Users**: Developers and product teams building voice-enabled AI applications requiring either chat-based voice messaging or real-time conversational experiences.

---

## 1. Problem Statement

### Current Situation

Organizations and developers seeking to integrate voice AI capabilities face several challenges:

1. **Complexity Trade-offs**: Existing solutions force a choice between ease of implementation and performance/customization
2. **Integration Lock-in**: Most platforms provide only one interaction model (chat-based OR real-time)
3. **Audio Processing Complexity**: Handling audio capture, encoding, streaming, and playback requires significant technical expertise
4. **Latency Requirements Vary**: Different use cases require different latency profiles, but current solutions don't support both
5. **Developer Experience**: Steep learning curve for implementing real-time voice streaming from scratch

### Desired Outcome

A unified platform that:
- Provides TWO integration approaches for different use cases
- Abstracts away audio processing complexity where desired
- Offers flexibility to customize when needed
- Maintains high audio quality and low latency
- Simplifies developer experience with clear documentation and patterns

### Value Proposition

**For Product Teams**:
- Start quickly with White Library integration, migrate to real-time when needed
- Single platform investment supporting multiple use cases
- Reduced development time and complexity

**For Developers**:
- Clear architecture supporting both turnkey and custom implementations
- Reusable domain-driven components
- Comprehensive business rules and validation
- Testing and monitoring built-in

**For End Users**:
- High-quality voice interactions with minimal latency
- Reliable session management
- Consistent experience across integration types

---

## 2. Stakeholders

### Primary Users

#### Developer (Integration Consumer)

**Goals**:
- Integrate voice AI capabilities into their application quickly
- Choose the right integration approach for their use case
- Customize UI and behavior as needed
- Monitor performance and debug issues

**Pain Points**:
- Unclear which integration approach to use
- Complex audio processing requirements
- Difficulty debugging real-time connections
- Limited documentation on best practices

**Needs**:
- Clear comparison between White Library and Gemini Live approaches
- Sample implementations and starter code
- Performance monitoring and analytics
- Comprehensive error handling

**Technical Level**: Intermediate to Advanced (TypeScript, React, WebSocket, audio processing basics)

---

#### Product Manager

**Goals**:
- Understand capabilities and limitations of each integration
- Make informed decisions about which approach to use
- Track user engagement and session quality
- Plan feature roadmap

**Pain Points**:
- Unclear ROI on real-time vs chat-based approaches
- Limited visibility into session quality metrics
- Difficulty prioritizing features

**Needs**:
- Business case for each integration type
- Analytics dashboard showing session metrics
- Roadmap visibility for upcoming features

**Technical Level**: Beginner (non-technical, needs business-focused documentation)

---

### Secondary Users

#### End User (Voice Session Participant)

**Goals**:
- Have natural conversations with AI agent
- Get quick responses with minimal latency
- Understand when the system is listening/processing
- Access conversation history

**Needs**:
- Clear visual feedback during voice interactions
- Ability to interrupt AI when needed
- Conversation history and playback
- Mobile-friendly interface

---

#### System Administrator

**Goals**:
- Monitor platform health and performance
- Manage API keys and security
- Track usage and costs
- Troubleshoot issues

**Needs**:
- Real-time monitoring dashboard
- Error logs and debugging tools
- Usage analytics and cost tracking
- Security audit trail

---

### Decision Makers

**Role**: Technical Lead / CTO

**Success Criteria**:
- Platform architecture follows best practices (domain-driven, testable)
- Both integrations are production-ready
- Performance meets latency requirements (< 1000ms end-to-end)
- Security requirements are met (encrypted connections, secure API key management)
- Code quality is maintainable and well-documented

---

## 3. Scope

### In Scope

#### White Library Integration (Chat-Based Voice)
- MediaRecorder API audio capture (OGG format)
- HTTP webhook communication
- Pre-built UI components (ChatPage, ChatInput, ChatMessage)
- Session management (2-hour expiration)
- Text and audio message support
- Message history and playback
- Response field rendering (multi-field responses)
- Special notification flow (Informe field)

#### Gemini Live API Integration (Real-Time Voice)
- WebSocket bidirectional streaming
- Web Audio API low-latency audio processing
- PCM/Opus audio formats (16kHz or 24kHz)
- Voice Activity Detection (VAD)
- Real-time playback with streaming
- User interruption support
- Connection management with reconnection logic

#### Shared Features
- Session management and analytics
- Conversation history storage
- User authentication and authorization
- Error handling and logging
- Performance monitoring
- Security (encrypted connections, API key management)

### Out of Scope

#### Version 1.0 Exclusions
- Multi-modal inputs beyond voice and text (no vision/video)
- Voice cloning or custom voice training
- Real-time translation between languages
- Group conversations (multi-user sessions)
- Voice synthesis customization beyond Gemini API options
- On-premise deployment (cloud-only initially)

#### Future Considerations (Post-MVP)
- Additional integration libraries (LiveKit, Pipecat)
- Advanced audio preprocessing (noise reduction, echo cancellation beyond browser capabilities)
- Voice biometrics and speaker identification
- Custom wake word detection
- Conversation summarization and insights

### Assumptions

1. Users have modern browsers supporting MediaRecorder and Web Audio APIs
2. Gemini API will maintain backward compatibility for Live API protocol
3. Network latency will be reasonable (< 200ms RTT)
4. Users will grant microphone permissions when required
5. White Library npm package will remain available and maintained
6. API keys will be managed securely by the integrating application

### Dependencies

**External Dependencies**:
- White Library npm package (for chat-based integration)
- Google Gemini 2.0 Live API (for real-time integration)
- MediaRecorder API (browser support)
- Web Audio API (browser support)
- WebSocket support (browser and server)

**Internal Dependencies**:
- Authentication system (for user sessions)
- Database (for conversation history)
- Monitoring infrastructure (for analytics)

---

## 4. User Stories and Features

### Epic 1: White Library Chat-Based Voice Integration

**Priority**: P0 (Critical for MVP)

---

#### US-WL-1: Initialize White Library Chat Session

**As a** developer
**I want to** configure and initialize a White Library chat session
**So that** users can start chat-based voice conversations

**Acceptance Criteria**:
- [ ] ChatConfig is properly configured with agentUrl webhook endpoint
- [ ] Session ID is generated automatically by White Library
- [ ] Session expiration (2h default) is documented and configurable
- [ ] ChatPage component renders successfully
- [ ] Initial connection status is displayed to user

**Priority**: P0
**Estimated Effort**: Small

---

#### US-WL-2: Send Text Messages via White Library

**As a** user
**I want to** send text messages in the chat interface
**So that** I can communicate with the AI agent via text

**Acceptance Criteria**:
- [ ] Text input field is available and functional
- [ ] Message is sent as POST JSON with correct format: `{ message: string, sessionId: string, type: 'text' }`
- [ ] Loading state is shown while waiting for response
- [ ] Response is displayed in chat interface
- [ ] Message character limit is enforced (maxMessageLength config)

**Priority**: P0
**Estimated Effort**: Small

---

#### US-WL-3: Record and Send Audio Messages via White Library

**As a** user
**I want to** record and send voice messages
**So that** I can communicate naturally with the AI agent

**Acceptance Criteria**:
- [ ] Record button is visible and accessible
- [ ] Recording starts when button is pressed
- [ ] Visual feedback shows recording is in progress (config.texts.recordingText)
- [ ] Recording time limit is enforced (config.behavior.recordingTimeLimit)
- [ ] User can cancel recording before sending
- [ ] Audio is captured as OGG format (MediaRecorder default)
- [ ] Audio is sent as multipart/form-data: `{ audio: Blob, sessionId: string, type: 'audio' }`
- [ ] Sending state is displayed

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-WL-4: Receive and Display AI Responses

**As a** user
**I want to** see AI responses in the chat interface
**So that** I can understand the AI's answers

**Acceptance Criteria**:
- [ ] Backend responses with multiple fields are rendered as separate messages
- [ ] Text responses are displayed with proper formatting
- [ ] Audio responses include playback controls (play/pause)
- [ ] Special "Informe" field triggers notification flow
- [ ] Message timestamps are shown
- [ ] Messages are properly attributed (user vs assistant)

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-WL-5: Play Audio Responses

**As a** user
**I want to** play audio responses from the AI
**So that** I can hear the AI's voice replies

**Acceptance Criteria**:
- [ ] Audio player is integrated with each audio message
- [ ] Play button is visible and functional
- [ ] Pause button works during playback
- [ ] Playback progress is shown
- [ ] Volume control is available
- [ ] Audio plays through White Library's built-in player

**Priority**: P0
**Estimated Effort**: Small

---

#### US-WL-6: View Message History

**As a** user
**I want to** see my conversation history
**So that** I can review previous messages

**Acceptance Criteria**:
- [ ] All messages in the session are visible in chronological order
- [ ] Scroll functionality works for long conversations
- [ ] New messages are auto-scrolled into view
- [ ] Message history persists during the session (2h)
- [ ] Historical audio messages can be replayed

**Priority**: P1
**Estimated Effort**: Small

---

### Epic 2: Gemini Live API Real-Time Voice Integration

**Priority**: P0 (Critical for MVP)

---

#### US-GL-1: Establish WebSocket Connection to Gemini Live API

**As a** developer
**I want to** establish a WebSocket connection to Gemini Live API
**So that** real-time bidirectional audio streaming is possible

**Acceptance Criteria**:
- [ ] WebSocket connection is created using secure protocol (WSS)
- [ ] API key is included in connection headers
- [ ] Connection state is tracked: disconnected → connecting → connected → ready
- [ ] Setup message is sent with model configuration
- [ ] Connection success/failure is logged
- [ ] Error handling is implemented for connection failures

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-GL-2: Configure Gemini Live Session

**As a** developer
**I want to** configure the Gemini Live session parameters
**So that** audio format and model settings match my requirements

**Acceptance Criteria**:
- [ ] Model can be specified (e.g., "gemini-2.0-flash-exp")
- [ ] Audio format can be configured (Linear16 PCM or Opus)
- [ ] Sample rate can be set (16kHz or 24kHz)
- [ ] Voice can be selected (e.g., "Puck")
- [ ] Response modalities can be specified (AUDIO)
- [ ] Configuration is sent in setup message

**Priority**: P0
**Estimated Effort**: Small

---

#### US-GL-3: Capture and Stream User Audio in Real-Time

**As a** user
**I want to** speak naturally and have my audio streamed in real-time
**So that** the AI can respond with minimal latency

**Acceptance Criteria**:
- [ ] Microphone permission is requested and handled
- [ ] Audio is captured using Web Audio API
- [ ] Audio is captured at correct sample rate (16kHz or 24kHz)
- [ ] Audio is converted to required format (PCM or Opus)
- [ ] Audio chunks are 100-200ms in size
- [ ] Audio is base64-encoded for WebSocket transmission
- [ ] Audio streaming starts when user begins speaking (VAD detection)
- [ ] Visual indicator shows when audio is being captured

**Priority**: P0
**Estimated Effort**: Large

---

#### US-GL-4: Implement Voice Activity Detection (VAD)

**As a** user
**I want to** have my speech automatically detected
**So that** I don't need to manually trigger recording

**Acceptance Criteria**:
- [ ] VAD detects speech start within 100ms
- [ ] VAD detects speech end after 500ms of silence
- [ ] Background noise does not trigger false positives
- [ ] VAD configuration is adjustable (thresholds)
- [ ] Visual feedback shows when speech is detected
- [ ] VAD can be disabled for continuous streaming mode

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-GL-5: Receive and Play Streaming Audio Responses

**As a** user
**I want to** hear AI responses immediately as they are generated
**So that** the conversation feels natural and responsive

**Acceptance Criteria**:
- [ ] Audio playback starts within 200ms of receiving first chunk
- [ ] Audio is decoded from base64
- [ ] Audio buffer maintains 100-300ms to prevent stuttering
- [ ] Playback continues smoothly as new chunks arrive
- [ ] Playback handles interruptions gracefully
- [ ] Audio quality is high (no artifacts or distortion)

**Priority**: P0
**Estimated Effort**: Large

---

#### US-GL-6: Interrupt AI During Response

**As a** user
**I want to** interrupt the AI while it's speaking
**So that** I can ask follow-up questions naturally

**Acceptance Criteria**:
- [ ] User audio input is detected during AI playback
- [ ] Interruption message is sent to server
- [ ] AI audio playback stops immediately (< 100ms)
- [ ] Audio buffer is cleared
- [ ] New user audio starts streaming
- [ ] Conversation context is maintained

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-GL-7: Handle WebSocket Reconnection

**As a** developer
**I want to** handle connection failures gracefully
**So that** users can continue their conversation after temporary disconnections

**Acceptance Criteria**:
- [ ] Connection failures trigger automatic reconnection
- [ ] Maximum of 3 reconnection attempts
- [ ] Reconnection backoff strategy is implemented (1s, 2s, 4s)
- [ ] User is notified of connection status
- [ ] Session context is restored after reconnection
- [ ] Audio streaming resumes after reconnection

**Priority**: P0
**Estimated Effort**: Medium

---

#### US-GL-8: Monitor Real-Time Performance

**As a** developer
**I want to** monitor latency and audio quality metrics
**So that** I can ensure the real-time experience meets requirements

**Acceptance Criteria**:
- [ ] End-to-end latency is measured (user speech → AI response start)
- [ ] Average latency is < 1000ms (target: 500ms)
- [ ] Audio playback latency is measured (< 200ms target)
- [ ] Packet loss is tracked
- [ ] Quality degradation alerts are triggered when packet loss > 5%
- [ ] Metrics are logged for analytics

**Priority**: P1
**Estimated Effort**: Medium

---

### Epic 3: Session Management (Shared)

**Priority**: P0 (Critical for MVP)

---

#### US-SM-1: Create Voice Session

**As a** authenticated user
**I want to** start a new voice session
**So that** I can begin a conversation with the AI agent

**Acceptance Criteria**:
- [ ] User authentication is verified before session creation
- [ ] Unique session ID is generated (UUID)
- [ ] Session is associated with the authenticated user
- [ ] Maximum of 1 active session per user is enforced
- [ ] Session metadata is stored (type, start time, config)
- [ ] Session status is set to "connecting"

**Priority**: P0
**Estimated Effort**: Small

---

#### US-SM-2: Track Session Duration and Activity

**As a** system
**I want to** track session duration and activity
**So that** inactive sessions can be terminated and analytics can be recorded

**Acceptance Criteria**:
- [ ] Session start time is recorded
- [ ] Session duration is calculated continuously
- [ ] Last activity timestamp is updated on each interaction
- [ ] Sessions inactive for 5 minutes are automatically ended
- [ ] Maximum session duration is 60 minutes
- [ ] Duration warnings are shown at 50 minutes

**Priority**: P0
**Estimated Effort**: Small

---

#### US-SM-3: End Voice Session

**As a** user
**I want to** end my voice session
**So that** I can complete the conversation cleanly

**Acceptance Criteria**:
- [ ] End session button is available
- [ ] WebSocket connection is closed gracefully
- [ ] Audio capture is stopped
- [ ] Session end time is recorded
- [ ] Session status is set to "ended"
- [ ] Final analytics are calculated and stored
- [ ] User is shown session summary (duration, turn count)

**Priority**: P0
**Estimated Effort**: Small

---

#### US-SM-4: Store Conversation History

**As a** user
**I want to** access my conversation history
**So that** I can review past interactions

**Acceptance Criteria**:
- [ ] All conversation turns are stored (user and assistant)
- [ ] Text content is stored as-is
- [ ] Audio references are stored (not full audio files for MVP)
- [ ] Timestamps are recorded for each turn
- [ ] Metadata is stored (confidence, duration, interrupted flag)
- [ ] History is retained for at least 30 days
- [ ] Users can only access their own history

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-SM-5: View Session Analytics

**As a** user or developer
**I want to** see analytics for my sessions
**So that** I can understand usage patterns and performance

**Acceptance Criteria**:
- [ ] Total session duration is displayed
- [ ] Number of conversation turns is shown
- [ ] Average response latency is calculated
- [ ] Error count is tracked
- [ ] Interruption count is shown
- [ ] Quality score is calculated (if available)
- [ ] Analytics are exportable (JSON format)

**Priority**: P2
**Estimated Effort**: Medium

---

### Epic 4: Error Handling and Reliability

**Priority**: P0 (Critical for MVP)

---

#### US-EH-1: Handle Microphone Permission Denial

**As a** user
**I want to** receive clear instructions when microphone access is denied
**So that** I know how to enable it

**Acceptance Criteria**:
- [ ] Permission request is triggered on session start
- [ ] Denial is detected and handled gracefully
- [ ] User-friendly error message is displayed
- [ ] Instructions for enabling permissions are shown (browser-specific)
- [ ] User can retry permission request
- [ ] Session is not started without microphone access

**Priority**: P0
**Estimated Effort**: Small

---

#### US-EH-2: Handle Network Latency Issues

**As a** user
**I want to** be notified when network latency is degrading the experience
**So that** I understand the cause of delays

**Acceptance Criteria**:
- [ ] Network latency is monitored continuously
- [ ] Latency > 500ms triggers a notification
- [ ] Notification is shown in the UI (non-blocking)
- [ ] Latency metrics are logged
- [ ] User can choose to continue or end session

**Priority**: P1
**Estimated Effort**: Small

---

#### US-EH-3: Handle API Quota Exceeded Errors

**As a** user
**I want to** receive a clear message when API quota is exceeded
**So that** I understand why the service is unavailable

**Acceptance Criteria**:
- [ ] API quota errors are detected from server response
- [ ] User-friendly error message is displayed
- [ ] Session is ended gracefully
- [ ] Error is logged with user context
- [ ] Admin notification is sent for quota issues
- [ ] Retry guidance is provided (e.g., "Try again in 1 hour")

**Priority**: P0
**Estimated Effort**: Small

---

#### US-EH-4: Handle Audio Processing Errors

**As a** user
**I want to** continue my session even if temporary audio errors occur
**So that** the entire session doesn't crash

**Acceptance Criteria**:
- [ ] Audio encoding errors are caught and logged
- [ ] Audio decoding errors are caught and logged
- [ ] Individual audio chunk failures don't crash the session
- [ ] User is notified of audio issues
- [ ] System attempts to recover from temporary errors
- [ ] Persistent errors trigger session end with explanation

**Priority**: P0
**Estimated Effort**: Medium

---

### Epic 5: Security and Privacy

**Priority**: P0 (Critical for MVP)

---

#### US-SP-1: Secure API Key Management

**As a** developer
**I want to** API keys to be stored securely
**So that** unauthorized access is prevented

**Acceptance Criteria**:
- [ ] API keys are never exposed in client-side code
- [ ] API keys are stored in environment variables
- [ ] API keys are passed through secure backend proxy
- [ ] Key rotation is supported
- [ ] Access logs track API key usage
- [ ] Invalid keys are rejected with clear errors

**Priority**: P0
**Estimated Effort**: Small

---

#### US-SP-2: Encrypt All Communications

**As a** user
**I want to** all my voice data to be encrypted in transit
**So that** my conversations are private

**Acceptance Criteria**:
- [ ] All HTTP requests use HTTPS
- [ ] All WebSocket connections use WSS (secure WebSocket)
- [ ] Audio data is encrypted in transit
- [ ] Session tokens are encrypted
- [ ] TLS 1.2+ is enforced

**Priority**: P0
**Estimated Effort**: Small

---

#### US-SP-3: Protect User Data at Rest

**As a** user
**I want to** my conversation history to be encrypted at rest
**So that** my data is secure even if the database is compromised

**Acceptance Criteria**:
- [ ] Conversation history is encrypted in the database
- [ ] Encryption keys are managed separately from data
- [ ] User data is isolated by user ID
- [ ] Data deletion requests are honored (GDPR compliance)
- [ ] Audit trail tracks all data access

**Priority**: P1
**Estimated Effort**: Medium

---

#### US-SP-4: Implement Session Token Expiration

**As a** system
**I want to** session tokens to expire after 24 hours
**So that** security risks from stolen tokens are minimized

**Acceptance Criteria**:
- [ ] Session tokens are generated with 24-hour expiration
- [ ] Expired tokens are rejected
- [ ] User is prompted to re-authenticate when token expires
- [ ] Token refresh is supported for active sessions
- [ ] Token validation occurs on every protected request

**Priority**: P0
**Estimated Effort**: Small

---

## 5. Functional Requirements

### FR-1: White Library Integration

**Priority**: P0

---

#### FR-1.1: Chat Configuration

**Requirement**: System SHALL support White Library ChatConfig initialization

**Acceptance Criteria**:
- [ ] `agentUrl` webhook endpoint is configurable
- [ ] Session management uses White Library's built-in sessionId
- [ ] Default 2-hour session expiration is documented
- [ ] Custom session timeout is configurable
- [ ] ChatConfig supports all White Library configuration options

**Dependencies**: White Library npm package

---

#### FR-1.2: Text Message Handling

**Requirement**: System SHALL send and receive text messages via HTTP webhook

**Acceptance Criteria**:
- [ ] Text messages sent as POST JSON: `{ message: string, sessionId: string, type: 'text' }`
- [ ] Response format is validated
- [ ] Maximum message length is enforced (configurable)
- [ ] Message history is maintained in UI
- [ ] Error responses are handled gracefully

**Dependencies**: Backend webhook endpoint, White Library

---

#### FR-1.3: Audio Message Recording (White Library)

**Requirement**: System SHALL record audio using MediaRecorder API via White Library

**Acceptance Criteria**:
- [ ] MediaRecorder captures audio in OGG format
- [ ] Recording time limit is enforced (configurable)
- [ ] Visual feedback shows recording state
- [ ] User can cancel recording
- [ ] Audio quality is configurable (bitrate)

**Dependencies**: Browser MediaRecorder API support, White Library

---

#### FR-1.4: Audio Message Transmission

**Requirement**: System SHALL send audio as multipart/form-data to webhook

**Acceptance Criteria**:
- [ ] Audio sent as `multipart/form-data` with fields: `{ audio: Blob, sessionId: string, type: 'audio' }`
- [ ] File size limits are enforced
- [ ] Upload progress is shown
- [ ] Network errors are handled with retry logic
- [ ] Server response is validated

**Dependencies**: Backend webhook endpoint

---

#### FR-1.5: Multi-Field Response Rendering

**Requirement**: System SHALL render backend responses with multiple fields as separate messages

**Acceptance Criteria**:
- [ ] Each response field is rendered as a separate ChatMessage
- [ ] Field order is preserved
- [ ] Special "Informe" field triggers notification flow
- [ ] Empty fields are skipped
- [ ] Response parsing errors are logged

---

#### FR-1.6: Audio Playback (White Library)

**Requirement**: System SHALL play audio responses using White Library's built-in player

**Acceptance Criteria**:
- [ ] Audio player shows play/pause controls
- [ ] Playback progress is visualized
- [ ] Volume control is available
- [ ] Multiple audio messages can be queued
- [ ] Playback errors are handled gracefully

**Dependencies**: Browser audio playback support

---

### FR-2: Gemini Live API Integration

**Priority**: P0

---

#### FR-2.1: WebSocket Connection Management

**Requirement**: System SHALL manage WebSocket connections to Gemini Live API

**Acceptance Criteria**:
- [ ] Connection state machine is implemented: disconnected → connecting → connected → ready
- [ ] Secure WebSocket (WSS) is used
- [ ] API key is included in headers
- [ ] Ping/pong heartbeat is sent every 30 seconds
- [ ] Connection timeout is handled (30s max)

**Dependencies**: Gemini Live API endpoint

---

#### FR-2.2: Gemini Protocol Implementation

**Requirement**: System SHALL implement Gemini Live API protocol

**Acceptance Criteria**:
- [ ] Setup message includes model configuration
- [ ] Message format matches Gemini protocol specification
- [ ] Audio data is base64-encoded for transmission
- [ ] Server messages are parsed correctly
- [ ] Protocol version compatibility is checked

**Dependencies**: Gemini Live API documentation

---

#### FR-2.3: Real-Time Audio Capture

**Requirement**: System SHALL capture and stream audio in real-time using Web Audio API

**Acceptance Criteria**:
- [ ] Audio captured at required sample rate (16kHz or 24kHz)
- [ ] Audio format is PCM Linear16 or Opus
- [ ] Audio chunks are 100-200ms in size
- [ ] Mono channel audio is enforced
- [ ] Audio processing uses Web Workers to avoid UI blocking

**Dependencies**: Browser Web Audio API support

---

#### FR-2.4: Voice Activity Detection

**Requirement**: System SHALL detect voice activity to optimize streaming

**Acceptance Criteria**:
- [ ] Speech start is detected within 100ms
- [ ] Speech end is detected after 500ms of silence
- [ ] Noise threshold is configurable
- [ ] VAD can be enabled/disabled
- [ ] VAD state is communicated to user via UI

---

#### FR-2.5: Streaming Audio Playback

**Requirement**: System SHALL play streaming audio responses with minimal latency

**Acceptance Criteria**:
- [ ] Playback starts within 200ms of first chunk
- [ ] Audio buffer maintains 100-300ms of audio
- [ ] Base64-encoded audio is decoded correctly
- [ ] Audio playback is smooth without stuttering
- [ ] Buffer underrun is handled gracefully

**Dependencies**: Browser Web Audio API support

---

#### FR-2.6: User Interruption Handling

**Requirement**: System SHALL support user interruption of AI audio

**Acceptance Criteria**:
- [ ] User audio input during AI playback triggers interruption
- [ ] Interruption message is sent to server
- [ ] AI audio stops within 100ms
- [ ] Audio buffer is cleared immediately
- [ ] User audio streaming resumes
- [ ] Conversation context is preserved

---

#### FR-2.7: Connection Resilience

**Requirement**: System SHALL handle connection failures with automatic reconnection

**Acceptance Criteria**:
- [ ] Maximum 3 reconnection attempts
- [ ] Exponential backoff strategy (1s, 2s, 4s)
- [ ] User is notified of connection status
- [ ] Session context is restored after reconnection
- [ ] Persistent failures trigger session end

---

### FR-3: Session Management (Shared)

**Priority**: P0

---

#### FR-3.1: Session Lifecycle Management

**Requirement**: System SHALL manage session lifecycle from creation to termination

**Acceptance Criteria**:
- [ ] Users must be authenticated to create sessions
- [ ] Maximum 1 active session per user
- [ ] Session ID is unique (UUID)
- [ ] Session metadata is stored (type, config, timestamps)
- [ ] Session status transitions are tracked

**Dependencies**: Authentication system

---

#### FR-3.2: Session Timeout Handling

**Requirement**: System SHALL automatically end inactive sessions

**Acceptance Criteria**:
- [ ] Sessions inactive for 5 minutes are ended automatically
- [ ] Maximum session duration is 60 minutes
- [ ] Warnings are shown at 50 minutes
- [ ] Timeout values are configurable
- [ ] User can extend session before timeout

---

#### FR-3.3: Conversation History Storage

**Requirement**: System SHALL store conversation turns for at least 30 days

**Acceptance Criteria**:
- [ ] All conversation turns are stored with timestamps
- [ ] User and assistant roles are distinguished
- [ ] Audio content is referenced (not stored inline)
- [ ] Metadata includes confidence, duration, interrupted flag
- [ ] Users can only access their own history
- [ ] History retention period is configurable

**Dependencies**: Database

---

#### FR-3.4: Analytics Collection

**Requirement**: System SHALL collect session analytics

**Acceptance Criteria**:
- [ ] Session duration is calculated
- [ ] Turn count is tracked
- [ ] Average latency is calculated
- [ ] Error count is logged
- [ ] Interruption count is tracked
- [ ] Quality score is computed when possible

**Dependencies**: Monitoring infrastructure

---

### FR-4: Audio Processing (Shared)

**Priority**: P0

---

#### FR-4.1: Audio Format Support

**Requirement**: System SHALL support multiple audio formats

**Acceptance Criteria**:
- [ ] OGG format for White Library (MediaRecorder output)
- [ ] Linear16 PCM for Gemini Live API
- [ ] Opus format for Gemini Live API
- [ ] Sample rates: 16kHz and 24kHz
- [ ] Mono channel audio only

**Dependencies**: Browser audio codec support

---

#### FR-4.2: Audio Quality Configuration

**Requirement**: System SHALL allow audio quality configuration

**Acceptance Criteria**:
- [ ] Sample rate is selectable (16kHz, 24kHz)
- [ ] Bitrate is configurable for OGG format
- [ ] Encoding quality is adjustable
- [ ] Configuration is persisted per integration type
- [ ] Quality presets are available (low, medium, high)

---

#### FR-4.3: Volume Control

**Requirement**: System SHALL provide volume control for audio playback

**Acceptance Criteria**:
- [ ] Volume range is 0-100%
- [ ] Volume setting is persisted across sessions
- [ ] Mute toggle is available
- [ ] Volume changes take effect immediately
- [ ] Visual volume indicator is displayed

---

### FR-5: Error Handling (Shared)

**Priority**: P0

---

#### FR-5.1: Permission Error Handling

**Requirement**: System SHALL handle microphone permission errors gracefully

**Acceptance Criteria**:
- [ ] Permission denial is detected
- [ ] User-friendly error message is shown
- [ ] Browser-specific instructions are provided
- [ ] User can retry permission request
- [ ] Permission state is monitored continuously

---

#### FR-5.2: Network Error Handling

**Requirement**: System SHALL handle network errors with user feedback

**Acceptance Criteria**:
- [ ] Connection failures are detected
- [ ] User is notified with clear message
- [ ] Automatic retry logic is implemented
- [ ] Manual retry option is available
- [ ] Error details are logged

---

#### FR-5.3: API Error Handling

**Requirement**: System SHALL handle API-specific errors

**Acceptance Criteria**:
- [ ] API quota errors are detected and reported
- [ ] Invalid API key errors are handled
- [ ] Rate limiting is detected and communicated
- [ ] Server errors trigger appropriate actions
- [ ] Error codes are mapped to user-friendly messages

---

## 6. Non-Functional Requirements

### NFR-1: Performance

**Priority**: P0

---

#### NFR-1.1: Latency Requirements

**Requirement**: End-to-end latency SHALL be < 1000ms (target: 500ms)

**Measurement**: Time from user speech end to AI response audio start

**Acceptance Criteria**:
- [ ] 95th percentile latency < 1000ms
- [ ] 50th percentile latency < 500ms (target)
- [ ] Latency is measured and logged for all sessions
- [ ] Performance dashboard shows latency trends

---

#### NFR-1.2: Audio Playback Latency

**Requirement**: Audio playback SHALL start within 200ms of receiving first chunk

**Measurement**: Time from first audio chunk received to audio playback start

**Acceptance Criteria**:
- [ ] 99th percentile < 200ms
- [ ] Buffer size is optimized for minimal latency
- [ ] Latency is monitored per session

---

#### NFR-1.3: UI Responsiveness

**Requirement**: UI SHALL remain responsive during audio processing

**Measurement**: No UI blocking for > 50ms

**Acceptance Criteria**:
- [ ] Audio processing uses Web Workers
- [ ] UI animations maintain 60fps
- [ ] User inputs are processed within 16ms
- [ ] No freezing or stuttering during audio operations

---

#### NFR-1.4: Connection Establishment

**Requirement**: WebSocket connection SHALL establish within 3 seconds

**Measurement**: Time from connection initiation to ready state

**Acceptance Criteria**:
- [ ] 95th percentile < 3 seconds
- [ ] Timeout triggers user notification
- [ ] Connection metrics are logged

---

### NFR-2: Security

**Priority**: P0

---

#### NFR-2.1: Data Encryption in Transit

**Requirement**: All data in transit SHALL be encrypted

**Acceptance Criteria**:
- [ ] HTTPS is enforced for all HTTP requests
- [ ] WSS (secure WebSocket) is used for real-time connections
- [ ] TLS 1.2 or higher is required
- [ ] Certificate validation is enforced
- [ ] Insecure connections are blocked

---

#### NFR-2.2: API Key Security

**Requirement**: API keys SHALL never be exposed to client-side code

**Acceptance Criteria**:
- [ ] API keys are stored in environment variables
- [ ] Keys are accessed only via secure backend proxy
- [ ] Client-side code never contains API keys
- [ ] Key rotation is supported
- [ ] Access logs track key usage

---

#### NFR-2.3: Data Encryption at Rest

**Requirement**: Conversation history SHALL be encrypted at rest

**Acceptance Criteria**:
- [ ] Database encryption is enabled
- [ ] Encryption keys are managed separately
- [ ] Key rotation is supported
- [ ] Decryption is audited

**Priority**: P1

---

#### NFR-2.4: Session Token Security

**Requirement**: Session tokens SHALL expire after 24 hours

**Acceptance Criteria**:
- [ ] Tokens are cryptographically signed
- [ ] Expiration time is enforced
- [ ] Expired tokens are rejected
- [ ] Token refresh is supported for active sessions

---

#### NFR-2.5: Rate Limiting

**Requirement**: System SHALL implement rate limiting

**Acceptance Criteria**:
- [ ] Maximum 100 requests per minute per user
- [ ] Maximum 1 active session per user
- [ ] Rate limit errors are returned with Retry-After header
- [ ] Rate limits are configurable

---

### NFR-3: Accessibility

**Priority**: P1

---

#### NFR-3.1: WCAG Compliance

**Requirement**: UI SHALL meet WCAG 2.1 AA standards

**Acceptance Criteria**:
- [ ] Keyboard navigation is fully supported
- [ ] Screen reader compatibility is verified
- [ ] Color contrast ratios meet AA standards (4.5:1 for text)
- [ ] Focus indicators are visible
- [ ] ARIA labels are provided for interactive elements

---

#### NFR-3.2: Keyboard Accessibility

**Requirement**: All interactive elements SHALL be keyboard accessible

**Acceptance Criteria**:
- [ ] Tab order is logical
- [ ] All buttons are reachable via keyboard
- [ ] Record/stop/play actions have keyboard shortcuts
- [ ] Focus trap is implemented in modals
- [ ] Escape key closes modals and cancels operations

---

#### NFR-3.3: Visual Feedback

**Requirement**: System SHALL provide visual feedback for audio state

**Acceptance Criteria**:
- [ ] Recording state is visually indicated
- [ ] Listening state is shown clearly
- [ ] Processing state is communicated
- [ ] Audio levels are visualized
- [ ] Animations respect prefers-reduced-motion

---

### NFR-4: Usability

**Priority**: P1

---

#### NFR-4.1: Onboarding Experience

**Requirement**: New users SHALL complete first voice interaction within 5 minutes

**Acceptance Criteria**:
- [ ] Microphone permission flow is clear
- [ ] First-time user tutorial is available
- [ ] Sample prompts are suggested
- [ ] Error messages are actionable
- [ ] Help documentation is accessible

---

#### NFR-4.2: Error Messages

**Requirement**: Error messages SHALL be clear and actionable

**Acceptance Criteria**:
- [ ] Error messages explain what went wrong
- [ ] Suggested actions are provided
- [ ] Technical details are available via "Details" button
- [ ] Errors are categorized (user, network, system)
- [ ] Recovery steps are documented

---

#### NFR-4.3: Visual Design Consistency

**Requirement**: UI SHALL follow consistent design patterns

**Acceptance Criteria**:
- [ ] shadcn/ui components are used consistently
- [ ] Tailwind CSS classes follow BEM naming
- [ ] Color palette is consistent
- [ ] Typography scale is maintained
- [ ] Spacing system is uniform

---

### NFR-5: Reliability

**Priority**: P0

---

#### NFR-5.1: System Uptime

**Requirement**: System uptime SHALL be 99.9% (excluding planned maintenance)

**Measurement**: Monthly uptime percentage

**Acceptance Criteria**:
- [ ] Uptime monitoring is in place
- [ ] Downtime incidents are tracked
- [ ] Monthly uptime reports are generated
- [ ] SLA violations trigger alerts

**Priority**: P2 (for MVP)

---

#### NFR-5.2: Error Recovery

**Requirement**: System SHALL gracefully handle and log all errors

**Acceptance Criteria**:
- [ ] Unhandled exceptions are caught globally
- [ ] Error stack traces are logged
- [ ] User context is included in logs
- [ ] Critical errors trigger alerts
- [ ] Error rates are monitored

---

#### NFR-5.3: Data Backup

**Requirement**: Conversation history SHALL be backed up every 24 hours

**Acceptance Criteria**:
- [ ] Automated backups run daily
- [ ] Backup success is verified
- [ ] Backup retention is 30 days
- [ ] Restore process is tested monthly

**Priority**: P2 (for MVP)

---

### NFR-6: Maintainability

**Priority**: P1

---

#### NFR-6.1: Code Quality

**Requirement**: Code SHALL follow project coding standards

**Acceptance Criteria**:
- [ ] ESLint rules are enforced
- [ ] TypeScript strict mode is enabled
- [ ] No `any` types are used
- [ ] Prettier formatting is applied
- [ ] Code reviews are required for all changes

---

#### NFR-6.2: Documentation

**Requirement**: All functions SHALL have inline documentation

**Acceptance Criteria**:
- [ ] JSDoc comments for all exported functions
- [ ] Complex logic includes explanatory comments
- [ ] README files exist for each domain
- [ ] API contracts are documented
- [ ] Examples are provided for key features

---

#### NFR-6.3: Test Coverage

**Requirement**: Unit test coverage SHALL be > 80%

**Acceptance Criteria**:
- [ ] Jest tests for all business logic
- [ ] Testing Library tests for components
- [ ] Integration tests for key flows
- [ ] E2E tests for critical paths
- [ ] Coverage reports are generated

---

### NFR-7: Scalability

**Priority**: P2

---

#### NFR-7.1: Concurrent Users

**Requirement**: System SHALL support 1000 concurrent sessions

**Measurement**: Number of simultaneous active voice sessions

**Acceptance Criteria**:
- [ ] Load testing validates 1000 concurrent users
- [ ] Response times remain acceptable under load
- [ ] Resource usage is monitored
- [ ] Auto-scaling is configured (future)

**Priority**: P2 (post-MVP)

---

#### NFR-7.2: Database Performance

**Requirement**: Database queries SHALL be optimized for 10x data growth

**Acceptance Criteria**:
- [ ] Indexes are created on query columns
- [ ] Query execution plans are analyzed
- [ ] N+1 queries are eliminated
- [ ] Connection pooling is configured
- [ ] Query performance is monitored

---

### NFR-8: Browser Compatibility

**Priority**: P0

---

#### NFR-8.1: Modern Browser Support

**Requirement**: System SHALL support modern browsers (last 2 versions)

**Supported Browsers**:
- [ ] Chrome/Edge (Chromium-based)
- [ ] Firefox
- [ ] Safari (macOS and iOS)

**Acceptance Criteria**:
- [ ] MediaRecorder API is available
- [ ] Web Audio API is available
- [ ] WebSocket support is present
- [ ] Features degrade gracefully on unsupported browsers

---

#### NFR-8.2: Mobile Responsiveness

**Requirement**: UI SHALL be fully responsive on mobile devices

**Acceptance Criteria**:
- [ ] Touch targets are minimum 44x44px
- [ ] Layout adapts to screen sizes 320px - 1920px
- [ ] Mobile-first CSS is used
- [ ] Gestures work on touch devices
- [ ] Mobile browsers (Chrome, Safari) are tested

---

## 7. Business Rules

### BR-1: Integration Type Selection

**Rule**: Users MUST choose between White Library (chat-based) or Gemini Live (real-time) integration at session start

**Rationale**: The two integration types have different architectures and cannot be mixed in a single session

**Validation**: Session configuration includes `integrationType` field validated against enum

**Impact**: High - affects entire session architecture

---

### BR-2: Session Uniqueness

**Rule**: Each user can have a maximum of 1 active session at a time

**Rationale**: Resource management and API quota optimization

**Validation**: Check for existing active sessions before creating new session

**Impact**: Medium - users must end current session before starting new one

---

### BR-3: Audio Format Requirements (Gemini Live)

**Rule**: Gemini Live API requires specific audio formats: Linear16 PCM or Opus at 16kHz or 24kHz, mono channel

**Rationale**: API compatibility requirement

**Validation**: Audio configuration is validated before streaming begins

**Impact**: High - incorrect format causes API errors

---

### BR-4: White Library Session Expiration

**Rule**: White Library sessions expire after 2 hours by default

**Rationale**: White Library built-in session management

**Validation**: Session age is tracked, users are warned before expiration

**Impact**: Medium - users may lose context on expiration

---

### BR-5: Microphone Permission Required

**Rule**: Users MUST grant microphone permission before starting voice session

**Rationale**: Browser security requirement for audio capture

**Validation**: Permission state is checked before session initialization

**Impact**: High - blocking requirement for voice features

---

### BR-6: API Key Security

**Rule**: API keys MUST NEVER be exposed in client-side code

**Rationale**: Security best practice to prevent unauthorized API usage

**Validation**: Code reviews and automated scanning for hardcoded keys

**Impact**: Critical - security vulnerability if violated

---

### BR-7: Conversation History Retention

**Rule**: Conversation history MUST be retained for at least 30 days

**Rationale**: User expectation and legal compliance

**Validation**: Database retention policies are configured

**Impact**: Low - storage cost consideration

---

### BR-8: Interruption Handling

**Rule**: Users MUST be able to interrupt AI speech at any time during Gemini Live sessions

**Rationale**: Natural conversation flow requirement

**Validation**: User audio input during AI playback triggers interruption

**Impact**: High - critical for real-time UX

---

### BR-9: Rate Limiting

**Rule**: Maximum 100 API requests per minute per user

**Rationale**: Prevent abuse and manage API costs

**Validation**: Request counter tracked per user session

**Impact**: Medium - most users won't hit this limit

---

### BR-10: Multi-Field Response Rendering (White Library)

**Rule**: Backend responses with multiple fields MUST be rendered as separate messages

**Rationale**: White Library design pattern for structured responses

**Validation**: Response parsing logic splits fields into separate ChatMessage components

**Impact**: Medium - affects UI presentation

---

## 8. Data Requirements

### Entity: VoiceSession

**Description**: Represents an active or completed voice conversation session

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique session identifier |
| userId | UUID | Yes | Associated user ID |
| integrationType | Enum | Yes | 'white-library' or 'gemini-live' |
| status | Enum | Yes | 'idle', 'connecting', 'active', 'paused', 'ended', 'error' |
| startedAt | Timestamp | Yes | Session start time |
| endedAt | Timestamp | No | Session end time |
| duration | Integer | Yes | Duration in seconds |
| config | JSON | Yes | Session configuration (audio format, model, etc.) |
| metadata | JSON | Yes | Additional session metadata |
| createdAt | Timestamp | Yes | Record creation timestamp |
| updatedAt | Timestamp | Yes | Record update timestamp |

**Relationships**:
- Belongs to: User (1:1)
- Has many: ConversationTurns (1:N)
- Has one: SessionAnalytics (1:1)

**Validation Rules**:
- `userId` must reference existing user
- `status` must be valid enum value
- `integrationType` must be 'white-library' or 'gemini-live'
- `duration` cannot be negative
- `endedAt` must be after `startedAt` (if present)

---

### Entity: ConversationTurn

**Description**: Represents a single turn in the conversation (user or assistant)

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique turn identifier |
| sessionId | UUID | Yes | Associated session ID |
| role | Enum | Yes | 'user', 'assistant', 'system' |
| type | Enum | Yes | 'audio', 'text', 'multimodal' |
| content | Text | Yes | Text content or audio reference |
| timestamp | Timestamp | Yes | When the turn occurred |
| metadata | JSON | No | Duration, confidence, interrupted flag |
| createdAt | Timestamp | Yes | Record creation timestamp |

**Relationships**:
- Belongs to: VoiceSession (N:1)

**Validation Rules**:
- `sessionId` must reference existing session
- `role` must be valid enum value
- `type` must be valid enum value
- `content` cannot be empty
- `timestamp` must be within session duration

---

### Entity: SessionAnalytics

**Description**: Analytics data for a completed session

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique analytics identifier |
| sessionId | UUID | Yes | Associated session ID |
| turnCount | Integer | Yes | Number of conversation turns |
| avgLatency | Integer | Yes | Average latency in milliseconds |
| totalAudioDuration | Integer | Yes | Total audio in seconds |
| errorCount | Integer | Yes | Number of errors during session |
| interruptionCount | Integer | Yes | Number of user interruptions |
| qualityScore | Float | No | Calculated quality score (0-100) |
| createdAt | Timestamp | Yes | Record creation timestamp |

**Relationships**:
- Belongs to: VoiceSession (1:1)

**Validation Rules**:
- `sessionId` must reference existing session
- `turnCount` must be >= 0
- `avgLatency` must be >= 0
- `errorCount` must be >= 0
- `qualityScore` must be between 0 and 100 (if present)

---

### Entity: ConnectionState

**Description**: Tracks WebSocket connection state for Gemini Live sessions

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Unique state identifier |
| sessionId | UUID | Yes | Associated session ID |
| status | Enum | Yes | 'disconnected', 'connecting', 'connected', 'ready', 'error' |
| error | Text | No | Error message if status is 'error' |
| lastPing | Timestamp | No | Last ping sent |
| lastPong | Timestamp | No | Last pong received |
| reconnectAttempts | Integer | Yes | Number of reconnection attempts |
| updatedAt | Timestamp | Yes | Last update timestamp |

**Relationships**:
- Belongs to: VoiceSession (1:1)

**Validation Rules**:
- `sessionId` must reference existing session
- `status` must be valid enum value
- `reconnectAttempts` must be >= 0 and <= 3
- `lastPong` must be after `lastPing` (if both present)

---

## 9. Integration Requirements

### INT-1: White Library npm Package

**Type**: npm package dependency

**Purpose**: Provide pre-built chat UI components and MediaRecorder audio handling for chat-based voice messaging

**Operations**:
- **Install**: `npm install white-library`
- **Import Components**: `import { ChatPage, ChatInput, ChatMessage } from 'white-library'`
- **Configure**: Initialize ChatConfig with `agentUrl` webhook
- **Send Messages**: Automatic handling via White Library components

**Configuration**:
```typescript
interface ChatConfig {
  agentUrl: string; // Webhook endpoint
  behavior?: {
    maxMessageLength?: number;
    recordingTimeLimit?: number;
  };
  texts?: {
    recordingText?: string;
    listeningText?: string;
  };
}
```

**Error Handling**:
- Network failures during audio upload → retry with exponential backoff
- Invalid response format → display error message to user
- Session expiration → prompt user to start new session

**Fallback**: If White Library is unavailable, provide manual implementation instructions

**Version**: Use latest stable version (specify in package.json)

---

### INT-2: Gemini Live API (Native WebSocket)

**Type**: WebSocket API

**Purpose**: Enable real-time bidirectional voice streaming with low latency

**Endpoint**: `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`

**Authentication**: API key in query parameter: `?key=YOUR_API_KEY`

**Protocol**: JSON messages over WebSocket

**Message Types**:

**Setup Message (Client → Server)**:
```json
{
  "setup": {
    "model": "models/gemini-2.0-flash-exp",
    "generation_config": {
      "response_modalities": ["AUDIO"],
      "speech_config": {
        "voice_config": {
          "prebuilt_voice_config": {
            "voice_name": "Puck"
          }
        }
      }
    }
  }
}
```

**Audio Message (Client → Server)**:
```json
{
  "realtime_input": {
    "media_chunks": [
      {
        "data": "base64_encoded_audio",
        "mime_type": "audio/pcm;rate=16000"
      }
    ]
  }
}
```

**Audio Response (Server → Client)**:
```json
{
  "serverContent": {
    "modelTurn": {
      "parts": [
        {
          "inlineData": {
            "mimeType": "audio/pcm;rate=24000",
            "data": "base64_encoded_audio"
          }
        }
      ]
    }
  }
}
```

**Error Handling**:
- Connection failure → automatic reconnection (max 3 attempts)
- Invalid protocol message → log error and request reconnection
- API quota exceeded → graceful shutdown with user notification
- Network timeout → reconnect with exponential backoff

**Fallback**: If Gemini API is unavailable, show maintenance message

---

### INT-3: Backend Webhook (White Library)

**Type**: REST API (HTTP POST)

**Purpose**: Receive text and audio messages from White Library and return AI responses

**Endpoint**: Configurable via `agentUrl` in ChatConfig

**Request Format**:

**Text Message**:
```json
POST /webhook/chat
Content-Type: application/json

{
  "message": "Hello, AI!",
  "sessionId": "uuid-v4",
  "type": "text"
}
```

**Audio Message**:
```
POST /webhook/chat
Content-Type: multipart/form-data

audio: <Blob> (OGG format)
sessionId: "uuid-v4"
type: "audio"
```

**Response Format**:
```json
{
  "response": "AI text response",
  "audio": "base64_encoded_audio_response",
  "Informe": "Special notification message", // Optional
  "additionalField": "Additional data" // Optional
}
```

**Error Handling**:
- 4xx errors → display user-friendly message
- 5xx errors → retry with backoff
- Timeout → show timeout message and allow retry
- Invalid response → log error and show generic error message

**Fallback**: Queue messages locally and retry when connection is restored

---

## 10. User Interface Requirements

### UI-1: White Library Chat Interface

**Purpose**: Provide chat-based voice messaging interface using White Library components

**Key Elements**:
- **ChatPage**: Full-page chat interface container
- **ChatHeader**: Session title and controls
- **ChatMessage**: Individual message bubbles (user/assistant)
- **ChatInput**: Text input and record button
- **Audio Player**: Play/pause controls for audio messages

**User Flow**:
1. User navigates to chat page
2. ChatConfig is initialized with webhook URL
3. User sees empty chat interface with input field
4. User types text OR presses record button
5. For audio: recording starts, visual feedback shows, user releases to send
6. Message is sent to webhook, loading state is shown
7. Response appears as assistant message(s)
8. Audio responses include playback controls

**Responsive Behavior**:
- **Mobile**: Full-screen chat, record button prominent, touch-optimized controls
- **Tablet**: Split view possible, side panel for settings
- **Desktop**: Multi-column layout, keyboard shortcuts enabled

---

### UI-2: Gemini Live Real-Time Interface

**Purpose**: Enable real-time voice conversations with visual feedback

**Key Elements**:
- **Start/Stop Button**: Large, prominent button to start/end session
- **Status Indicator**: Shows connection state (disconnected, connecting, ready, active)
- **Audio Visualizer**: Waveform or level meter showing user/AI audio
- **Transcript Display**: Real-time transcript (if available)
- **Interrupt Button**: Allow user to interrupt AI
- **Settings Panel**: Audio format, sample rate, voice selection

**User Flow**:
1. User clicks "Start Conversation"
2. Microphone permission is requested
3. WebSocket connection is established (status: connecting)
4. Setup message is sent (status: ready)
5. User speaks (audio visualizer shows input)
6. AI responds (audio plays, visualizer shows output)
7. User can interrupt by speaking
8. User clicks "End Conversation" to terminate

**Responsive Behavior**:
- **Mobile**: Full-screen, large start button, simplified controls
- **Tablet**: Split view with settings, larger visualizer
- **Desktop**: Multi-panel layout, advanced controls visible

---

### UI-3: Session Selection Screen

**Purpose**: Allow users to choose between White Library and Gemini Live integration

**Key Elements**:
- **Integration Cards**: Two large cards showing each option
- **Feature Comparison**: Side-by-side feature list
- **Use Case Guidance**: Recommended use cases for each type
- **Start Button**: Prominent button for each integration type

**User Flow**:
1. User lands on session selection screen
2. User reviews integration options
3. User clicks "Start Chat Session" (White Library) OR "Start Live Session" (Gemini Live)
4. User is navigated to appropriate interface

**Responsive Behavior**:
- **Mobile**: Stacked cards, scrollable comparison table
- **Tablet**: Side-by-side cards
- **Desktop**: Full comparison view with preview

---

### UI-4: Session History

**Purpose**: Display past conversation sessions

**Key Elements**:
- **Session List**: Chronological list of sessions
- **Session Card**: Shows session type, duration, turn count, date
- **View Button**: Navigate to session details
- **Filter Controls**: Filter by integration type, date range

**User Flow**:
1. User navigates to history page
2. User sees list of past sessions
3. User applies filters if desired
4. User clicks session to view details
5. User sees transcript and analytics

**Responsive Behavior**:
- **Mobile**: Card list, swipe to delete
- **Tablet**: Grid layout with filters
- **Desktop**: Table view with sortable columns

---

### UI-5: Settings Panel

**Purpose**: Configure audio and session preferences

**Key Elements**:
- **Audio Settings**: Sample rate, format, quality
- **Session Settings**: Timeout, auto-save, notifications
- **Privacy Settings**: Data retention, export options
- **API Configuration**: (Admin only) API key management

**User Flow**:
1. User opens settings panel
2. User adjusts preferences
3. User saves settings
4. Settings are applied to next session

**Responsive Behavior**:
- **Mobile**: Full-screen modal
- **Tablet**: Side drawer
- **Desktop**: Split pane

---

## 11. Risk Assessment

### Risk 1: White Library Package Maintenance

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: If `white-library` npm package becomes unmaintained or has breaking changes, White Library integration may break

**Mitigation Strategy**:
- Pin package version in package.json
- Monitor package repository for activity
- Prepare fallback plan to implement MediaRecorder logic manually
- Document White Library usage patterns for potential replacement

**Contingency Plan**:
- Create custom chat components mimicking White Library interface
- Implement MediaRecorder audio capture independently
- Maintain same user experience with custom implementation

**Owner**: Technical Lead

---

### Risk 2: Gemini API Changes or Deprecation

**Category**: Technical

**Severity**: High

**Likelihood**: Low

**Impact**: Breaking changes to Gemini Live API protocol could break real-time integration

**Mitigation Strategy**:
- Monitor Gemini API changelog and announcements
- Use versioned API endpoint
- Implement adapter pattern to isolate API-specific code
- Maintain fallback to previous API version temporarily

**Contingency Plan**:
- Implement alternative integration (LiveKit, Pipecat)
- Provide migration guide for users
- Maintain backward compatibility layer for 6 months

**Owner**: Technical Lead

---

### Risk 3: Browser Compatibility Issues

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: MediaRecorder or Web Audio API may not work consistently across browsers

**Mitigation Strategy**:
- Test on all target browsers (Chrome, Firefox, Safari)
- Implement feature detection
- Provide polyfills where possible
- Document browser requirements clearly

**Contingency Plan**:
- Gracefully degrade to text-only mode on unsupported browsers
- Display compatibility warning before session start
- Recommend alternative browsers

**Owner**: Frontend Developer

---

### Risk 4: Network Latency Degradation

**Category**: Business

**Severity**: High

**Likelihood**: High

**Impact**: High network latency degrades real-time voice experience, user satisfaction drops

**Mitigation Strategy**:
- Implement latency monitoring and alerts
- Optimize audio chunk size for network conditions
- Provide visual feedback about connection quality
- Allow users to switch to chat-based mode if latency is high

**Contingency Plan**:
- Automatically switch to chat-based mode when latency > 2 seconds
- Notify user of quality issues
- Offer retry with different network settings

**Owner**: Product Manager

---

### Risk 5: API Quota Exceeded

**Category**: Business

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Service becomes unavailable when API quota is exceeded

**Mitigation Strategy**:
- Implement usage tracking and alerts at 80% quota
- Set up tiered quota limits per user
- Implement request queuing when approaching limits
- Communicate quota limits to users upfront

**Contingency Plan**:
- Display clear message when quota is exceeded
- Provide estimated time until quota reset
- Offer premium tier with higher quotas
- Queue non-urgent requests

**Owner**: System Administrator

---

### Risk 6: Audio Quality Issues

**Category**: Technical

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Poor audio quality leads to user frustration and reduced engagement

**Mitigation Strategy**:
- Implement audio quality presets (low, medium, high)
- Allow user to adjust quality based on network conditions
- Monitor audio quality metrics
- Provide troubleshooting guide for common issues

**Contingency Plan**:
- Automatically downgrade quality when packet loss is detected
- Offer text fallback for unintelligible audio
- Log quality issues for engineering review

**Owner**: Product Manager

---

### Risk 7: Security Vulnerability (API Key Exposure)

**Category**: Security

**Severity**: Critical

**Likelihood**: Low

**Impact**: If API key is exposed, unauthorized usage could occur, leading to cost and security issues

**Mitigation Strategy**:
- Never include API keys in client-side code
- Use environment variables and secure backend proxy
- Implement automated scanning for hardcoded secrets
- Conduct security audits regularly
- Rotate API keys periodically

**Contingency Plan**:
- Immediately revoke compromised key
- Issue new key and update configuration
- Audit usage logs for unauthorized access
- Notify stakeholders of incident

**Owner**: Security Lead

---

### Risk 8: User Privacy Concerns

**Category**: Business

**Severity**: Medium

**Likelihood**: Medium

**Impact**: Users may be uncomfortable with voice data collection, leading to low adoption

**Mitigation Strategy**:
- Provide clear privacy policy
- Allow users to opt-out of conversation history storage
- Implement data export and deletion features (GDPR compliance)
- Encrypt all voice data at rest and in transit
- Communicate data handling practices transparently

**Contingency Plan**:
- Offer anonymous mode (no history storage)
- Provide data deletion on request
- Adjust retention policies based on feedback

**Owner**: Product Manager / Legal

---

## 12. Success Metrics (KPIs)

### User Adoption

**Metric**: Number of active users (monthly)

**Target**: 500 users within first 3 months of launch

**Measurement**: Track unique user IDs creating sessions

**Dashboard**: User adoption graph over time

---

### User Engagement

**Metric**: Average sessions per user per week

**Target**: 3 sessions/user/week

**Measurement**: Calculate average session count per user ID

**Dashboard**: Engagement trend chart

---

### Session Completion Rate

**Metric**: Percentage of sessions ended normally (not due to errors)

**Target**: > 95%

**Measurement**: (Ended sessions / Total sessions) * 100

**Dashboard**: Completion rate pie chart

---

### End-to-End Latency (Gemini Live)

**Metric**: Time from user speech end to AI audio start

**Target**:
- 50th percentile: < 500ms
- 95th percentile: < 1000ms

**Measurement**: Timestamp difference logged per turn

**Dashboard**: Latency distribution histogram

---

### Audio Playback Latency (Gemini Live)

**Metric**: Time from first chunk received to playback start

**Target**: 99th percentile < 200ms

**Measurement**: Timestamp difference logged per audio chunk

**Dashboard**: Playback latency trend

---

### Error Rate

**Metric**: Percentage of sessions encountering errors

**Target**: < 5%

**Measurement**: (Sessions with errors / Total sessions) * 100

**Dashboard**: Error rate trend chart

---

### User Satisfaction (NPS)

**Metric**: Net Promoter Score from post-session survey

**Target**: NPS > 50

**Measurement**: Survey responses (0-10 scale)

**Dashboard**: NPS score over time

---

### Integration Type Distribution

**Metric**: Percentage of sessions using White Library vs Gemini Live

**Target**: N/A (informational)

**Measurement**: Count sessions by integration type

**Dashboard**: Pie chart of integration distribution

---

### Average Session Duration

**Metric**: Mean session length in minutes

**Target**:
- White Library: 5-10 minutes
- Gemini Live: 2-5 minutes

**Measurement**: Calculate average of session durations

**Dashboard**: Average duration by integration type

---

### Cost Per Session

**Metric**: API cost divided by number of sessions

**Target**: < $0.10 per session

**Measurement**: Sum API costs / session count

**Dashboard**: Cost trend over time

---

## 13. Implementation Phases

### Phase 1: MVP (Minimum Viable Product)

**Timeline**: 8-10 weeks

**Includes**:

**White Library Integration**:
- ChatConfig initialization
- Text message send/receive
- Audio recording and sending (OGG format)
- Audio response playback
- Message history display
- Multi-field response rendering

**Gemini Live Integration**:
- WebSocket connection management
- Setup message configuration
- Real-time audio capture (PCM 16kHz)
- Real-time audio playback
- Basic interruption support
- Connection reconnection logic

**Shared Features**:
- User authentication
- Session creation and termination
- Basic error handling
- Microphone permission flow
- Integration type selection screen
- Basic analytics (duration, turn count)

**Success Criteria**:
- Users can complete chat-based voice conversations via White Library
- Users can complete real-time voice conversations via Gemini Live
- Latency targets are met (< 1000ms for Gemini Live)
- Error rate < 10%
- Both integrations are stable for 1-hour sessions

---

### Phase 2: Enhancement

**Timeline**: 4-6 weeks (post-MVP)

**Includes**:

**White Library Enhancements**:
- Configurable recording time limit
- Custom notification flow for "Informe" field
- Audio format options (OGG quality settings)

**Gemini Live Enhancements**:
- Voice Activity Detection (VAD)
- Audio format options (Opus support)
- Sample rate selection (24kHz support)
- Advanced interruption handling
- Audio visualizer component
- Real-time transcript display (if available)

**Shared Features**:
- Session history page
- Advanced analytics dashboard
- User settings panel
- Performance monitoring
- WCAG 2.1 AA accessibility compliance
- Keyboard shortcuts
- Mobile-optimized UI

**Success Criteria**:
- VAD accuracy > 90%
- User satisfaction (NPS) > 50
- Accessibility audit passes
- Mobile usability score > 80

---

### Phase 3: Optimization and Scale

**Timeline**: 6-8 weeks (post-Phase 2)

**Includes**:

**Performance**:
- Web Worker audio processing
- Connection pooling optimization
- Database query optimization
- CDN for static assets
- Code splitting and lazy loading

**Scalability**:
- Auto-scaling configuration
- Load testing for 1000 concurrent users
- Database sharding (if needed)
- Caching strategy (Redis)

**Advanced Features**:
- Conversation export (JSON, PDF)
- Multi-language support
- Voice selection (additional voices)
- Session sharing (read-only links)
- Admin dashboard

**Quality & Reliability**:
- Automated testing (E2E, integration)
- Monitoring and alerting
- Error tracking (Sentry integration)
- Performance profiling
- 99.9% uptime target

**Success Criteria**:
- Support 1000 concurrent sessions
- 99.9% uptime achieved
- Test coverage > 80%
- Page load time < 2 seconds

---

## 14. Open Questions

- [ ] **Q1**: What is the maximum session duration for White Library? Does it align with the 2-hour default expiration?
  - **Owner**: Technical Lead
  - **Due**: Before implementation start
  - **Status**: Open

- [ ] **Q2**: What audio quality presets should be offered (low/medium/high)? What are the bandwidth requirements for each?
  - **Owner**: Product Manager
  - **Due**: Phase 1 planning
  - **Status**: Open

- [ ] **Q3**: Should conversation history include full audio files or just transcripts with audio references?
  - **Owner**: Product Manager / Technical Lead
  - **Due**: Phase 1 planning
  - **Status**: Open

- [ ] **Q4**: What level of GDPR compliance is required? Do we need data processing agreements?
  - **Owner**: Legal / Product Manager
  - **Due**: Before launch
  - **Status**: Open

- [ ] **Q5**: What is the backup and disaster recovery strategy for conversation data?
  - **Owner**: System Administrator
  - **Due**: Phase 2 planning
  - **Status**: Open

- [ ] **Q6**: Should we support multiple simultaneous sessions per user in the future?
  - **Owner**: Product Manager
  - **Due**: Phase 3 roadmap
  - **Status**: Open

- [ ] **Q7**: What analytics should be exposed to end users vs. admin users?
  - **Owner**: Product Manager
  - **Due**: Phase 2 planning
  - **Status**: Open

- [ ] **Q8**: How should we handle voice biometrics and speaker identification (future enhancement)?
  - **Owner**: Product Manager / Technical Lead
  - **Due**: Phase 3 roadmap
  - **Status**: Open

---

## 15. Assumptions Validation

| Assumption | Status | Validation Method | Result |
|------------|--------|-------------------|--------|
| Modern browsers support MediaRecorder API | ⏳ Pending | Browser compatibility testing | TBD |
| Modern browsers support Web Audio API | ⏳ Pending | Browser compatibility testing | TBD |
| Gemini Live API protocol is stable | ⏳ Pending | Review API documentation and changelog | TBD |
| White Library package is actively maintained | ⏳ Pending | Check npm package repository activity | TBD |
| Network latency will be < 200ms RTT on average | ⏳ Pending | Geographic latency testing | TBD |
| Users will grant microphone permissions | ⏳ Pending | User testing / beta feedback | TBD |
| Opus codec is supported in target browsers | ⏳ Pending | Browser compatibility testing | TBD |
| Users have stable internet connections (4G+ or WiFi) | ⏳ Pending | User research / surveys | TBD |

---

## 16. Glossary

**White Library**: npm package providing pre-built chat UI components with integrated MediaRecorder audio recording

**Gemini Live API**: Google's real-time voice streaming API (Gemini 2.0) using WebSocket bidirectional communication

**MediaRecorder API**: Browser API for recording audio/video, outputs OGG format by default

**Web Audio API**: Browser API for real-time audio processing, playback, and analysis

**PCM (Linear16)**: Uncompressed audio format (Pulse Code Modulation, 16-bit linear encoding)

**Opus**: Compressed audio codec optimized for low-latency streaming

**VAD (Voice Activity Detection)**: Algorithm to detect when speech starts and ends

**WebSocket**: Full-duplex communication protocol over TCP, used for real-time bidirectional data

**Session**: A single continuous conversation between user and AI agent

**Turn**: One exchange in a conversation (user message + AI response)

**Webhook**: HTTP callback endpoint that receives POST requests from White Library

**Latency**: Time delay between user action and system response

**RTT (Round-Trip Time)**: Time for network packet to travel to server and back

**Base64**: Encoding scheme to represent binary data as text (used for audio over WebSocket)

**Chunk**: Small piece of audio data (typically 100-200ms)

**Buffer**: Temporary storage for audio data during streaming

**Session ID**: Unique identifier for a conversation session (UUID format)

**Interruption**: User speaking while AI is talking, causing AI to stop

---

## 17. References

**Related Documents**:
- `.claude/knowledge/critical-constraints.md` - Architectural constraints
- `.claude/knowledge/business-rules.md` - Detailed business rules
- `.claude/knowledge/architecture-patterns.md` - Architecture patterns
- `.claude/knowledge/file-structure.md` - Project structure

**Technical Documentation**:
- Gemini Live API Documentation: https://ai.google.dev/api/multimodal-live
- White Library npm package: https://www.npmjs.com/package/white-library
- MediaRecorder API: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

**Standards**:
- WCAG 2.1 AA Accessibility Guidelines
- WebSocket Protocol RFC 6455
- Opus Audio Codec RFC 6716

---

## 18. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| UX Designer | | | |
| Security Lead | | | |

---

## 19. Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-18 | Business Analyst Agent | Initial business analysis document |

---

## Next Steps for Parent Agent

This business analysis document is now ready for review and approval. Once approved, the parent agent should:

1. **Review and Approve**: Stakeholders review this document and provide approval
2. **Invoke Technical Agents**: Launch specialized agents to create implementation plans:
   - **domain-architect**: Define domain business logic and entities
   - **ux-ui-designer**: Create UX flows and UI component specifications
   - **nextjs-builder**: Plan Next.js architecture and routing

3. **Create Session Context**: Initialize session file for tracking implementation
4. **Execute Plans**: Implement features according to prioritized phases

**Ready for handoff to parent agent for orchestration.**
