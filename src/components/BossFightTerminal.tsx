import React, { useState, useEffect } from 'react';
import { BossState, ShipStats } from '../types';
import { 
  Skull, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Crosshair, 
  Wrench, 
  AlertTriangle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { sound } from '../services/audio';

interface BossFightTerminalProps {
  stats: ShipStats;
  boss: BossState;
  onPlayerAction: (
    actionType: 'plasma' | 'evade' | 'shield' | 'hypercore' | 'repair'
  ) => void;
  combatLogs: string[];
  isCombatBusy: boolean;
  isShaking: boolean;
}

export const BossFightTerminal: React.FC<BossFightTerminalProps> = ({
  stats,
  boss,
  onPlayerAction,
  combatLogs,
  isCombatBusy,
  isShaking,
}) => {
  const [alarmPulse, setAlarmPulse] = useState(true);

  useEffect(() => {
    // Sound the red alert klaxon periodically during the boss encounter
    sound.playAlarm();
    const interval = setInterval(() => {
      setAlarmPulse((p) => !p);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const bossHpPct = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));

  return (
    <section
      className={`flex-1 flex flex-col gap-5 p-5 md:p-6 bg-black/90 border border-red-500/60 rounded-lg backdrop-blur-md glow-red-box relative overflow-hidden transition-transform ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      {/* Red Alert Strobe Backdrop */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          alarmPulse ? 'bg-red-950/20' : 'bg-transparent'
        }`}
      />

      {/* Warning Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-red-900/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-red-600/30 border border-red-500 rounded text-red-400 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold tracking-wider">
              <span>PRIORITY OMEGA // SECTOR 15 TERMINUS</span>
              <span aria-hidden="true">·</span>
              <span className="text-red-300 animate-pulse">RED ALERT ACTIVE</span>
            </div>
            <h1 className="font-tech text-xl md:text-3xl font-extrabold text-red-50 tracking-wider uppercase glow-red-text">
              {boss.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-red-950/70 border border-red-600 px-3 py-1.5 rounded">
          <Skull className="w-4 h-4 text-red-400 animate-bounce" />
          <span className="text-red-200 font-bold tracking-widest">
            PHASE {boss.phase} OF 3: {boss.phase === 1 ? 'HARBINGER' : boss.phase === 2 ? 'SINGULARITY' : 'CORE OVERDRIVE'}
          </span>
        </div>
      </div>

      {/* Boss Health Bar & Visual Viewport */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-2 text-red-300 font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-500" />
            Void Dreadnought Structural Integrity
          </span>
          <span className="tabular-nums font-tech text-sm font-bold text-red-400">
            {boss.hp} / {boss.maxHp} HP ({Math.round(bossHpPct)}%)
          </span>
        </div>

        {/* Boss HP Gauge */}
        <div className="w-full h-4 bg-slate-950 rounded-none overflow-hidden border border-red-600/80 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-red-700 via-red-500 to-rose-400 shadow-[0_0_15px_#f43f5e] transition-all duration-300"
            style={{ width: `${bossHpPct}%` }}
          />
        </div>

        {/* Visual Encounter Window */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded overflow-hidden border border-red-600/60 bg-black mt-2">
          <img
            src="/src/assets/images/boss_void_vanguard_1791871904331.jpg"
            alt="The Void Vanguard ancient outer rim dreadnought looming in space with red glowing cores"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-125 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

          {/* Ominous Scanner Lock Indicators */}
          <div className="absolute top-3 left-3 text-[10px] font-mono text-red-300 bg-red-950/80 px-2 py-0.5 border border-red-500/80">
            RADAR: MASSIVE LEVIATHAN SIGNATURE
          </div>

          <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 border border-cyan-500/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
            NEXUS CORE CONTAINED IN CARGO BOW
          </div>

          {/* Boss Next Intent Telegraphed */}
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-red-950/90 border border-red-500/80 rounded backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>INCOMING ATTACK SIGNATURE: {boss.nextMove.name}</span>
            </div>
            <p className="text-xs font-mono text-red-200 leading-relaxed">
              {boss.nextMove.description} Predicted impact:{' '}
              <span className="font-bold text-red-400">{boss.nextMove.predictedDamage} DMG</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Combat Exchange Live Logs */}
      <div className="relative z-10 bg-black/60 border border-red-950 p-3 rounded h-28 overflow-y-auto font-mono text-xs space-y-1.5 flex flex-col-reverse">
        {combatLogs.slice(0, 5).map((log, index) => (
          <div
            key={index}
            className={`flex items-start gap-1.5 ${
              log.includes('CRITICAL') || log.includes('BREACH')
                ? 'text-red-400 font-bold'
                : log.includes('Shields') || log.includes('DODGED')
                ? 'text-cyan-300'
                : log.includes('Direct hit')
                ? 'text-amber-300'
                : 'text-slate-300'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
            <span>{log}</span>
          </div>
        ))}
      </div>

      {/* Unique Action Buttons */}
      <div className="relative z-10 space-y-2 mt-auto">
        <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center justify-between">
          <span>COMBAT COMMAND CONTROLS</span>
          <span className="text-slate-400">TURN {boss.turnCount + 1}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {/* [Fire Plasma Cannons] */}
          <button
            disabled={stats.energy < 18 || isCombatBusy}
            onClick={() => onPlayerAction('plasma')}
            className={`p-3 border rounded text-left transition-all cursor-pointer ${
              stats.energy < 18 || isCombatBusy
                ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                : 'border-cyan-500/70 bg-cyan-950/40 hover:bg-cyan-900/50 hover:border-cyan-300 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between font-tech text-sm font-bold text-cyan-100">
              <span className="flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                Fire Plasma Cannons
              </span>
              <span className="text-xs font-mono text-blue-400">-18 MW</span>
            </div>
            <div className="text-[11px] font-mono text-cyan-300/80 mt-1">
              Deals 25–38 Thermal Plasma DMG to Dreadnought.
            </div>
          </button>

          {/* [Evasive Maneuvers] */}
          <button
            disabled={isCombatBusy}
            onClick={() => onPlayerAction('evade')}
            className={`p-3 border rounded text-left transition-all cursor-pointer ${
              isCombatBusy
                ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                : 'border-blue-500/70 bg-blue-950/40 hover:bg-blue-900/50 hover:border-blue-300 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between font-tech text-sm font-bold text-blue-100">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                Evasive Maneuvers
              </span>
              <span className="text-xs font-mono text-emerald-400">+15 MW</span>
            </div>
            <div className="text-[11px] font-mono text-blue-300/80 mt-1">
              75% chance to dodge incoming blast + cools reactor.
            </div>
          </button>

          {/* [Overload Shields] */}
          <button
            disabled={stats.energy < 25 || isCombatBusy}
            onClick={() => onPlayerAction('shield')}
            className={`p-3 border rounded text-left transition-all cursor-pointer ${
              stats.energy < 25 || isCombatBusy
                ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                : 'border-emerald-500/70 bg-emerald-950/40 hover:bg-emerald-900/50 hover:border-emerald-300 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between font-tech text-sm font-bold text-emerald-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Overload Shields
              </span>
              <span className="text-xs font-mono text-blue-400">-25 MW</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-300/80 mt-1">
              Negates 85% damage & reflects 18 backfire DMG!
            </div>
          </button>

          {/* [Target Hypercore] */}
          <button
            disabled={stats.energy < 25 || stats.credits < 30 || isCombatBusy}
            onClick={() => onPlayerAction('hypercore')}
            className={`p-3 border rounded text-left transition-all cursor-pointer ${
              stats.energy < 25 || stats.credits < 30 || isCombatBusy
                ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                : 'border-amber-500/70 bg-amber-950/40 hover:bg-amber-900/50 hover:border-amber-300 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between font-tech text-sm font-bold text-amber-100">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Target Hypercore
              </span>
              <span className="text-xs font-mono text-amber-400">-25 MW / 30 CR</span>
            </div>
            <div className="text-[11px] font-mono text-amber-300/80 mt-1">
              High-yield antimatter torpedo. Deals 45–60 Critical DMG.
            </div>
          </button>

          {/* [Emergency Repair Protocol] */}
          <button
            disabled={stats.energy < 20 || stats.credits < 40 || isCombatBusy}
            onClick={() => onPlayerAction('repair')}
            className={`p-3 border rounded text-left transition-all cursor-pointer sm:col-span-2 lg:col-span-2 ${
              stats.energy < 20 || stats.credits < 40 || isCombatBusy
                ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                : 'border-rose-500/70 bg-rose-950/40 hover:bg-rose-900/50 hover:border-rose-300 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
            }`}
          >
            <div className="flex items-center justify-between font-tech text-sm font-bold text-rose-100">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-rose-400" />
                Emergency Repair Protocol
              </span>
              <span className="text-xs font-mono text-rose-300">-20 MW / 40 CR</span>
            </div>
            <div className="text-[11px] font-mono text-rose-300/80 mt-1">
              Deploy automated welding nanites to instantly restore +35 Hull Health.
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
