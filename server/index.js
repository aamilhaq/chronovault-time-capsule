import express from 'express';
import cors from 'cors';
import capsuleRoutes from './routes/capsules.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: We deliberately DO NOT expose the `uploads` directory statically via express.static.
// All media is strictly time-gated and authorized via `/api/capsules/:id/photos/:photoId`.

// Routes
app.use('/api/capsules', capsuleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ChronoVault Server',
    currentTime: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[ChronoVault Server] Running securely on port ${PORT}`);
  console.log(`[Security Policy] Public static uploads disabled. All media time-gated.`);
});
