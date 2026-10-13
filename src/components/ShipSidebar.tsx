import React from 'react';
import { ShipStats } from '../types';
import { Shield, Zap, Coins, Navigation, AlertTriangle, Crosshair, Radio } from 'lucide-react';

interface ShipSidebarProps {
  stats: ShipStats;
  isRedAlert: boolean;
  onOpenDiagnostic?: () => void;
}

export const ShipSidebar: React.FC<ShipSidebarProps> = ({ stats, isRedAlert }) => {
  const hullPct = Math.max(0, Math.min(100, (stats.hull / stats.maxHull) * 100));
  const energyPct = Math.max(0, Math.min(100, (stats.energy / stats.maxEnergy) * 100));

  const isHullCritical = stats.hull <= 25;
  const isEnergyLow = stats.energy <= 20;

  return (
    <aside
      className={`w-full lg:w-80 shrink-0 flex flex-col gap-5 p-4 border rounded-lg transition-colors ${
        isRedAlert
          ? 'bg-slate-950/90 border-red-500/50 glow-red-box'
          : 'bg-slate-950/80 border-cyan-900/50 backdrop-blur-md glow-cyan-box'
      }`}
    >
      {/* Commander & Vessel Header */}
      <div className="border-b border-cyan-950 pb-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            TELEMETRY LINK
          </span>
          <span className="tabular-nums">SEC: {stats.level}/15</span>
        </div>
        <h2 className="font-tech text-base font-bold text-slate-100 mt-1 tracking-wide flex items-center justify-between">
          <span>COMMANDER RAYNE</span>
          <span className="text-xs font-mono font-normal text-cyan-400/80">PILOT-IN-COMMAND</span>
        </h2>
        <div className="text-xs text-slate-400 mt-0.5 font-mono">
          Vessel: <span className="text-cyan-300">Astral Corsair</span> · Interceptor MK-IV
        </div>
      </div>

      {/* Progress Sector Map (1 to 15) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            SECTOR TRAJECTORY
          </span>
          <span className="font-tech font-bold text-cyan-400">
            {stats.level === 15 ? 'FINAL DESTINATION' : `LEVEL ${stats.level} / 15`}
          </span>
        </div>

        {/* 15-node Sector Track Bar */}
        <div className="grid grid-cols-15 gap-1 py-1">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((lvl) => {
            const isCompleted = lvl < stats.level;
            const isCurrent = lvl === stats.level;
            const isBoss = lvl === 15;

            return (
              <div
                key={lvl}
                title={`Sector ${lvl}${isBoss ? ' (The Void Vanguard)' : ''}`}
                className={`h-4 transition-all flex items-center justify-center text-[9px] font-mono font-bold ${
                  isCurrent
                    ? isBoss
                      ? 'bg-red-500 text-white shadow-[0_0_8px_#ef4444] animate-pulse'
                      : 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_#22d3ee]'
                    : isCompleted
                    ? 'bg-cyan-900/80 text-cyan-400 border border-cyan-800'
                    : isBoss
                    ? 'bg-red-950/60 border border-red-900/80 text-red-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}
              >
                {isBoss ? '!' : lvl}
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Ship Resources */}
      <div className="flex flex-col gap-4 bg-black/40 p-3.5 rounded border border-cyan-950/80">
        <div className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
          PRIMARY SHIP METRICS
        </div>

        {/* Hull Health */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Shield
                className={`w-3.5 h-3.5 ${
                  isHullCritical ? 'text-red-400 animate-pulse' : 'text-cyan-400'
                }`}
              />
              Hull Health
            </span>
            <span
              className={`tabular-nums font-bold ${
                isHullCritical ? 'text-red-400' : 'text-cyan-300'
              }`}
            >
              {stats.hull} / {stats.maxHull} HP
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-none overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                isHullCritical
                  ? 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  : hullPct < 50
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
              }`}
              style={{ width: `${hullPct}%` }}
            />
          </div>
          {isHullCritical && (
            <div className="flex items-center gap-1 text-[11px] text-red-400 font-mono animate-pulse">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>CRITICAL: Structural failure imminent!</span>
            </div>
          )}
        </div>

        {/* Energy Capacity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Zap
                className={`w-3.5 h-3.5 ${
                  isEnergyLow ? 'text-amber-400 animate-pulse' : 'text-blue-400'
                }`}
              />
              Energy Reactor
            </span>
            <span
              className={`tabular-nums font-bold ${
                isEnergyLow ? 'text-amber-400' : 'text-blue-300'
              }`}
            >
              {stats.energy} / {stats.maxEnergy} MW
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-none overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                isEnergyLow
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-blue-400 shadow-[0_0_8px_#60a5fa]'
              }`}
              style={{ width: `${energyPct}%` }}
            />
          </div>
          {isEnergyLow && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>CAUTION: Capacitor reserves depleted.</span>
            </div>
          )}
        </div>

        {/* Credits */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-200">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Outer Rim Credits
          </span>
          <span className="tabular-nums font-bold text-amber-300 text-sm">
            {stats.credits} CR
          </span>
        </div>
      </div>

      {/* Subsystem Telemetry Wireframe */}
      <div className="flex flex-col gap-2 p-3 bg-slate-950/70 border border-cyan-950 rounded">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>TACTICAL LOADOUT</span>
          <span className="text-cyan-400">READY</span>
        </div>
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              Twin Plasma Cannons
            </span>
            <span className="text-emerald-400 text-[11px]">CALIBRATED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-blue-400" />
              Magnetic Deflector Grid
            </span>
            <span className="text-cyan-300 text-[11px]">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-400" />
              Deuterium Fusion Cell
            </span>
            <span className="text-cyan-300 text-[11px]">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Mission Briefing Memo */}
      <div className="mt-auto p-3 bg-cyan-950/20 border border-cyan-900/40 rounded text-xs font-mono text-slate-300 leading-relaxed">
        <div className="text-cyan-400 font-bold mb-1 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyan-400" />
          DIRECTIVE 07-NEXUS
        </div>
        Pursue the stolen Nexus Core through Sectors 1–14 to the outer event horizon. Recover the prototype before The Void Vanguard can stabilize its dark-matter matrix.
      </div>
    </aside>
  );
};
