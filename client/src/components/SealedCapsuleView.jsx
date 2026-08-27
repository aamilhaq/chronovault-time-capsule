import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, KeyRound, Calendar, User, Clock, Image as ImageIcon, ShieldAlert, ArrowRight } from 'lucide-react';

export default function SealedCapsuleView({ capsule, onUnlockEarlyClick }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });

  useEffect(() => {
    if (!capsule?.unlockDate) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(capsule.unlockDate).getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: Math.floor(diff / 1000)
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [capsule?.unlockDate]);

  if (!capsule) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const createdDateFormatted = formatDate(capsule.createdAt);
  const unlockDateFormatted = formatDate(capsule.unlockDate);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-16 flex flex-col items-center justify-center">
      {/* Central Vault Container */}
      <div className="w-full relative rounded-3xl bg-gradient-to-b from-vault-900/90 via-vault-850/80 to-vault-950/95 border border-amber-500/20 p-6 sm:p-12 shadow-[0_0_60px_-15px_rgba(245,158,11,0.15)] backdrop-blur-2xl overflow-hidden text-center flex flex-col items-center">
        
        {/* Atmospheric Background Effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Concentric Vault Rings Animation */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute w-24 h-24 sm:w-30 sm:h-30 rounded-full border border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-vault-900 via-vault-800 to-amber-950/60 border border-amber-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.3)]">
            <Lock className="w-9 h-9 sm:w-11 sm:h-11 text-amber-400 animate-pulse-slow" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>🔒 SEALED</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-slate-100 tracking-tight leading-tight max-w-2xl">
          {capsule.title}
        </h1>
        {capsule.tagline && (
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl italic">
            "{capsule.tagline}"
          </p>
        )}

        {/* Meta details */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mt-4">
          <span className="flex items-center gap-1.5 bg-vault-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Created {createdDateFormatted}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-vault-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Unlocks {unlockDateFormatted}</span>
          </span>
          {capsule.creatorName && (
            <span className="flex items-center gap-1.5 bg-vault-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <User className="w-3.5 h-3.5 text-amber-400/80" />
              <span>For: {capsule.recipientName || capsule.creatorName}</span>
            </span>
          )}
        </div>

        {/* Prominent Days Remaining Highlight */}
        <div className="mt-8 mb-2">
          <span className="font-mono font-extrabold text-2xl sm:text-4xl text-amber-300 tracking-wide drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            {timeLeft.days.toLocaleString()} days remaining
          </span>
        </div>

        {/* Emotional prompt */}
        <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide mb-8">
          Your future self is waiting.
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full mb-10">
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-vault-950/80 border border-slate-800/80 shadow-inner">
            <span className="font-mono font-bold text-xl sm:text-3xl text-slate-100">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              Days
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-vault-950/80 border border-slate-800/80 shadow-inner">
            <span className="font-mono font-bold text-xl sm:text-3xl text-slate-100">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              Hours
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-vault-950/80 border border-slate-800/80 shadow-inner">
            <span className="font-mono font-bold text-xl sm:text-3xl text-slate-100">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              Mins
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-vault-950/80 border border-slate-800/80 shadow-inner">
            <span className="font-mono font-bold text-xl sm:text-3xl text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">
              Secs
            </span>
          </div>
        </div>

        {/* Sealed Contents Teaser (Zero Leaks, just count) */}
        <div className="w-full max-w-md p-4 rounded-2xl bg-vault-950/50 border border-slate-800/60 mb-10 flex items-center justify-around text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400/70" />
            <span>{capsule.photoCount || 0} Sealed Photo{capsule.photoCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400/70" />
            <span>1 Future Letter</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-800/80 pt-6 flex flex-col items-center">
          
          {/* Subtle, Intentionally Less Prominent Early Unlock Trigger */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="italic">Can't wait?</span>
            <button
              onClick={onUnlockEarlyClick}
              className="group inline-flex items-center gap-1 font-semibold text-slate-400 hover:text-amber-400 underline decoration-slate-700 hover:decoration-amber-400/80 underline-offset-4 transition-colors duration-200"
            >
              <span>Unlock early</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 mt-2">
            Requires your secret early-unlock password.
          </p>
        </div>

      </div>
    </div>
  );
}
