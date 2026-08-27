import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Rate limiting store for password attempts: { [capsuleId_ip]: { attempts: number, lockUntil: number, lastAttempt: number } }
const attemptTracker = new Map();

// Helper to pre-hash demo passwords
const hashPasswordSync = (plain) => bcrypt.hashSync(plain, 10);

// Pre-seeded Demo Capsules
// 1. "College Days" -> SEALED, unlocks in ~3 years (August 27, 2029) - 1,095 days remaining
// 2. "Kyoto Autumn Journey" -> UNLOCKED (Scheduled unlock date in past: October 15, 2024)
// 3. "Letters to My 25-Year-Old Self" -> UNLOCKED EARLY (Unlocked early on August 27, 2026)
let capsules = [
  {
    id: "college-days-2026",
    title: "College Days",
    tagline: "Late night coding sessions, campus sunsets & lifelong friendships",
    creatorName: "Alex Turner",
    recipientName: "Future Alex (Class of '26)",
    createdAt: "2026-08-27T10:00:00.000Z",
    // 3 years from now (August 27, 2029)
    unlockDate: "2029-08-27T10:00:00.000Z",
    unlockedEarly: false,
    unlockedAt: null,
    earlyUnlockPasswordHash: hashPasswordSync("almamater2026"),
    earlyUnlockHint: "Our favorite coffee shop near the engineering quad (all lowercase + year)",
    themeColor: "amber",
    message: `Dear Future Alex,

If you are reading this, you either waited all 3 years until August 2029, or you gave in to curiosity and unlocked this vault early!

Remember where you were on August 27, 2026:
- You were grinding on Day 7 of #ProjectGetHired.
- Living on black coffee, cold brew, and sheer optimism.
- Building projects that you hoped would someday impact millions.
- Spending Friday nights with the campus crew on the library terrace debating AI and philosophy.

Never forget why you started. Are you still building with the same hunger? Have you traveled to Kashmir yet? Did you stay in touch with Jordan and Maya?

Take a deep breath. You made it through every single exam, every frantic deployment, and every uncertain night. Be proud of the journey.

With love and nostalgia,
Your 2026 Self.`,
    photos: [
      {
        id: "p1",
        caption: "Library Terrace Study Session — Final year capstone project launch night",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2026-08-27T10:00:00.000Z"
      },
      {
        id: "p2",
        caption: "Campus Golden Hour with the engineering gang",
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2026-08-27T10:05:00.000Z"
      },
      {
        id: "p3",
        caption: "First hackathon trophy! 36 hours without sleep",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2026-08-27T10:10:00.000Z"
      },
      {
        id: "p4",
        caption: "Graduation cap toss rehearsals in the quad",
        url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2026-08-27T10:15:00.000Z"
      }
    ]
  },
  {
    id: "kyoto-autumn-2024",
    title: "Kyoto Autumn Journey",
    tagline: "Golden leaves, misty shrines & matcha tea rituals",
    creatorName: "Sophia Chen",
    recipientName: "Sophia & Marcus",
    createdAt: "2023-10-15T08:00:00.000Z",
    // In the past - Normal scheduled unlock
    unlockDate: "2024-10-15T08:00:00.000Z",
    unlockedEarly: false,
    unlockedAt: "2024-10-15T08:00:00.000Z",
    earlyUnlockPasswordHash: hashPasswordSync("sakura2024"),
    earlyUnlockHint: "Favorite blossom",
    themeColor: "emerald",
    message: `Hello Sophia! 

It's been exactly one year since our misty morning walk through Fushimi Inari and Arashiyama bamboo forest.

Remember the little soba shop where the elderly chef showed us how they grind buckwheat by hand? Remember how quiet Gion felt at midnight when the rain started falling?

Cherish these days. Keep wandering.`,
    photos: [
      {
        id: "k1",
        caption: "Torii gates at sunrise before the crowds",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2023-10-15T08:00:00.000Z"
      },
      {
        id: "k2",
        caption: "Maple foliage reflections in Kinkaku-ji pond",
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2023-10-15T08:00:00.000Z"
      }
    ]
  },
  {
    id: "letters-to-25",
    title: "Secret Notes to My 25-Year-Old Self",
    tagline: "Career milestones, unspoken hopes & polaroids",
    creatorName: "David Kim",
    recipientName: "David at 25",
    createdAt: "2025-01-01T00:00:00.000Z",
    unlockDate: "2028-01-01T00:00:00.000Z",
    unlockedEarly: true,
    unlockedAt: "2026-08-27T18:00:00.000Z", // Unlocked early on August 27, 2026
    earlyUnlockPasswordHash: hashPasswordSync("dare2dream"),
    earlyUnlockHint: "My personal motto",
    themeColor: "purple",
    message: `Hey David,

You unlocked this early on August 27, 2026 because you couldn't resist checking what you wrote during that chilly New Year's eve in 2025.

You wrote about wanting to start your own design studio and buy a vintage motorcycle. Even though you opened this before 2028, keep that fire burning!`,
    photos: [
      {
        id: "d1",
        caption: "First day at the new studio setup",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        uploadedAt: "2025-01-01T00:00:00.000Z"
      }
    ]
  }
];

