// API Client with automatic fallback for static deployments
const API_BASE = '/api/capsules';

// Pre-seeded fallback data if API is deployed in pure static mode
const FALLBACK_SEED = [
  {
    id: "college-days-2026",
    title: "College Days",
    tagline: "Late night coding sessions, campus sunsets & lifelong friendships",
    creatorName: "Alex Turner",
    recipientName: "Future Alex (Class of '26)",
    createdAt: "2026-08-27T10:00:00.000Z",
    unlockDate: "2029-08-27T10:00:00.000Z",
    status: "SEALED",
    unlockedAt: null,
    hasEarlyUnlockPassword: true,
    earlyUnlockHint: "Our favorite coffee shop near the engineering quad (all lowercase + year)",
    photoCount: 4,
    secretPassword: "almamater2026",
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
    unlockDate: "2024-10-15T08:00:00.000Z",
    status: "UNLOCKED",
    unlockedAt: "2024-10-15T08:00:00.000Z",
    hasEarlyUnlockPassword: true,
    earlyUnlockHint: "Favorite blossom",
    photoCount: 2,
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
    status: "UNLOCKED_EARLY",
    unlockedAt: "2026-08-27T18:00:00.000Z",
    hasEarlyUnlockPassword: true,
    earlyUnlockHint: "My personal motto",
    photoCount: 1,
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

function getLocalStore() {
  const stored = localStorage.getItem('chronovault_capsules');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
  }
  return FALLBACK_SEED;
}

function saveLocalStore(capsules) {
  localStorage.setItem('chronovault_capsules', JSON.stringify(capsules));
}

function sanitizeLocal(capsule) {
  const isUnlocked = capsule.status === 'UNLOCKED' || capsule.status === 'UNLOCKED_EARLY';
  return {
    id: capsule.id,
    title: capsule.title,
    tagline: capsule.tagline,
    creatorName: capsule.creatorName,
    recipientName: capsule.recipientName,
    createdAt: capsule.createdAt,
    unlockDate: capsule.unlockDate,
    status: capsule.status,
    unlockedAt: capsule.unlockedAt,
    hasEarlyUnlockPassword: capsule.hasEarlyUnlockPassword,
    earlyUnlockHint: capsule.earlyUnlockHint,
    photoCount: capsule.photos ? capsule.photos.length : 0,
    message: isUnlocked ? capsule.message : null,
    photos: isUnlocked ? (capsule.photos || []) : []
  };
}

export async function fetchAllCapsules() {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.capsules) {
        return data.capsules;
      }
    }
  } catch (err) {
    // API not reachable -> use fallback store
  }

  const list = getLocalStore();
  return list.map(sanitizeLocal);
}

export async function fetchCapsuleById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.capsule) {
        return data.capsule;
      }
    }
  } catch (err) {
    // Fallback
  }

  const list = getLocalStore();
  const cap = list.find(c => c.id === id);
  if (!cap) throw new Error('Capsule not found');
  return sanitizeLocal(cap);
}

export async function unlockCapsuleEarly(id, password) {
  try {
    const res = await fetch(`${API_BASE}/${id}/unlock-early`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.capsule) {
        return data.capsule;
      }
    } else {
      const data = await res.json();
      const err = new Error(data.error || 'Incorrect early-unlock password');
      err.remainingAttempts = data.remainingAttempts;
      throw err;
    }
  } catch (err) {
    if (err.message && err.message.includes('password')) {
      throw err;
    }
    // Offline / static fallback verification
    const list = getLocalStore();
    const cap = list.find(c => c.id === id);
    if (!cap) throw new Error('Capsule not found');

    if (cap.secretPassword && cap.secretPassword !== password.trim()) {
      throw new Error('Incorrect early-unlock password. Please check your hint and try again.');
    }

    cap.status = 'UNLOCKED_EARLY';
    cap.unlockedAt = new Date().toISOString();
    saveLocalStore(list);
    return sanitizeLocal(cap);
  }
}

export async function createNewCapsule(formData) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.capsule) {
        return data.capsule;
      }
    }
  } catch (err) {
    // Offline / static fallback
  }

  const title = formData.get('title') || 'Untitled Capsule';
  const tagline = formData.get('tagline') || '';
  const creatorName = formData.get('creatorName') || 'Anonymous';
  const recipientName = formData.get('recipientName') || 'Future Me';
  const unlockDate = formData.get('unlockDate') || new Date(Date.now() + 86400000 * 365).toISOString();
  const message = formData.get('message') || '';
  const earlyUnlockPassword = formData.get('earlyUnlockPassword') || '';
  const earlyUnlockHint = formData.get('earlyUnlockHint') || '';

  const newCap = {
    id: `capsule-${Date.now()}`,
    title,
    tagline,
    creatorName,
    recipientName,
    createdAt: new Date().toISOString(),
    unlockDate: new Date(unlockDate).toISOString(),
    status: 'SEALED',
    unlockedAt: null,
    hasEarlyUnlockPassword: Boolean(earlyUnlockPassword),
    earlyUnlockHint,
    secretPassword: earlyUnlockPassword,
    message,
    photos: []
  };

  const list = getLocalStore();
  list.unshift(newCap);
  saveLocalStore(list);
  return sanitizeLocal(newCap);
}
