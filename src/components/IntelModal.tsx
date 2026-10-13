import React from 'react';
import { Sparkles, Shield, AlertTriangle, X } from 'lucide-react';

interface IntelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntelModal: React.FC<IntelModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-cyan-800 rounded-lg p-5 md:p-6 glow-cyan-box flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wide">
              CLASSIFIED DOSSIER // THE NEXUS CORE & VOID VANGUARD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded border border-transparent hover:border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: The Nexus Core */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-900/60 border border-cyan-950 rounded">
          <div className="w-28 h-28 shrink-0 rounded overflow-hidden border border-cyan-500/50">
            <img
              src="/src/assets/images/nexus_core_relic_1791871930986.jpg"
              alt="Nexus Core prototype matrix"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="text-cyan-300 font-bold text-sm">TARGET ASSET: THE NEXUS CORE</div>
            <p className="leading-relaxed">
              A self-sustaining zero-point energy matrix created by core-world physicists. Capable of generating hyper-luminal warp bridges without planetary gates. Stolen from Research Station Valis by an Outer Rim syndicate syndicate.
            </p>
          </div>
        </div>

        {/* Section 2: Commander Rayne */}
        <div className="p-4 bg-slate-900/60 border border-cyan-950 rounded space-y-2 text-xs font-mono text-slate-300">
          <div className="text-cyan-300 font-bold text-sm">OPERATIVE: COMMANDER RAYNE</div>
          <p className="leading-relaxed">
            Decorated deep-space interceptor ace assigned to the Outer Rim Sector Fleet. Piloting the modified Interceptor MK-IV "Astral Corsair". Authorized to use lethal tactical force to prevent the Nexus Core from being weaponized.
          </p>
        </div>

        {/* Section 3: The Void Vanguard */}
        <div className="p-4 bg-red-950/30 border border-red-900/60 rounded space-y-2 text-xs font-mono text-red-200">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>HOSTILE THREAT: THE VOID VANGUARD</span>
          </div>
          <p className="leading-relaxed">
            An ancient Outer Rim dreadnought warped by anomalous dark-matter storms. Commanded by a ruthless rogue presence that ravages the rim borders. Possesses 200 HP heavy armor and weaponized void lances. Awaits Commander Rayne at Sector 15.
          </p>
        </div>

        <div className="pt-2 border-t border-cyan-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-900 rounded text-xs font-mono cursor-pointer"
          >
            Acknowledge Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};