// Helper to determine status dynamically based on current server time
export function getCapsuleStatus(capsule) {
  if (capsule.unlockedEarly) {
    return 'UNLOCKED_EARLY';
  }
  const now = new Date();
  const unlockTime = new Date(capsule.unlockDate);
  if (now >= unlockTime) {
    return 'UNLOCKED';
  }
  return 'SEALED';
}

// Sanitizer: Protects sealed capsules from leaking confidential message or photos to client
export function sanitizeCapsule(capsule) {
  const status = getCapsuleStatus(capsule);
  const isUnlocked = status === 'UNLOCKED' || status === 'UNLOCKED_EARLY';

  const base = {
    id: capsule.id,
    title: capsule.title,
    tagline: capsule.tagline || '',
    creatorName: capsule.creatorName,
    recipientName: capsule.recipientName,
    createdAt: capsule.createdAt,
    unlockDate: capsule.unlockDate,
    status: status,
    unlockedAt: capsule.unlockedAt,
    themeColor: capsule.themeColor || 'amber',
    hasEarlyUnlockPassword: Boolean(capsule.earlyUnlockPasswordHash),
    earlyUnlockHint: capsule.earlyUnlockHint || null,
    photoCount: capsule.photos ? capsule.photos.length : 0,
  };

  if (isUnlocked) {
    return {
      ...base,
      message: capsule.message,
      photos: capsule.photos.map(p => ({
        id: p.id,
        caption: p.caption,
        // Secure image access via backend streaming endpoint or external source
        url: p.localPath ? `/api/capsules/${capsule.id}/photos/${p.id}` : p.url,
        uploadedAt: p.uploadedAt
      }))
    };
  }

  // When SEALED: Strict Zero-Knowledge Payload (No message, no photos, no passwords)
  return {
    ...base,
    message: null,
    photos: []
  };
}

export function getAllCapsules() {
  return capsules.map(sanitizeCapsule);
}

export function getCapsuleById(id, raw = false) {
  const cap = capsules.find(c => c.id === id);
  if (!cap) return null;
  return raw ? cap : sanitizeCapsule(cap);
}

