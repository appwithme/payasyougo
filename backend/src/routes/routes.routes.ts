import { Router } from 'express';
import * as routes from '../controllers/routes.controller';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await routes.listRoutes());
  } catch (err) {
    next(err);
  }
});

router.get('/fare', async (req, res, next) => {
  try {
    res.json(await routes.getFare(String(req.query.from || ''), String(req.query.to || '')));
  } catch (err) {
    next(err);
  }
});

export default router;
