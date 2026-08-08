import { Router } from 'express';
import * as payments from '../controllers/payments.controller';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const list = await payments.listTransactions(req.user!.sub, req.user!.role);
    res.json({ transactions: list });
  } catch (err) {
    next(err);
  }
});

export default router;
