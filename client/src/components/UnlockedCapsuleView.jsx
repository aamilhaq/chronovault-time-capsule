import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  FileText, 
  Share2, 
  Maximize2, 
  X, 
  Zap, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function UnlockedCapsuleView({ capsule }) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!capsule) return null;

  const isEarlyUnlock = capsule.status === 'UNLOCKED_EARLY';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const createdDate = formatDate(capsule.createdAt);
  const scheduledDate = formatDate(capsule.unlockDate);
  const unlockedDate = formatDate(capsule.unlockedAt || new Date().toISOString());

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12">
      {/* Top Status & Commemoration Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-vault-900 via-vault-850 to-vault-950 border border-slate-700/80 p-5 sm:p-8 shadow-xl backdrop-blur-xl">
        
        {isEarlyUnlock ? (
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        ) : (
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            {/* Status Pill */}
            {isEarlyUnlock ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>UNLOCKED EARLY</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>UNLOCKED</span>
              </div>
            )}

            <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-slate-100 tracking-tight leading-snug">
              {capsule.title}
            </h1>

            {/* Status description */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isEarlyUnlock 
                ? "Opened before the scheduled date." 
                : "The waiting is over."}
            </p>

            {/* Clear date announcement */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-0.5">
              <span className="font-semibold text-amber-400">
                {isEarlyUnlock ? `Unlocked early on ${unlockedDate}` : `Unlocked on ${unlockedDate}`}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400">Target: {scheduledDate}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400">Created: {createdDate}</span>
            </div>
          </div>

          {/* Share Action */}
          <div className="flex items-center gap-2 self-start md:self-center pt-2 md:pt-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-vault-800 hover:bg-vault-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{copiedLink ? 'Copied!' : 'Share Vault'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Letter to Future Self */}
      {capsule.message && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-300 px-1">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-100">
              Letter to Future Self
            </h2>
          </div>

          {/* Vintage Textured Paper Card */}
          <div className="vintage-letter rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-slate-900 relative overflow-hidden shadow-xl">
            {/* Header row with Wax Seal */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-amber-900/20">
              <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-amber-900/80">
                From: {capsule.creatorName || "Past Self"} → To: {capsule.recipientName || "Future Self"}
              </div>

              {/* Responsive Wax Seal */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-full bg-red-800 border-2 border-red-950 flex items-center justify-center text-red-100 font-serif font-black shadow-md shadow-red-950/40 rotate-6 select-none">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-dashed border-red-400/50 flex items-center justify-center text-[8px] sm:text-[9px] uppercase text-center leading-none">
                  SEALED
                </div>
              </div>
            </div>

            {/* Letter Body */}
            <div className="whitespace-pre-line text-sm sm:text-base md:text-lg font-serif leading-relaxed text-slate-900">
              {capsule.message}
            </div>

            <div className="mt-6 pt-4 border-t border-amber-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-handwriting text-xl sm:text-2xl text-amber-950">
              <span>With love, {capsule.creatorName || "Past Self"}</span>
              <span className="text-xs font-sans text-amber-900/60">Sealed in ChronoVault</span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Memory Photo Gallery */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-300">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-100">
              Photo Memories ({capsule.photos?.length || 0})
            </h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {capsule.photos?.length ? 'Tap photo to view' : 'No photos'}
          </span>
        </div>

        {capsule.photos && capsule.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {capsule.photos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative rounded-2xl bg-vault-900 border border-slate-800 overflow-hidden shadow-md hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Photo Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-vault-950">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Memory ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2.5">
                    <span className="p-1.5 rounded-lg bg-vault-900/90 text-amber-400 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Caption */}
                {photo.caption && (
                  <div className="p-3.5 bg-vault-900/90 border-t border-slate-800/80 flex-1 flex items-center">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-vault-900/50 border border-dashed border-slate-800 text-slate-500">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-xs">No photos were added to this time capsule.</p>
          </div>
        )}
      </section>

      {/* Lightbox Zoom Modal */}
      {selectedPhotoIndex !== null && capsule.photos && capsule.photos[selectedPhotoIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-2 right-2 sm:-top-10 sm:right-0 p-2 rounded-full bg-vault-800/90 text-slate-300 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden max-h-[70vh] sm:max-h-[78vh] w-full bg-vault-950 flex items-center justify-center border border-slate-700">
              <img
                src={capsule.photos[selectedPhotoIndex].url}
                alt={capsule.photos[selectedPhotoIndex].caption}
                className="max-h-[70vh] sm:max-h-[78vh] w-auto object-contain rounded-xl"
              />

              {/* Prev / Next controls */}
              {selectedPhotoIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(selectedPhotoIndex - 1);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-vault-900/80 hover:bg-vault-800 text-slate-200"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
              {selectedPhotoIndex < capsule.photos.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(selectedPhotoIndex + 1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-vault-900/80 hover:bg-vault-800 text-slate-200"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Caption */}
            {capsule.photos[selectedPhotoIndex].caption && (
              <div className="mt-3 p-3 rounded-xl bg-vault-900/90 border border-slate-800 text-center max-w-lg text-xs sm:text-sm text-slate-200">
                {capsule.photos[selectedPhotoIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
