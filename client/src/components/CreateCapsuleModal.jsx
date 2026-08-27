import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Calendar, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  Info, 
  Loader2, 
  Check, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { createNewCapsule } from '../services/api';

export default function CreateCapsuleModal({ isOpen, onClose, onCapsuleCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [message, setMessage] = useState('');
  const [earlyUnlockPassword, setEarlyUnlockPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [earlyUnlockHint, setEarlyUnlockHint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  if (!isOpen) return null;

  // Preset Date Helpers
  const setPresetDate = (yearsToAdd, monthsToAdd = 0) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearsToAdd);
    d.setMonth(d.getMonth() + monthsToAdd);
    setUnlockDate(d.toISOString().split('T')[0]);
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedPhotos((prev) => [...prev, ...files]);

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give your capsule a title.');
      setStep(1);
      return;
    }
    if (!unlockDate) {
      setErrorMsg('Please select an unlock date.');
      setStep(2);
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a letter to your future self.');
      setStep(3);
      return;
    }
    if (earlyUnlockPassword && earlyUnlockPassword !== confirmPassword) {
      setErrorMsg('Early unlock passwords do not match.');
      setStep(5);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('tagline', tagline.trim());
      formData.append('creatorName', creatorName.trim() || 'Anonymous');
      formData.append('recipientName', recipientName.trim() || 'Future Me');
      formData.append('unlockDate', new Date(unlockDate).toISOString());
      formData.append('message', message.trim());
      formData.append('earlyUnlockPassword', earlyUnlockPassword.trim());
      formData.append('earlyUnlockHint', earlyUnlockHint.trim());

      selectedPhotos.forEach((file) => {
        formData.append('photos', file);
      });

      const newCapsule = await createNewCapsule(formData);
      onCapsuleCreated(newCapsule);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to seal capsule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col relative rounded-3xl bg-gradient-to-b from-vault-900 via-vault-850 to-vault-950 border border-slate-700 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-100">
                Seal a New Time Capsule
              </h3>
              <p className="text-xs text-slate-400">
                Preserve private memories & photos for the future
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="px-6 py-3 bg-vault-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          {[
            { n: 1, label: 'Details' },
            { n: 2, label: 'Unlock Date' },
            { n: 3, label: 'Letter' },
            { n: 4, label: 'Photos' },
            { n: 5, label: 'Secret Key' }
          ].map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                step === s.n ? 'text-amber-400 font-bold' : step > s.n ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === s.n ? 'bg-amber-400 text-vault-950 font-black' : step > s.n ? 'bg-emerald-500/20 text-emerald-300' : 'bg-vault-800 text-slate-400'
              }`}>
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Capsule Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. College Days, Trip to Mountains, Letter to Me at 30"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Memories from our golden semester"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Your Name (Creator)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Turner"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Recipient (Future Self / Friend)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Future Alex"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Unlock Date */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Unlock Date *
                </label>
                <input
                  type="date"
                  value={unlockDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-xs text-slate-400 mb-2">Quick Duration Presets:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetDate(0, 6)}
                    className="py-2.5 px-3 rounded-xl bg-vault-800 hover:bg-vault-700 border border-slate-700 text-xs text-slate-200 font-semibold"
                  >
                    +6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(1)}
                    className="py-2.5 px-3 rounded-xl bg-vault-800 hover:bg-vault-700 border border-slate-700 text-xs text-slate-200 font-semibold"
                  >
                    +1 Year
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(3)}
                    className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 font-semibold"
                  >
                    +3 Years (1,095d)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetDate(5)}
                    className="py-2.5 px-3 rounded-xl bg-vault-800 hover:bg-vault-700 border border-slate-700 text-xs text-slate-200 font-semibold"
                  >
                    +5 Years
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Letter */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Letter to Your Future Self *
                </label>
                <span className="text-[11px] text-amber-400/80 italic">
                  Will remain hidden until unlocked
                </span>
              </div>
              <textarea
                rows={7}
                placeholder="Dear Future Me,&#10;&#10;As I write this today, here is what is happening in my life, what I'm hoping for, and what I want you to remember..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-vault-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 leading-relaxed font-serif"
              />
            </div>
          )}

          {/* STEP 4: Photos */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Attach Photo Memories (Optional)
                </label>
                <span className="text-[11px] text-slate-400">
                  {selectedPhotos.length} selected
                </span>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-vault-950/40 hover:bg-vault-950 transition-colors">
                <UploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  Click to upload photos
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP (Time-gated securely)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>

              {/* Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-vault-950 border border-slate-700 group">
                      <img src={url} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Early Unlock Password */}
          {step === 5 && (
            <div className="space-y-4">
              {/* Explanatory Quote matching user prompt */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm leading-relaxed">
                <p className="font-semibold mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Early Unlock Password</span>
                </p>
                <blockquote className="italic text-slate-300 border-l-2 border-amber-400 pl-2 mt-2">
                  “You can choose to wait until your unlock date — or use your secret password to open the capsule early.”
                </blockquote>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Create Secret Early-Unlock Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter a secret password"
                    value={earlyUnlockPassword}
                    onChange={(e) => setEarlyUnlockPassword(e.target.value)}
                    className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password Hint (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Favorite cafe near dorm"
                  value={earlyUnlockHint}
                  onChange={(e) => setEarlyUnlockHint(e.target.value)}
                  className="w-full bg-vault-950 border border-slate-700 rounded-xl py-3 px-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Password will be securely hashed with bcrypt server-side. Never stored in plaintext.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-vault-950/80 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="py-2.5 px-4 rounded-xl bg-vault-800 hover:bg-vault-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setStep(step + 1);
              }}
              className="py-2.5 px-5 rounded-xl bg-vault-700 hover:bg-vault-600 text-slate-100 font-bold text-xs transition-colors"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-vault-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sealing Vault...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>SEAL TIME CAPSULE 🔒</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
