import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SealedCapsuleView from './components/SealedCapsuleView';
import UnlockedCapsuleView from './components/UnlockedCapsuleView';
import EarlyUnlockModal from './components/EarlyUnlockModal';
import CinematicUnlockReveal from './components/CinematicUnlockReveal';
import CreateCapsuleModal from './components/CreateCapsuleModal';
import { fetchAllCapsules, fetchCapsuleById, unlockCapsuleEarly } from './services/api';
import { Loader2, Shield, Info, Sparkles } from 'lucide-react';

export default function App() {
  const [capsules, setCapsules] = useState([]);
  const [selectedCapsuleId, setSelectedCapsuleId] = useState(null);
  const [currentCapsule, setCurrentCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Cinematic State
  const [isEarlyUnlockModalOpen, setIsEarlyUnlockModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showCinematicReveal, setShowCinematicReveal] = useState(false);

  // Ambient Audio Synthesizer (Web Audio API)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscillatorGainRef = useRef(null);

  const loadCapsules = async (targetIdToSelect = null) => {
    try {
      setLoading(true);
      const list = await fetchAllCapsules();
      setCapsules(list);

      const idToUse = targetIdToSelect || (list.length > 0 ? list[0].id : null);
      if (idToUse) {
        setSelectedCapsuleId(idToUse);
        const detailed = await fetchCapsuleById(idToUse);
        setCurrentCapsule(detailed);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load time capsules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCapsules();
  }, []);

  const handleSelectCapsule = async (id) => {
    if (id === selectedCapsuleId && currentCapsule) return;
    setSelectedCapsuleId(id);
    setLoading(true);
    try {
      const detailed = await fetchCapsuleById(id);
      setCurrentCapsule(detailed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockEarlySuccess = async (capsuleId, password) => {
    const unlocked = await unlockCapsuleEarly(capsuleId, password);
    setCurrentCapsule(unlocked);
    setIsEarlyUnlockModalOpen(false);
    
    // Trigger Cinematic Screen
    setShowCinematicReveal(true);

    // Refresh capsule list in background
    fetchAllCapsules().then(setCapsules);
  };

  const handleCapsuleCreated = (newCapsule) => {
    setCapsules(prev => [newCapsule, ...prev]);
    setSelectedCapsuleId(newCapsule.id);
    setCurrentCapsule(newCapsule);
  };

  // Ambient Nostalgia Audio Synthesizer
  const toggleAmbientAudio = () => {
    if (isAudioPlaying) {
      if (oscillatorGainRef.current) {
        oscillatorGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        const ctx = audioCtxRef.current;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.035, ctx.currentTime);
        masterGain.connect(ctx.destination);
        oscillatorGainRef.current = masterGain;

        const freqs = [185.00, 277.18, 370.00, 466.16];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.15 + (idx * 0.05);
          lfoGain.gain.value = 2.5;
          lfo.connect(osc.frequency);
          lfo.start();

          if (panner) {
            panner.pan.value = (idx % 2 === 0 ? -0.4 : 0.4);
            osc.connect(panner);
            panner.connect(masterGain);
          } else {
            osc.connect(masterGain);
          }
          osc.start();
        });

        setIsAudioPlaying(true);
      } catch (e) {
        console.warn("Audio Context init error", e);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* Top Navigation */}
      <Navbar
        capsules={capsules}
        selectedCapsuleId={selectedCapsuleId}
        onSelectCapsule={handleSelectCapsule}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAmbientAudio}
      />

      {/* Demo State Switcher Bar — Horizontal scrollable on mobile */}
      <div className="w-full bg-vault-900/70 border-b border-slate-800/80 py-2 px-3 sm:px-6 sticky top-14 sm:top-20 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0 text-xs">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-300 hidden sm:inline">Test Vaults:</span>
            <span className="font-semibold text-slate-300 sm:hidden">Vaults:</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {capsules.map(cap => (
              <button
                key={cap.id}
                onClick={() => handleSelectCapsule(cap.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  selectedCapsuleId === cap.id
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-sm font-bold'
                    : 'bg-vault-850 hover:bg-vault-800 text-slate-400 border border-slate-700/60'
                }`}
              >
                <span>
                  {cap.status === 'SEALED' ? '🔒 1,095d' : cap.status === 'UNLOCKED_EARLY' ? '⚡ Early' : '🌟 Unlocked'}
                </span>
                <span className="font-sans font-medium text-slate-200 truncate max-w-[120px] sm:max-w-none">
                  {cap.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col justify-center items-center py-4 sm:py-8 px-3 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-9 h-9 text-amber-400 animate-spin" />
            <p className="font-mono text-xs text-slate-400 tracking-wider uppercase">
              Accessing Temporal Vault...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-vault-900 border border-rose-500/30 text-center max-w-md my-8">
            <Shield className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-100">Vault Access Error</h3>
            <p className="text-xs text-slate-400 mt-2">{error}</p>
            <button
              onClick={() => loadCapsules()}
              className="mt-4 px-4 py-2 bg-vault-800 hover:bg-vault-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : currentCapsule ? (
          currentCapsule.status === 'SEALED' ? (
            <SealedCapsuleView
              capsule={currentCapsule}
              onUnlockEarlyClick={() => setIsEarlyUnlockModalOpen(true)}
            />
          ) : (
            <UnlockedCapsuleView capsule={currentCapsule} />
          )
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400">No capsules found.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-vault-950/90 py-5 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300">ChronoVault</span>
            <span>• Day 7 #ProjectGetHired</span>
          </div>
          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            Zero-Knowledge sealed storage • Server bcrypt encryption • Time-gated media
          </p>
        </div>
      </footer>

      {/* Early Unlock Modal */}
      <EarlyUnlockModal
        capsule={currentCapsule}
        isOpen={isEarlyUnlockModalOpen}
        onClose={() => setIsEarlyUnlockModalOpen(false)}
        onUnlockSuccess={handleUnlockEarlySuccess}
      />

      {/* Cinematic Reveal Sequence */}
      {showCinematicReveal && (
        <CinematicUnlockReveal
          onComplete={() => setShowCinematicReveal(false)}
        />
      )}

      {/* Create New Capsule Modal */}
      <CreateCapsuleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCapsuleCreated={handleCapsuleCreated}
      />
    </div>
  );
}
