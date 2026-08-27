import React from 'react';
import { Lock, PlusCircle, Volume2, VolumeX, Sparkles, Clock, ChevronDown } from 'lucide-react';

export default function Navbar({
  capsules = [],
  selectedCapsuleId,
  onSelectCapsule,
  onOpenCreateModal,
  isAudioPlaying,
  onToggleAudio
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-vault-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-vault-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-serif font-black text-base sm:text-xl tracking-wider text-slate-100 uppercase">
                Chrono<span className="text-amber-400">Vault</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                DAY 7
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              Dual-Key Digital Time Capsule
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Ambient Music Toggle Button */}
          <button
            onClick={onToggleAudio}
            aria-label="Toggle Ambient Audio"
            title={isAudioPlaying ? "Mute Ambient Sound" : "Play Nostalgic Ambient Audio"}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-vault-850 hover:bg-vault-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden lg:inline text-xs">Ambient Sound</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden lg:inline text-xs text-slate-400">Sound</span>
              </>
            )}
          </button>

          {/* Seal New Capsule CTA */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-200 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Seal Capsule</span>
          </button>
        </div>
      </div>
    </header>
  );
}
