import express from 'express';
import cors from 'cors';
import capsuleRoutes from '../server/routes/capsules.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/capsules', capsuleRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ChronoVault Serverless API',
    currentTime: new Date().toISOString()
  });
});

export default app;
