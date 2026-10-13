import React from 'react';
import { ShipStats } from '../types';
import { Trophy, RotateCcw, Shield, Zap, Coins, Check } from 'lucide-react';
import { sound } from '../services/audio';

interface VictoryModalProps {
  stats: ShipStats;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ stats, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-cyan-400 rounded-lg p-6 md:p-8 glow-cyan-box flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Banner */}
        <div className="text-center space-y-2 border-b border-cyan-900 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500 rounded text-xs font-mono text-cyan-300">
            <Trophy className="w-4 h-4 text-cyan-400" />
            MISSION CLASSIFICATION: COMPLETE
          </div>
          <h2 className="font-tech text-2xl md:text-4xl font-extrabold text-white tracking-wide glow-cyan-text">
            NEXUS CORE SECURED
          </h2>
          <p className="text-xs md:text-sm font-mono text-cyan-300">
            The Void Vanguard has been neutralized. Commander Rayne has recovered the relic!
          </p>
        </div>

        {/* Recovered Nexus Core Image */}
        <div className="flex flex-col sm:flex-row items-center gap-5 bg-black/60 p-4 border border-cyan-900 rounded">
          <div className="w-36 h-36 shrink-0 rounded overflow-hidden border border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <img
              src="/src/assets/images/nexus_core_relic_1791871930986.jpg"
              alt="The glowing Nexus Core secured in magnetic stabilization field"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="text-cyan-300 font-bold text-sm">
              NEXUS CORE // CONTAINMENT STABLE
            </div>
            <p className="leading-relaxed">
              With the destruction of The Void Vanguard dreadnought, the dark-matter warp field collapsed safely. Commander Rayne successfully tractor-beamed the Nexus Core into the Astral Corsair\'s secure vault.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Check className="w-4 h-4" />
              <span>OUTER RIM SYNDICATE NETWORK DISMANTLED</span>
            </div>
          </div>
        </div>

        {/* Mission Telemetry Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded border border-cyan-950 text-center font-mono">
          <div className="p-2 border border-slate-800 rounded bg-black/40">
            <div className="text-[11px] text-slate-400">SECTORS CLEARED</div>
            <div className="text-lg font-bold text-cyan-400 tabular-nums">15 / 15</div>
          </div>
          <div className="p-2 border border-slate-800 rounded bg-black/40">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3 text-cyan-400" />
              FINAL HULL
            </div>
            <div className="text-lg font-bold text-cyan-400 tabular-nums">{stats.hull} HP</div>
          </div>
          <div className="p-2 border border-slate-800 rounded bg-black/40">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-blue-400" />
              ENERGY SURPLUS
            </div>
            <div className="text-lg font-bold text-blue-400 tabular-nums">{stats.energy} MW</div>
          </div>
          <div className="p-2 border border-slate-800 rounded bg-black/40">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              CREDITS
            </div>
            <div className="text-lg font-bold text-amber-400 tabular-nums">{stats.credits} CR</div>
          </div>
        </div>

        {/* Play Again Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              sound.playWarp();
              onRestart();
            }}
            className="flex items-center gap-2 px-8 py-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-tech font-bold text-base tracking-wider rounded transition-all cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.5)] whitespace-nowrap"
          >
            <RotateCcw className="w-5 h-5" />
            <span>PLAY AGAIN // NEW EXPEDITION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
