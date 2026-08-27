import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertTriangle, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';

export default function EarlyUnlockModal({
  capsule,
  isOpen,
  onClose,
  onUnlockSuccess
}) {
  const [step, setStep] = useState(1); // 1 = Emotional Confirmation, 2 = Password Entry
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
      // Parent handles closing and triggering cinematic reveal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Card */}
      <div 
        className="w-full max-w-md relative rounded-3xl bg-gradient-to-b from-vault-900 via-vault-850 to-vault-950 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-vault-800/80 hover:bg-vault-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: Are you sure? (Emotional Confirmation) */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5 text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-black text-2xl text-slate-100 mb-2">
              Are you sure?
            </h3>

            <p className="font-semibold text-amber-300 text-sm mb-3">
              These memories were meant for your future self.
            </p>

            <div className="bg-vault-950/70 border border-slate-800 rounded-2xl p-4 mb-6 text-xs text-slate-400 leading-relaxed text-left space-y-2">
              <p>
                Your capsule isn't ready yet.
              </p>
              <p>
                If you continue, you'll permanently unlock it early. The countdown will stop, and the moment of opening will become part of its permanent history.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 px-4 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700/60"
              >
                Go back
              </button>
              <button
                type="button"
                onClick={handleGoToPasswordStep}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/20 transition-all"
              >
                Unlock with password
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Password Entry & Server-Side Verification */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
              <KeyRound className="w-7 h-7" />
            </div>

            <h3 className="font-serif font-black text-xl text-slate-100 mb-1">
              Enter your early-unlock password
            </h3>
            
            <p className="text-xs text-slate-400 mb-5">
              Provide the secret key you established when sealing this capsule.
            </p>

            {capsule.earlyUnlockHint && (
              <div className="w-full mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-left text-xs text-amber-300">
                <span className="font-semibold">💡 Password Hint:</span> {capsule.earlyUnlockHint}
              </div>
            )}

            {/* Error & Rate limit feedback */}
            {errorMsg && (
              <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left">
                <p className="font-semibold">{errorMsg}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="mt-1 text-[11px] text-rose-400/80">
                    Remaining attempts: {remainingAttempts} / 5
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitPassword} className="w-full space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoFocus
                  className="w-full bg-vault-950 border border-slate-700 focus:border-amber-400 rounded-xl py-3 px-4 text-center font-mono text-lg tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="py-3 px-4 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-300 font-semibold text-xs sm:text-sm transition-colors border border-slate-700/60"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>UNLOCK EARLY 🔓</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Passwords securely verified on server with bcrypt</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
