import React from 'react';
import { SectorEvent, EventChoice, EventChoiceOutcome } from '../types';
import { Terminal, Shield, Zap, Coins, ArrowRight, CheckCircle2, AlertOctagon } from 'lucide-react';
import { sound } from '../services/audio';

interface EventTerminalProps {
  event: SectorEvent;
  currentHull: number;
  currentEnergy: number;
  currentCredits: number;
  onSelectChoice: (choice: EventChoice) => void;
  lastOutcome: {
    choiceLabel: string;
    outcome: EventChoiceOutcome;
    isFailure?: boolean;
  } | null;
  onProceedToNextSector: () => void;
  isProcessing: boolean;
}

export const EventTerminal: React.FC<EventTerminalProps> = ({
  event,
  currentHull,
  currentEnergy,
  currentCredits,
  onSelectChoice,
  lastOutcome,
  onProceedToNextSector,
  isProcessing,
}) => {
  return (
    <section className="flex-1 flex flex-col gap-5 p-5 md:p-6 bg-slate-950/80 border border-cyan-900/40 rounded-lg backdrop-blur-md glow-cyan-box min-h-[580px]">
      {/* Sector Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-950 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>{event.sectorName.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">OUTER RIM JURISDICTION</span>
          </div>
          <h1 className="font-tech text-xl md:text-2xl font-bold text-slate-100 mt-1 tracking-wide">
            {event.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-cyan-950/40 border border-cyan-800/60 px-3 py-1.5 rounded">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-cyan-300 font-bold uppercase">{event.category}</span>
        </div>
      </div>

      {/* Visual Cockpit Sensor Feed */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 rounded overflow-hidden border border-cyan-900/50 bg-slate-900">
        <img
          src="/src/assets/images/space_cockpit_view_1791871877629.jpg"
          alt="Commander Rayne cockpit canopy looking into Outer Rim deep space"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        
        {/* HUD overlay marks */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 border border-cyan-800/40">
          OPTICAL CANOPY // REINFORCED TITANIUM GLASS
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 border border-cyan-800/40">
          NEXUS TRAIL: 99.4% MATCH
        </div>

        {/* Cockpit Audio/Comms Log */}
        <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-black/75 border border-cyan-900/80 rounded backdrop-blur-sm">
          <p className="text-xs font-mono text-cyan-300 leading-relaxed">
            {event.logTransmission}
          </p>
        </div>
      </div>

      {/* Narrative Event Brief */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          ENCOUNTER SITUATION
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-mono">
          {event.narrative}
        </p>
      </div>

      {/* Outcome Presentation if choice was taken */}
      {lastOutcome ? (
        <div
          className={`p-4 rounded border transition-all ${
            lastOutcome.isFailure
              ? 'bg-red-950/30 border-red-500/50 text-red-200'
              : 'bg-cyan-950/40 border-cyan-500/60 text-cyan-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {lastOutcome.isFailure ? (
              <AlertOctagon className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className="font-tech text-sm font-bold tracking-wide uppercase">
              {lastOutcome.isFailure ? 'MANEUVER COMPLICATION' : 'MANEUVER SUCCESSFUL'}
            </span>
          </div>

          <p className="text-sm font-mono leading-relaxed mb-3">
            {lastOutcome.outcome.text}
          </p>

          {/* Resource delta readout */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-2 border-t border-cyan-900/40">
            {lastOutcome.outcome.hullChange !== 0 && (
              <span
                className={`flex items-center gap-1 font-bold ${
                  lastOutcome.outcome.hullChange > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Hull: {lastOutcome.outcome.hullChange > 0 ? '+' : ''}
                {lastOutcome.outcome.hullChange} HP
              </span>
            )}
            {lastOutcome.outcome.energyChange !== 0 && (
              <span
                className={`flex items-center gap-1 font-bold ${
                  lastOutcome.outcome.energyChange > 0 ? 'text-blue-400' : 'text-amber-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Energy: {lastOutcome.outcome.energyChange > 0 ? '+' : ''}
                {lastOutcome.outcome.energyChange} MW
              </span>
            )}
            {lastOutcome.outcome.creditsChange !== 0 && (
              <span
                className={`flex items-center gap-1 font-bold ${
                  lastOutcome.outcome.creditsChange > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                Credits: {lastOutcome.outcome.creditsChange > 0 ? '+' : ''}
                {lastOutcome.outcome.creditsChange} CR
              </span>
            )}
          </div>

          {/* Proceed Button */}
          <div className="mt-4 pt-3 flex justify-end">
            <button
              onClick={() => {
                sound.playWarp();
                onProceedToNextSector();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-tech font-bold text-sm tracking-wide rounded cursor-pointer transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] whitespace-nowrap"
            >
              <span>ENGAGE WARP TO SECTOR {event.level + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* The 3 Choices */
        <div className="space-y-3 mt-auto">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            TACTICAL DECISION VECTORS (CHOOSE 1)
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {event.choices.map((choice, index) => {
              const hasEnergy = !choice.reqEnergy || currentEnergy >= choice.reqEnergy;
              const hasCredits = !choice.reqCredits || currentCredits >= choice.reqCredits;
              const canAfford = hasEnergy && hasCredits;

              return (
                <button
                  key={choice.id}
                  disabled={!canAfford || isProcessing}
                  onClick={() => {
                    sound.playBeep(850 + index * 100, 'sine', 0.08);
                    onSelectChoice(choice);
                  }}
                  onMouseEnter={() => {
                    if (canAfford) sound.playBeep(520, 'sine', 0.03);
                  }}
                  className={`group relative text-left p-3.5 border rounded transition-all cursor-pointer ${
                    !canAfford
                      ? 'border-slate-800 bg-slate-950/40 opacity-50 cursor-not-allowed'
                      : 'border-cyan-900/60 bg-slate-900/50 hover:bg-cyan-950/40 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-tech text-sm md:text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      [{index + 1}] {choice.label}
                    </span>
                    {choice.costPreview && (
                      <span className="text-xs font-mono text-cyan-400/90 whitespace-nowrap">
                        {choice.costPreview}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono leading-relaxed">
                    {choice.detail}
                  </p>

                  {!canAfford && (
                    <div className="text-[11px] text-red-400 font-mono mt-1 font-bold">
                      INSUFFICIENT RESOURCES:{' '}
                      {!hasEnergy ? `Need ${choice.reqEnergy} Energy (Have ${currentEnergy}) ` : ''}
                      {!hasCredits ? `Need ${choice.reqCredits} Credits (Have ${currentCredits})` : ''}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
