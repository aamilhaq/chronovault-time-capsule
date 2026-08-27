<div align="center">

# 🔒 ChronoVault — Personal Digital Time Capsule

**Day 7 of #ProjectGetHired 🚀**

*A personal, atmospheric digital time capsule platform where memories are sealed until the future arrives — featuring a dual unlocking system with scheduled auto-unlock and server-hashed early unlock.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://time-capsule-red-sigma.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aamilhaq/chronovault-time-capsule)
[![License](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](LICENSE)

[**🌐 Experience Live Demo**](https://time-capsule-red-sigma.vercel.app) • [**📖 Architecture & Docs**](#-architecture--security) • [**💼 LinkedIn Post Copy**](#-day-7-linkedin-post-copy)

</div>

---

## 🌟 Key Unlocking Systems

### 1. 🔒 Normal Scheduled Unlock (`UNLOCKED`)
- Automatically becomes accessible when the scheduled unlock date arrives (`Date.now() >= unlockDate`).
- Example: **🔒 SEALED • Unlocks August 27, 2029 • 1,095 days remaining**.
- While sealed, photos, confidential letters, and passwords are zero-knowledge protected.

### 2. ⚡ Early Unlock with Secret Password (`UNLOCKED EARLY`)
- **Capsule Creation**: The creator establishes a secret password with the principle:
  > *“You can choose to wait until your unlock date — or use your secret password to open the capsule early.”*
- **Subtle UX**: A less prominent secondary trigger beneath the countdown encourages patience:
  > *Can't wait?*
  > **`Unlock early →`**
- **2-Step Emotional Confirmation Modal**:
  - **Step 1**: *“Are you sure? These memories were meant for your future self. Your capsule isn't ready yet. If you continue, you'll permanently unlock it early.”*
  - **Step 2**: *“Enter your early-unlock password”* with masked input `[ ••••••••• ]` and password hints.
- **Meaningful Cinematic Reveal**:
  - ✨ **“You couldn't wait, huh? 👀”**
  - ✨ **“Your memories are finally yours.”**
- **Permanent Commemorative Status**:
  - Badged as **`UNLOCKED EARLY`** with *"Unlocked early on August 27, 2026"*.

---

## 🏷️ Capsule Statuses

| Status | Badge | Description |
| :--- | :--- | :--- |
| **`SEALED`** | 🔒 Golden Lock | *Waiting for the future...* (Active countdown, zero media leaks, subtle early unlock option) |
| **`UNLOCKED EARLY`** | ⚡ Amber Spark | *Opened before the scheduled date.* (Displays exact unlock date and original schedule) |
| **`UNLOCKED`** | 🌟 Emerald Glow | *The waiting is over.* (Scheduled date reached, celebration mode) |

---

## 🛡️ Architecture & Security

- **Zero Client-Side Leaks**: Sealed capsules return `message: null` and empty photo array over the REST API.
- **Server-Side Salted Hashes**: Passwords are never stored in plaintext or verified on the client. `bcryptjs` performs salted one-way hashing on the backend.
- **Time-Gated Image Streamer**: Static `/uploads` is disabled. All images are streamed through `/api/capsules/:id/photos/:photoId`, which strictly checks authorization before streaming binary data.
- **Rate-Limiting & Lockout**: Failed attempts are tracked per capsule/IP with 5-attempt limits and temporary 15-minute lockout cooldowns.

---

## 🧪 Pre-Seeded Test Vaults

| Vault | Status | Password & Testing Notes |
| :--- | :--- | :--- |
| **`College Days`** | 🔒 **`SEALED`** | **1,095 days remaining**. Click *“Unlock early →”* and enter password: `almamater2026` |
| **`Kyoto Autumn Journey`** | 🌟 **`UNLOCKED`** | Scheduled unlock date was in October 2024. Shows the completed waiting state. |
| **`Secret Notes to 25`** | ⚡ **`UNLOCKED EARLY`** | Shows the early-unlocked commemoration and vintage wax-sealed letter. |

---

## 💼 Day 7 LinkedIn Post Copy

```markdown
🚀 Day 7 of #ProjectGetHired | ChronoVault: Personal Digital Time Capsule with Dual-Key Unlocking & Zero-Knowledge Security

I wanted some photos and memories to be completely hidden for a certain time — and what better way to do that than a good old digital time capsule? 🔒⏳

Today for Day 7, I built ChronoVault — an atmospheric personal time capsule platform that brings the sentiment of sealing physical letters & memories to the web, backed by a strict time-gating security architecture.

✨ Highlights & Engineering Decisions:
1. 🔒 Dual Unlocking Architecture:
   - Normal Scheduled Unlock: Automatically unlocks when the calendar date arrives (e.g. 1,095 days remaining).
   - Early Password Unlock: Protected by server-side bcrypt hashed keys, a 2-step emotional confirmation modal ("These memories were meant for your future self..."), rate limiting, and an animated cinematic reveal screen ("You couldn't wait, huh? 👀").
2. 🛡️ Zero-Knowledge Backend:
   - While sealed, confidential letters and photo paths are never exposed over the API.
   - Media assets are served through a time-checked binary authorization gateway.
3. 📜 Nostalgic UX:
   - Real-time live countdowns, dark cosmic vault aesthetic, vintage wax-sealed letter typography, and generative ambient audio synthesis.

💻 Tech Stack: React, Tailwind CSS, Express, Node.js, Bcrypt, Lucide Icons, Canvas-Confetti, Vercel

🌐 Live Demo: https://time-capsule-red-sigma.vercel.app
📁 GitHub: https://github.com/aamilhaq/chronovault-time-capsule

Feedback and thoughts are welcome! 🔥
#WebDevelopment #ReactJS #FullStack #NodeJS #Security #UIUX #Day7
```

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/aamilhaq/chronovault-time-capsule.git
cd chronovault-time-capsule

# Run Automated Security Tests
cd server && npm test

# Start Server
node server/index.js

# Start Client
cd ../client && npm run dev
```

---

## 📄 License
MIT License © 2026 Aamil Haq
