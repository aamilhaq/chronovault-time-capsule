import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import SealedCapsuleView from './components/SealedCapsuleView';
import UnlockedCapsuleView from './components/UnlockedCapsuleView';
import EarlyUnlockModal from './components/EarlyUnlockModal';
import CinematicUnlockReveal from './components/CinematicUnlockReveal';
import CreateCapsuleModal from './components/CreateCapsuleModal';
import { fetchAllCapsules, fetchCapsuleById, unlockCapsuleEarly } from './services/api';
import { Loader2, Sparkles, Shield, Lock, Zap, Clock, Info } from 'lucide-react';

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

  // Ambient Nostalgia Audio Synthesizer (Soft harmonic celestial chords)
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
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
        masterGain.connect(ctx.destination);
        oscillatorGainRef.current = masterGain;

        // Frequencies for a warm celestial suspended chord (F# - C# - A# - G#)
        const freqs = [185.00, 277.18, 370.00, 466.16];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle LFO modulation for cosmic drift
          const lfo = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfo.frequency.value = 0.15 + (idx * 0.05);
          lfoGain.gain.value = 3;
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
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navigation */}
      <Navbar
        capsules={capsules}
        selectedCapsuleId={selectedCapsuleId}
        onSelectCapsule={handleSelectCapsule}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={toggleAmbientAudio}
      />

      {/* Demo State Switcher Bar */}
      <div className="bg-vault-900/60 border-b border-slate-800/80 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Quick Test Vaults:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {capsules.map(cap => (
              <button
                key={cap.id}
                onClick={() => handleSelectCapsule(cap.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                  selectedCapsuleId === cap.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-vault-850 hover:bg-vault-800 text-slate-400 border border-slate-700/50'
                }`}
              >
                <span>
                  {cap.status === 'SEALED' ? '🔒 SEALED (1,095d)' : cap.status === 'UNLOCKED_EARLY' ? '⚡ UNLOCKED EARLY' : '🌟 UNLOCKED'}
                </span>
                <span className="font-sans font-medium text-slate-300 max-w-[100px] truncate">{cap.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center py-6 px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            <p className="font-mono text-xs text-slate-400 tracking-wider uppercase">
              Accessing Temporal Vault...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-vault-900 border border-rose-500/30 text-center max-w-md">
            <Shield className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-100">Vault Access Error</h3>
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
      <footer className="w-full border-t border-slate-800/80 bg-vault-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-400">ChronoVault</span>
            <span>• Day 7 #ProjectGetHired</span>
          </div>
          <p className="text-[11px]">
            Zero-Knowledge sealed storage • Server-verified password encryption • Time-gated media streaming
          </p>
        </div>
      </footer>

      {/* Early Unlock Modal (2-Step emotional confirmation + bcrypt verification) */}
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
