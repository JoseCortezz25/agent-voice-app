'use client';

import { useGeminiLive } from '@/domains/voice-agent/hooks/use-gemini-live';
import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff
} from 'lucide-react';

export default function ConversationPage() {
  const { status, isMuted, connect, disconnect, toggleMute, error } =
    useGeminiLive();
  const [showPermissionTip, setShowPermissionTip] = useState(false);

  const handleStartCall = async () => {
    setShowPermissionTip(true);
    await connect();
    setShowPermissionTip(false);
  };

  const handleEndCall = async () => {
    await disconnect();
  };

  const isActive = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 font-sans text-zinc-50 selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px] transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[80px] transition-opacity delay-200 duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <header className="absolute top-8 right-0 left-0 z-10 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur-md">
          <Activity
            className={`h-4 w-4 ${isActive ? 'text-green-400' : 'text-zinc-500'}`}
          />
          <span className="text-xs font-medium tracking-wide text-zinc-400">
            {status === 'disconnected' ? 'READY' : status.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="z-10 flex w-full max-w-md flex-col items-center gap-12 px-6">
        {/* Central Avatar / Visualizer */}
        <div className="group relative">
          {/* Ring Animations */}
          {isActive && !isMuted && (
            <>
              <div className="animate-pulse-ring absolute inset-0 rounded-full border border-blue-500/30" />
              <div className="animate-pulse-ring absolute inset-0 rounded-full border border-blue-400/20 delay-100" />
            </>
          )}

          <div
            className={`relative flex h-40 w-40 items-center justify-center rounded-full transition-all duration-500 ${
              isActive
                ? isMuted
                  ? 'bg-red-950/30 shadow-[0_0_50px_-10px_rgba(239,68,68,0.3)]'
                  : 'bg-blue-950/30 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]'
                : 'bg-zinc-900 shadow-xl'
            }`}
          >
            {/* Icon or Visualizer inside */}
            <div className="flex flex-col items-center gap-2">
              {isActive ? (
                <div>asdsadsa</div>
              ) : (
                // <Visualizer isActive={isActive} isMuted={isMuted} volume={volumeLevel} />
                <div className="h-1 w-16 rounded-full bg-zinc-800" />
              )}
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="h-16 space-y-2 text-center">
          {error ? (
            <div className="flex items-center gap-2 rounded-lg bg-red-950/20 px-4 py-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-light tracking-tight">
                {isActive
                  ? isMuted
                    ? 'Microphone muted'
                    : 'Listening...'
                  : 'Gemini Live'}
              </h2>
              <p className="text-sm text-zinc-500">
                {isConnecting
                  ? 'Establishing secure connection...'
                  : isActive
                    ? 'Conversation active'
                    : 'Tap call to start speaking'}
              </p>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {isActive ? (
            <>
              {/* Mute Toggle */}
              <button
                onClick={toggleMute}
                className={`rounded-full p-5 transition-all duration-300 ${
                  isMuted
                    ? 'bg-zinc-100 text-zinc-900 hover:scale-105'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </button>

              {/* End Call */}
              <button
                onClick={handleEndCall}
                className="rounded-full bg-red-500/90 p-5 text-white transition-all duration-300 hover:scale-105 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20"
                title="End Call"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </>
          ) : (
            /* Start Call */
            <button
              onClick={handleStartCall}
              disabled={isConnecting}
              className={`group relative flex items-center gap-3 rounded-full bg-white py-4 pr-8 pl-6 font-medium text-black transition-all duration-300 ${
                isConnecting
                  ? 'cursor-not-allowed opacity-70'
                  : 'hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]'
              }`}
            >
              <div
                className={`rounded-full bg-zinc-900 p-2 text-white transition-transform duration-500 ${isConnecting ? 'animate-spin' : 'group-hover:rotate-12'}`}
              >
                <Phone className="h-4 w-4" />
              </div>
              <span>{isConnecting ? 'Connecting...' : 'Start Call'}</span>
            </button>
          )}
        </div>

        {showPermissionTip && isConnecting && (
          <p className="animate-pulse text-xs text-zinc-600">
            Please allow microphone access if prompted.
          </p>
        )}
      </main>

      {/* Footer / Branding */}
      <footer className="absolute bottom-6 text-xs font-medium tracking-widest text-zinc-800 uppercase">
        Powered by Gemini 2.5
      </footer>
    </div>
  );
}
