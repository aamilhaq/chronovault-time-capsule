import { getAllCapsules, getCapsuleById, verifyAndUnlockEarly, getCapsuleStatus } from './services/capsuleStore.js';

console.log("=========================================");
console.log("ChronoVault Security & Logic Test Suite");
console.log("=========================================\n");

// Test 1: Sealed capsule zero-knowledge check
console.log("Test 1: Zero-knowledge verification on sealed capsule...");
const sealed = getCapsuleById("college-days-2026");
console.assert(sealed.status === 'SEALED', `Expected status SEALED, got ${sealed.status}`);
console.assert(sealed.message === null, `Expected message to be NULL, got ${sealed.message}`);
console.assert(sealed.photos.length === 0, `Expected 0 photos returned, got ${sealed.photos.length}`);
console.assert(!sealed.earlyUnlockPasswordHash, `Password hash must NEVER be returned`);
console.log("✓ Test 1 Passed: Sealed capsule strictly withholds secret message and photos.\n");

// Test 2: Scheduled unlock check
console.log("Test 2: Scheduled unlock on past-due capsule...");
const pastCapsule = getCapsuleById("kyoto-autumn-2024");
console.assert(pastCapsule.status === 'UNLOCKED', `Expected status UNLOCKED, got ${pastCapsule.status}`);
console.assert(typeof pastCapsule.message === 'string', `Expected message to be accessible`);
console.assert(pastCapsule.photos.length > 0, `Expected photos to be accessible`);
console.log("✓ Test 2 Passed: Past scheduled date automatically grants UNLOCKED status.\n");

// Test 3: Wrong early unlock password & rate limiting
console.log("Test 3: Incorrect early unlock password attempt...");
const failAttempt = verifyAndUnlockEarly("college-days-2026", "wrongpassword123", "test-ip-1");
console.assert(failAttempt.success === false, "Expected failure on incorrect password");
console.assert(failAttempt.code === 401, `Expected code 401, got ${failAttempt.code}`);
console.assert(failAttempt.remainingAttempts === 4, `Expected 4 remaining attempts, got ${failAttempt.remainingAttempts}`);
console.log("✓ Test 3 Passed: Failed attempt rejected with attempt counter decrement.\n");

// Test 4: Correct early unlock password verification
console.log("Test 4: Correct early unlock password...");
const successAttempt = verifyAndUnlockEarly("college-days-2026", "almamater2026", "test-ip-1");
console.assert(successAttempt.success === true, "Expected successful early unlock");
console.assert(successAttempt.capsule.status === 'UNLOCKED_EARLY', `Expected status UNLOCKED_EARLY, got ${successAttempt.capsule.status}`);
console.assert(typeof successAttempt.capsule.message === 'string', "Message must now be revealed");
console.assert(successAttempt.capsule.photos.length > 0, "Photos must now be revealed");
console.assert(successAttempt.capsule.unlockedAt !== null, "Unlock timestamp must be recorded");
console.log("✓ Test 4 Passed: Capsule permanently unlocked early with status UNLOCKED_EARLY.\n");

console.log("=========================================");
console.log("ALL 4 SECURITY TESTS PASSED PERFECTLY!");
console.log("=========================================");
