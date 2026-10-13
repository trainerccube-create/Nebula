import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Compass } from 'lucide-react';
import { sound } from '../services/audio';

interface TerminalHeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isRedAlert: boolean;
  level: number;
  activeTab: 'mission' | 'log' | 'intel';
  setActiveTab: (tab: 'mission' | 'log' | 'intel') => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  isMuted,
  onToggleMute,
  isRedAlert,
  level,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-8 px-5 py-3 border-b transition-colors duration-300 ${
        isRedAlert
          ? 'bg-red-950/40 border-red-500/40'
          : 'bg-slate-950/80 border-cyan-900/40 backdrop-blur-md'
      }`}
    >
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-none rotate-45 transition-colors ${
            isRedAlert ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
          }`}
        />
        <span
          className={`font-tech text-base md:text-lg font-bold tracking-wider uppercase whitespace-nowrap ${
            isRedAlert ? 'text-red-400 glow-red-text' : 'text-cyan-400 glow-cyan-text'
          }`}
        >
          {isRedAlert ? 'RED ALERT · VOID VANGUARD' : 'OUTER RIM // TACTICAL TERMINAL'}
        </span>
      </div>

      {/* Zone 2: Navigation tabs / Single-line links */}
      <nav className="flex items-center gap-2 md:gap-5 text-xs font-mono font-medium">
        <button
          onClick={() => {
            sound.playBeep(900, 'sine', 0.05);
            setActiveTab('mission');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'mission'
              ? isRedAlert
                ? 'text-red-300 border-b-2 border-red-400 font-bold'
                : 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Tactical Helm</span>
        </button>

        <button
          onClick={() => {
            sound.playBeep(900, 'sine', 0.05);
            setActiveTab('log');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'log'
              ? isRedAlert
                ? 'text-red-300 border-b-2 border-red-400 font-bold'
                : 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Comms & Logs</span>
        </button>

        <button
          onClick={() => {
            sound.playBeep(900, 'sine', 0.05);
            setActiveTab('intel');
          }}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'intel'
              ? isRedAlert
                ? 'text-red-300 border-b-2 border-red-400 font-bold'
                : 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Nexus Core Intel</span>
        </button>
      </nav>

      {/* Zone 3: Single primary action / Audio toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            onToggleMute();
            if (isMuted) {
              sound.playBeep(1200, 'sine', 0.08);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono border rounded transition-all cursor-pointer whitespace-nowrap ${
            isMuted
              ? 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              : isRedAlert
              ? 'border-red-500/60 bg-red-950/40 text-red-300 hover:bg-red-900/50'
              : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isMuted ? 'Audio: OFF' : 'Audio: ON'}</span>
        </button>
      </div>
    </header>
  );
};
