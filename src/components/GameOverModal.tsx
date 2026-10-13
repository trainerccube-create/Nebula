import React from 'react';
import { ShipStats } from '../types';
import { AlertOctagon, RotateCcw, Skull } from 'lucide-react';
import { sound } from '../services/audio';

interface GameOverModalProps {
  stats: ShipStats;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-950 border-2 border-red-600 rounded-lg p-6 md:p-8 glow-red-box flex flex-col gap-6">
        {/* Banner */}
        <div className="text-center space-y-2 border-b border-red-900/60 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950 border border-red-600 rounded text-xs font-mono text-red-300 animate-pulse">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            CRITICAL SYSTEM BREACH
          </div>
          <h2 className="font-tech text-2xl md:text-4xl font-extrabold text-red-500 tracking-wider glow-red-text uppercase">
            HULL INTEGRITY COMPROMISED
          </h2>
          <p className="text-xs md:text-sm font-mono text-red-300">
            The Astral Corsair has suffered catastrophic structural failure in Sector {stats.level}.
          </p>
        </div>

        {/* Diagnostic breakdown */}
        <div className="bg-black/60 p-4 border border-red-900 rounded space-y-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <Skull className="w-4 h-4 text-red-500" />
            <span>FINAL FLIGHT TELEMETRY:</span>
          </div>
          <p className="leading-relaxed">
            Atmospheric seals breached. Life support offline. Commander Rayne\'s emergency beacon has entered low-frequency distress broadcast into the Outer Rim void. The Nexus Core remains in enemy control.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 text-slate-400">
            <div className="p-2 border border-red-950 rounded bg-red-950/20">
              <span className="text-[11px] block text-red-400">REACHED SECTOR</span>
              <span className="text-base font-bold text-white tabular-nums">Level {stats.level} / 15</span>
            </div>
            <div className="p-2 border border-red-950 rounded bg-red-950/20">
              <span className="text-[11px] block text-red-400">CREDITS AT LOSS</span>
              <span className="text-base font-bold text-amber-400 tabular-nums">{stats.credits} CR</span>
            </div>
          </div>
        </div>

        {/* Retry Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              sound.playWarp();
              onRestart();
            }}
            className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-tech font-bold text-base tracking-wider rounded transition-all cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.6)] whitespace-nowrap"
          >
            <RotateCcw className="w-5 h-5" />
            <span>REBOOT FLIGHT SYSTEMS // RETRY</span>
          </button>
        </div>
      </div>
    </div>
  );
};
