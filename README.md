# 🔒 ChronoVault — Personal Digital Time Capsule (Day 7)

> **Day 7 of #ProjectGetHired 🚀 | Personal Digital Time Capsule with Dual Unlocking System (Scheduled auto-unlock & server-verified hashed early unlock), 2-step emotional confirmation, cinematic reveal screen, and zero-knowledge time-gated media gallery built with React, Node.js, Express & Tailwind CSS**

---

## ✨ Overview

**ChronoVault** is a personal digital time capsule platform designed to preserve letters, memories, and photos for the future with strict time-gating security and a dual unlocking architecture:

1. **Normal Unlock (Time-Gated)**:
   - The capsule automatically unlocks when the scheduled target date arrives (`Date.now() >= unlockDate`).
   - While sealed, photos and letters are strictly inaccessible.
2. **Early Unlock (Secret Password)**:
   - Created during capsule sealing with clear explanation: *“You can choose to wait until your unlock date — or use your secret password to open the capsule early.”*
   - Intentionally less prominent secondary option: *“Can't wait? Unlock early →”*
   - 2-Step emotional confirmation modal (*“Are you sure? These memories were meant for your future self...”*)
   - Server-side salted & hashed password verification (`bcryptjs`) with rate limiting and lockout protection.
   - Meaningful cinematic reveal screen:
     - **“You couldn't wait, huh? 👀”**
     - **“Your memories are finally yours.”**
   - Immediate status transition to `UNLOCKED EARLY` with badge: **“Unlocked early on August 27, 2026”**.

---

## 🛡️ Security Architecture

- **Zero Client-Side Leaks**: Sealed capsules return only sanitized metadata (`title`, `creatorName`, `createdAt`, `unlockDate`, `status`, `photoCount`). The private letter and photo paths are `null` / empty array.
- **Server-Side Verification**: Passwords are never compared or stored on the client. `bcryptjs` performs salted one-way hashing on the backend.
- **Time-Gated Photo Streaming**: Direct static file access is disabled. All images are streamed through `/api/capsules/:id/photos/:photoId`, which strictly checks authorization before streaming binary data.
- **Rate-Limiting & Lockout**: Failed attempts are tracked per capsule/IP with 5-attempt limits and cooldown periods.

---

## 🏷️ Capsule Statuses

| Status | Badge | Description |
| :--- | :--- | :--- |
| **`SEALED`** | 🔒 Golden Lock | *Waiting for the future...* (Active countdown, zero media leaks, subtle early unlock option) |
| **`UNLOCKED EARLY`** | ⚡ Amber Spark | *Opened before the scheduled date.* (Displays exact unlock date and original schedule) |
| **`UNLOCKED`** | 🌟 Emerald Glow | *The waiting is over.* (Scheduled date reached, celebration mode) |

---

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 2. Start Frontend Client
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Run Security Test Suite
```bash
cd server
node test-api.js
```

---

## 📂 Pre-Seeded Demo Capsules

1. **`College Days` (SEALED)**
   - **Target**: August 27, 2029 (1,095 days remaining)
   - **Early Unlock Password**: `almamater2026`
   - **Hint**: *Our favorite coffee shop near the engineering quad*
2. **`Kyoto Autumn Journey` (UNLOCKED)**
   - **Target**: October 15, 2024 (Past scheduled date, auto-unlocked)
3. **`Secret Notes to My 25-Year-Old Self` (UNLOCKED EARLY)**
   - **Status**: Unlocked early on August 27, 2026.
