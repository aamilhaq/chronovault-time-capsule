import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Share2, 
  Maximize2, 
  X, 
  CheckCircle2, 
  Zap, 
  Heart,
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
      month: 'long',
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12">
      {/* Top Status & Commemoration Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-vault-900 via-vault-850 to-vault-950 border border-slate-700/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Subtle Ambient Backing */}
        {isEarlyUnlock ? (
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        ) : (
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Status Pill matching specification */}
            {isEarlyUnlock ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>UNLOCKED EARLY</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>UNLOCKED</span>
              </div>
            )}

            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-slate-100 tracking-tight">
              {capsule.title}
            </h1>

            {/* Status description */}
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              {isEarlyUnlock 
                ? "Opened before the scheduled date." 
                : "The waiting is over."}
            </p>

            {/* Clear date announcement */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 pt-1">
              <span className="font-semibold text-amber-400">
                {isEarlyUnlock ? `Unlocked early on ${unlockedDate}` : `Unlocked on ${unlockedDate}`}
              </span>
              <span className="text-slate-600">•</span>
              <span>Originally scheduled for {scheduledDate}</span>
              <span className="text-slate-600">•</span>
              <span>Created {createdDate}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-vault-800 hover:bg-vault-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Vault'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Letter to Future Self */}
      {capsule.message && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-100">
              Letter to Future Self
            </h2>
          </div>

          {/* Vintage Textured Paper Card */}
          <div className="vintage-letter rounded-3xl p-6 sm:p-12 text-slate-900 relative overflow-hidden transition-transform duration-300 hover:shadow-2xl">
            {/* Wax Seal Stamp in corner */}
            <div className="absolute top-6 right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-800 border-2 border-red-950 flex items-center justify-center text-red-100 font-serif font-black shadow-lg shadow-red-950/40 rotate-6 select-none">
              <div className="w-10 h-10 rounded-full border border-dashed border-red-400/50 flex items-center justify-center text-[10px] uppercase text-center leading-tight">
                SEALED<br/>2026
              </div>
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-amber-900/70 mb-4 pb-2 border-b border-amber-900/20">
              From: {capsule.creatorName || "Past Self"} → To: {capsule.recipientName || "Future Self"}
            </div>

            {/* Letter Body */}
            <div className="whitespace-pre-line text-sm sm:text-base md:text-lg font-serif leading-relaxed text-slate-900 max-w-3xl">
              {capsule.message}
            </div>

            <div className="mt-8 pt-4 border-t border-amber-900/20 flex items-center justify-between text-xs font-handwriting text-2xl text-amber-950">
              <span>With love, {capsule.creatorName || "Past Self"}</span>
              <span className="text-sm font-sans text-amber-900/60">Sealed in ChronoVault</span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Memory Photo Gallery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-100">
              Photo Memories ({capsule.photos?.length || 0})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {capsule.photos?.length ? 'Click any photo to enlarge' : 'No photos attached'}
          </span>
        </div>

        {capsule.photos && capsule.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capsule.photos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative rounded-2xl bg-vault-900 border border-slate-800 overflow-hidden shadow-md hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Photo Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-vault-950">
                  <img
                    src={photo.url}
                    alt={photo.caption || `Memory ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                    <span className="p-2 rounded-xl bg-vault-900/90 text-amber-400 shadow-md">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Caption Card */}
                {photo.caption && (
                  <div className="p-4 bg-vault-900/90 border-t border-slate-800/80 flex-1 flex items-center">
                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-vault-900/50 border border-dashed border-slate-800 text-slate-500">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No photos were added to this time capsule.</p>
          </div>
        )}
      </section>

      {/* Lightbox Zoom Modal */}
      {selectedPhotoIndex !== null && capsule.photos && capsule.photos[selectedPhotoIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-vault-800/80 hover:bg-vault-700 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden max-h-[75vh] w-full bg-vault-950 flex items-center justify-center border border-slate-700">
              <img
                src={capsule.photos[selectedPhotoIndex].url}
                alt={capsule.photos[selectedPhotoIndex].caption}
                className="max-h-[75vh] w-auto object-contain rounded-2xl"
              />

              {/* Prev / Next controls */}
              {selectedPhotoIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(selectedPhotoIndex - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-vault-900/80 hover:bg-vault-800 text-slate-200 hover:text-amber-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {selectedPhotoIndex < capsule.photos.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex(selectedPhotoIndex + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-vault-900/80 hover:bg-vault-800 text-slate-200 hover:text-amber-400"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Caption in Lightbox */}
            {capsule.photos[selectedPhotoIndex].caption && (
              <div className="mt-4 p-4 rounded-xl bg-vault-900/90 border border-slate-800 text-center max-w-xl text-sm text-slate-200">
                {capsule.photos[selectedPhotoIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
