import React from 'react';
import { Lock, PlusCircle, Sparkles, Volume2, VolumeX, ShieldCheck, Clock } from 'lucide-react';

export default function Navbar({
  capsules = [],
  selectedCapsuleId,
  onSelectCapsule,
  onOpenCreateModal,
  isAudioPlaying,
  onToggleAudio
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-vault-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Lock className="w-5 h-5 text-amber-400" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-vault-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg sm:text-xl tracking-wider text-slate-100 uppercase">
                Chrono<span className="text-amber-400">Vault</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                DAY 7
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Dual-Key Digital Time Capsule
            </p>
          </div>
        </div>

        {/* Capsule Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Capsule Switcher Dropdown */}
          {capsules.length > 0 && (
            <div className="relative">
              <select
                value={selectedCapsuleId || ''}
                onChange={(e) => onSelectCapsule(e.target.value)}
                className="appearance-none bg-vault-850 hover:bg-vault-800 border border-slate-700/70 text-slate-200 text-xs sm:text-sm font-medium rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer transition-colors max-w-[140px] sm:max-w-[220px] truncate"
              >
                {capsules.map((cap) => (
                  <option key={cap.id} value={cap.id} className="bg-vault-900 text-slate-200">
                    {cap.status === 'SEALED' ? '🔒' : cap.status === 'UNLOCKED_EARLY' ? '⚡' : '🌟'} {cap.title}
                  </option>
                ))}
              </select>
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Ambient Music Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? "Mute Ambient Sound" : "Play Nostalgic Ambient Audio"}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-vault-850 hover:bg-vault-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden md:inline">Ambient On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Sound</span>
              </>
            )}
          </button>

          {/* Seal New Capsule CTA */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Seal Capsule</span>
          </button>
        </div>
      </div>
    </header>
  );
}