export function createCapsule({ title, tagline, creatorName, recipientName, unlockDate, message, earlyUnlockPassword, earlyUnlockHint, themeColor, uploadedFiles = [] }) {
  const id = `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  let passwordHash = null;
  if (earlyUnlockPassword && earlyUnlockPassword.trim().length > 0) {
    passwordHash = bcrypt.hashSync(earlyUnlockPassword.trim(), 10);
  }

  const photos = uploadedFiles.map((file, idx) => ({
    id: `photo-${idx + 1}-${Date.now()}`,
    caption: file.originalname.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
    filename: file.filename,
    localPath: file.path,
    mimeType: file.mimetype,
    uploadedAt: new Date().toISOString()
  }));

  const newCapsule = {
    id,
    title: title.trim(),
    tagline: tagline ? tagline.trim() : "Memories sealed in time",
    creatorName: creatorName ? creatorName.trim() : "Anonymous Chrononaut",
    recipientName: recipientName ? recipientName.trim() : "Future Me",
    createdAt: new Date().toISOString(),
    unlockDate: new Date(unlockDate).toISOString(),
    unlockedEarly: false,
    unlockedAt: null,
    earlyUnlockPasswordHash: passwordHash,
    earlyUnlockHint: earlyUnlockHint ? earlyUnlockHint.trim() : null,
    themeColor: themeColor || "amber",
    message: message.trim(),
    photos
  };

  capsules.unshift(newCapsule);
  return sanitizeCapsule(newCapsule);
}

export function verifyAndUnlockEarly(capsuleId, password, clientIp = 'global') {
  const capsule = capsules.find(c => c.id === capsuleId);
  if (!capsule) {
    return { success: false, error: "Capsule not found", code: 404 };
  }

  const status = getCapsuleStatus(capsule);
  if (status !== 'SEALED') {
    return { 
      success: true, 
      alreadyUnlocked: true, 
      capsule: sanitizeCapsule(capsule),
      message: "Capsule is already unlocked" 
    };
  }

  if (!capsule.earlyUnlockPasswordHash) {
    return { success: false, error: "This capsule does not have an early unlock password configured.", code: 400 };
  }

  // Rate Limiter logic: max 5 failed attempts per 15 minutes
  const trackerKey = `${capsuleId}_${clientIp}`;
  const now = Date.now();
  const attemptInfo = attemptTracker.get(trackerKey) || { attempts: 0, lockUntil: 0, lastAttempt: now };

  if (attemptInfo.lockUntil && now < attemptInfo.lockUntil) {
    const minutesLeft = Math.ceil((attemptInfo.lockUntil - now) / 60000);
    return {
      success: false,
      error: `Too many failed attempts. Vault locked for security. Please wait ${minutesLeft} minute(s) before trying again.`,
      code: 429,
      lockUntil: attemptInfo.lockUntil
    };
  }

  const isMatch = bcrypt.compareSync(password, capsule.earlyUnlockPasswordHash);

  if (!isMatch) {
    attemptInfo.attempts += 1;
    attemptInfo.lastAttempt = now;
    const remainingAttempts = Math.max(0, 5 - attemptInfo.attempts);

    if (attemptInfo.attempts >= 5) {
      attemptInfo.lockUntil = now + (15 * 60 * 1000); // 15 minutes lockout
      attemptTracker.set(trackerKey, attemptInfo);
      return {
        success: false,
        error: "Incorrect password. Max attempts exceeded. Vault locked for 15 minutes.",
        code: 429,
        remainingAttempts: 0,
        lockUntil: attemptInfo.lockUntil
      };
    }

    attemptTracker.set(trackerKey, attemptInfo);
    return {
      success: false,
      error: `Incorrect early-unlock password. ${remainingAttempts} attempt(s) remaining before temporary lockout.`,
      code: 401,
      remainingAttempts
    };
  }

  // Password correct! Transition status
  attemptTracker.delete(trackerKey); // reset attempts on success
  capsule.unlockedEarly = true;
  capsule.unlockedAt = new Date().toISOString();

  return {
    success: true,
    capsule: sanitizeCapsule(capsule)
  };
}

export function getPhotoFile(capsuleId, photoId) {
  const capsule = capsules.find(c => c.id === capsuleId);
  if (!capsule) return null;

  const status = getCapsuleStatus(capsule);
  if (status === 'SEALED') {
    return { error: 'SEALED_VAULT', message: 'Photos remain encrypted until unlock date or early password authorization.' };
  }

  const photo = capsule.photos?.find(p => p.id === photoId);
  if (!photo) return null;

  if (photo.localPath && fs.existsSync(photo.localPath)) {
    return { filePath: photo.localPath, mimeType: photo.mimeType || 'image/jpeg' };
  }

  return { externalUrl: photo.url };
}
