import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertTriangle, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function EarlyUnlockModal({
  capsule,
  isOpen,
  onClose,
  onUnlockSuccess
}) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(null);

  if (!isOpen || !capsule) return null;

  const handleResetAndClose = () => {
    setStep(1);
    setPassword('');
    setErrorMsg('');
    setRemainingAttempts(null);
    onClose();
  };

  const handleGoToPasswordStep = () => {
    setErrorMsg('');
    setStep(2);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your early-unlock password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await onUnlockSuccess(capsule.id, password);
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect password. Please try again.');
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div 
        className="w-full max-w-md max-h-[92vh] overflow-y-auto relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-vault-900 via-vault-850 to-vault-950 border border-slate-700/80 shadow-2xl p-5 sm:p-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-vault-800/80 hover:bg-vault-700 text-slate-400 hover:text-slate-200 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: Emotional Confirmation */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-100 mb-1.5">
              Are you sure?
            </h3>

            <p className="font-semibold text-amber-300 text-xs sm:text-sm mb-3">
              These memories were meant for your future self.
            </p>

            <div className="bg-vault-950/80 border border-slate-800 rounded-xl p-3.5 sm:p-4 mb-5 text-xs text-slate-400 leading-relaxed text-left space-y-2">
              <p className="font-medium text-slate-300">
                Your capsule isn't ready yet.
              </p>
              <p>
                If you continue, you'll permanently unlock it early. The countdown will stop, and the moment of opening will become part of its permanent history.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-2.5 sm:py-3 px-3 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={handleGoToPasswordStep}
                className="py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-md transition-all truncate"
              >
                Unlock with password
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Password Entry */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center pt-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h3 className="font-serif font-black text-lg sm:text-xl text-slate-100 mb-1">
              Enter your early-unlock password
            </h3>
            
            <p className="text-xs text-slate-400 mb-4">
              Provide the secret key you established when sealing this capsule.
            </p>

            {capsule.earlyUnlockHint && (
              <div className="w-full mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-left text-xs text-amber-300">
                <span className="font-semibold">💡 Hint:</span> {capsule.earlyUnlockHint}
              </div>
            )}

            {errorMsg && (
              <div className="w-full mb-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
                <p className="font-semibold">{errorMsg}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="mt-1 text-[11px] text-rose-400/80">
                    Remaining attempts: {remainingAttempts} / 5
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitPassword} className="w-full space-y-3.5">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                  className="w-full bg-vault-950 border border-slate-700 focus:border-amber-400 rounded-xl py-3 px-4 text-center font-mono text-base sm:text-lg tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="py-2.5 sm:py-3 px-3 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors border border-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <span>UNLOCK EARLY 🔓</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-3.5 flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Verified server-side with bcrypt</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
