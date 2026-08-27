import React, { useEffect, useState } from 'react';
import { Sparkles, Eye, Unlock, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CinematicUnlockReveal({ onComplete }) {
  const [phase, setPhase] = useState(1); // 1 = "You couldn't wait, huh?", 2 = "Your memories are finally yours."

  useEffect(() => {
    // Play celebratory confetti particles
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#e2e8f0', '#38bdf8']
      });
    } catch (e) {
      console.warn("Confetti ignored", e);
    }

    // Phase 1 -> Phase 2 timer (2.4s)
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 2400);

    // Auto complete after 5.5s or allow instant skip
    const t2 = setTimeout(() => {
      onComplete();
    }, 5600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-vault-950/98 backdrop-blur-2xl text-center px-4 overflow-hidden animate-fadeIn">
      {/* Ambient Pulsing Glow */}
      <div className="absolute w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <div className="max-w-xl relative flex flex-col items-center justify-center p-6">
        
        {/* Animated Vault Unlock Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-bounce">
          <Unlock className="w-9 h-9 text-amber-400" />
        </div>

        {/* Phase 1: You couldn't wait, huh? 👀 */}
        {phase === 1 && (
          <div className="space-y-4 animate-fadeIn transition-all duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
              <Eye className="w-3.5 h-3.5" />
              <span>Vault Unsealed</span>
            </div>
            
            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-100 tracking-tight leading-snug">
              You couldn't wait, huh? 👀
            </h2>

            <p className="text-slate-400 text-sm sm:text-base italic">
              Curiosity got the best of you... and that's okay.
            </p>
          </div>
        )}

        {/* Phase 2: Your memories are finally yours. */}
        {phase === 2 && (
          <div className="space-y-4 animate-fadeIn transition-all duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Memories Unlocked</span>
            </div>

            <h2 className="font-serif font-black text-3xl sm:text-5xl text-slate-100 tracking-tight leading-snug">
              Your memories are finally yours.
            </h2>

            <p className="text-amber-200/90 text-sm sm:text-base font-handwriting text-xl sm:text-2xl">
              Step inside and relive the moment.
            </p>

            <div className="pt-4">
              <button
                onClick={onComplete}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-black text-sm tracking-wide shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all hover:scale-105"
              >
                View Photo Gallery & Letter →
              </button>
            </div>
          </div>
        )}

        {/* Skip button in corner */}
        <button
          onClick={onComplete}
          className="absolute bottom-4 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors"
        >
          Skip animation
        </button>
      </div>
    </div>
  );
}
