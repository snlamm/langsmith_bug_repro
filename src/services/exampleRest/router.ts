import express from 'express';
import { EXAMPLE_RESULTS } from './constants.js';
import {
  addExampleItem,
  getAllExampleItems,
  showExampleItem,
  updateExampleItem,
} from './persistence.js';

/**
 * Router for /examples
 */
export const getRouter = (): express.Router => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const allItems = getAllExampleItems();

    res.json({
      results: allItems,
    });
  });

  router.get('/:index', (req, res) => {
    const index = Number(req.body.index);
    const result = showExampleItem({ index });

    res.json({
      result,
    });
  });

  router.post('/', (req, res) => {
    const newItem = req.body.item;
    addExampleItem({ newItem });

    res.json({
      newItemIndex: EXAMPLE_RESULTS.length - 1,
    });
  });

  router.put('/:index', (req, res) => {
    const newItem = req.body.item;
    const index = Number(req.body.index);

    updateExampleItem({
      newItem,
      index,
    });

    res.sendStatus(200);
  });

  return router;
};
