import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, KeyRound, Calendar, User, Clock, Image as ImageIcon, ArrowRight } from 'lucide-react';

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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const createdDateFormatted = formatDate(capsule.createdAt);
  const unlockDateFormatted = formatDate(capsule.unlockDate);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-10 flex flex-col items-center justify-center">
      {/* Central Vault Container */}
      <div className="w-full relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-vault-900/95 via-vault-850/90 to-vault-950/98 border border-amber-500/25 p-5 sm:p-10 shadow-[0_0_50px_-15px_rgba(245,158,11,0.15)] backdrop-blur-2xl overflow-hidden text-center flex flex-col items-center">
        
        {/* Atmospheric Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Animated Vault Rings */}
        <div className="relative mb-4 sm:mb-6 flex items-center justify-center">
          <div className="absolute w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '30s' }} />
          <div className="absolute w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-dashed border-amber-500/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-vault-900 via-vault-800 to-amber-950/60 border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            <Lock className="w-6 h-6 sm:w-9 sm:h-9 text-amber-400 animate-pulse-slow" />
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>🔒 SEALED</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="font-serif font-black text-2xl sm:text-4xl text-slate-100 tracking-tight leading-snug px-1">
          {capsule.title}
        </h1>
        {capsule.tagline && (
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg italic px-2">
            "{capsule.tagline}"
          </p>
        )}

        {/* Metadata pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400 mt-3 sm:mt-4">
          <span className="flex items-center gap-1 bg-vault-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Calendar className="w-3 h-3 text-amber-400/80" />
            <span>Created {createdDateFormatted}</span>
          </span>
          <span className="flex items-center gap-1 bg-vault-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <Clock className="w-3 h-3 text-amber-400/80" />
            <span>Unlocks {unlockDateFormatted}</span>
          </span>
          {capsule.creatorName && (
            <span className="flex items-center gap-1 bg-vault-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <User className="w-3 h-3 text-amber-400/80" />
              <span>For: {capsule.recipientName || capsule.creatorName}</span>
            </span>
          )}
        </div>

        {/* Prominent Days Remaining */}
        <div className="mt-6 sm:mt-8 mb-1">
          <span className="font-mono font-extrabold text-xl sm:text-3xl text-amber-300 tracking-wide drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            {timeLeft.days.toLocaleString()} days remaining
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide mb-6 sm:mb-8">
          Your future self is waiting.
        </p>

        {/* 4-Column Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-md w-full mb-6 sm:mb-8">
          <div className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-vault-950/90 border border-slate-800 shadow-inner">
            <span className="font-mono font-bold text-lg sm:text-2xl text-slate-100">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
              Days
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-vault-950/90 border border-slate-800 shadow-inner">
            <span className="font-mono font-bold text-lg sm:text-2xl text-slate-100">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
              Hours
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-vault-950/90 border border-slate-800 shadow-inner">
            <span className="font-mono font-bold text-lg sm:text-2xl text-slate-100">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
              Mins
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-vault-950/90 border border-slate-800 shadow-inner">
            <span className="font-mono font-bold text-lg sm:text-2xl text-amber-400">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
              Secs
            </span>
          </div>
        </div>

        {/* Sealed Summary */}
        <div className="w-full max-w-sm p-3 rounded-xl bg-vault-950/60 border border-slate-800/80 mb-6 sm:mb-8 flex items-center justify-around text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400/80" />
            <span>{capsule.photoCount || 0} Sealed Photo{capsule.photoCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
            <span>1 Future Letter</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-800/80 pt-5 flex flex-col items-center">
          
          {/* Subtle Early Unlock Trigger */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="italic">Can't wait?</span>
            <button
              onClick={onUnlockEarlyClick}
              className="group inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-amber-400 underline decoration-slate-700 hover:decoration-amber-400 underline-offset-4 transition-colors py-1 px-2"
            >
              <span>Unlock early</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1.5">
            Requires your secret early-unlock password.
          </p>
        </div>

      </div>
    </div>
  );
}
