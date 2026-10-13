import React from 'react';
import { TerminalLogEntry } from '../types';
import { Terminal, Shield, Zap, Coins, AlertTriangle, X } from 'lucide-react';

interface LogsModalProps {
  logs: TerminalLogEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const LogsModal: React.FC<LogsModalProps> = ({ logs, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-cyan-800 rounded-lg p-5 md:p-6 glow-cyan-box flex flex-col gap-4 max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-cyan-950 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wide">
              FLIGHT LOGS // ASTRAL CORSAIR BLACK BOX
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded border border-transparent hover:border-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-slate-500 py-8 text-center">No terminal logs recorded yet.</div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className={`p-2.5 rounded border ${
                  entry.type === 'damage' || entry.type === 'warning'
                    ? 'bg-red-950/30 border-red-900/60 text-red-300'
                    : entry.type === 'gain'
                    ? 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
                    : entry.type === 'combat'
                    ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
                    : 'bg-slate-900/60 border-cyan-950 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-bold text-cyan-400">{entry.timestamp}</span>
                  <span className="uppercase tracking-wider">{entry.type}</span>
                </div>
                <p className="leading-relaxed">{entry.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-cyan-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-900 rounded text-xs font-mono cursor-pointer"
          >
            Close Terminal Log
          </button>
        </div>
      </div>
    </div>
  );
};
