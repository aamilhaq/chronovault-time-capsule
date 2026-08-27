import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  getAllCapsules,
  getCapsuleById,
  createCapsule,
  verifyAndUnlockEarly,
  getPhotoFile
} from '../services/capsuleStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `memory-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 12 }, // max 15MB per file, up to 12 files
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

// GET all capsules
router.get('/', (req, res) => {
  try {
    const list = getAllCapsules();
    res.json({ success: true, capsules: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single capsule
router.get('/:id', (req, res) => {
  try {
    const capsule = getCapsuleById(req.params.id);
    if (!capsule) {
      return res.status(404).json({ success: false, error: 'Time capsule not found' });
    }
    res.json({ success: true, capsule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create capsule
router.post('/', upload.array('photos', 12), (req, res) => {
  try {
    const { title, tagline, creatorName, recipientName, unlockDate, message, earlyUnlockPassword, earlyUnlockHint, themeColor } = req.body;

    if (!title || !unlockDate || !message) {
      return res.status(400).json({ success: false, error: 'Title, Unlock Date, and Future Letter are required.' });
    }

    const created = createCapsule({
      title,
      tagline,
      creatorName,
      recipientName,
      unlockDate,
      message,
      earlyUnlockPassword,
      earlyUnlockHint,
      themeColor,
      uploadedFiles: req.files || []
    });

    res.status(201).json({ success: true, capsule: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST early unlock with password
router.post('/:id/unlock-early', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Early unlock password is required.' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const result = verifyAndUnlockEarly(req.params.id, password, clientIp);

    if (!result.success) {
      return res.status(result.code || 401).json(result);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET time-gated photo stream
router.get('/:id/photos/:photoId', (req, res) => {
  try {
    const result = getPhotoFile(req.params.id, req.params.photoId);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Photo not found.' });
    }

    if (result.error === 'SEALED_VAULT') {
      return res.status(403).json({ success: false, error: result.message });
    }

    if (result.externalUrl) {
      return res.redirect(result.externalUrl);
    }

    if (result.filePath) {
      res.setHeader('Content-Type', result.mimeType);
      return res.sendFile(result.filePath);
    }

    res.status(404).json({ success: false, error: 'Photo asset missing' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
