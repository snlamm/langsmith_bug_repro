import express from 'express';
import { runAgentsInParallel } from './runAgent.js';

/**
 * Router for /ai
 */
export const getRouter = (): express.Router => {
  const router = express.Router();

  router.get('/trigger', async (req, res) => {
    await runAgentsInParallel();

    res.sendStatus(204);
  });

  return router;
};
