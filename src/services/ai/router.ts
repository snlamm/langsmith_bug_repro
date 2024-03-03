import express from 'express';
import { runAllPrompts } from './runPrompts.js';

/**
 * Router for /ai
 */
export const getRouter = (): express.Router => {
  const router = express.Router();

  router.get('/trigger', async (req, res) => {
    await runAllPrompts();

    res.sendStatus(204);
  });

  return router;
};
