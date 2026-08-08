import { Router } from 'express';
import { Role } from '@prisma/client';
import * as drivers from '../controllers/drivers.controller';
import * as payments from '../controllers/payments.controller';
import * as withdrawals from '../controllers/withdrawals.controller';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.get('/me/wallet', requireAuth, requireRole(Role.DRIVER), async (req: AuthRequest, res, next) => {
  try {
    res.json(await drivers.myWallet(req.user!.sub));
  } catch (err) {
    next(err);
  }
});

router.get(
  '/me/transactions',
  requireAuth,
  requireRole(Role.DRIVER),
  async (req: AuthRequest, res, next) => {
    try {
      res.json({ transactions: await payments.listTransactions(req.user!.sub, Role.DRIVER) });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/me/withdraw',
  requireAuth,
  requireRole(Role.DRIVER),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await withdrawals.initiateWithdrawal(req.user!.sub, req.body);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'ZodError') {
        return next(new AppError('Invalid withdrawal payload'));
      }
      next(err);
    }
  }
);

router.get(
  '/me/withdrawals/:id',
  requireAuth,
  requireRole(Role.DRIVER),
  async (req: AuthRequest, res, next) => {
    try {
      res.json(await withdrawals.withdrawalStatus(req.user!.sub, req.params.id));
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:code', requireAuth, async (req, res, next) => {
  try {
    res.json(await drivers.lookupByCode(req.params.code));
  } catch (err) {
    next(err);
  }
});

export default router;
