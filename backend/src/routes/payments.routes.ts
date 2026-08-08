import { Router, raw } from 'express';
import { Role } from '@prisma/client';
import * as payments from '../controllers/payments.controller';
import { AuthRequest, requireAuth, requireRole } from '../middleware/auth';
import { verifyPaystackSignature } from '../services/paystack';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post(
  '/initiate',
  requireAuth,
  requireRole(Role.PASSENGER),
  async (req: AuthRequest, res, next) => {
    try {
      const result = await payments.initiatePayment(req.user!.sub, req.body);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'ZodError') {
        return next(new AppError('Invalid payment payload'));
      }
      next(err);
    }
  }
);

router.get('/:id/status', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    res.json(await payments.paymentStatus(req.user!.sub, req.params.id));
  } catch (err) {
    next(err);
  }
});

export default router;

/** Mounted separately with raw body for signature verification */
export const webhookRouter = Router();

webhookRouter.post(
  '/',
  raw({ type: 'application/json' }),
  async (req, res, next) => {
    try {
      const signature = req.headers['x-paystack-signature'] as string | undefined;
      const rawBody = req.body as Buffer;
      if (!verifyPaystackSignature(rawBody, signature)) {
        return res.status(401).json({ error: 'Invalid Paystack signature' });
      }
      const event = JSON.parse(rawBody.toString('utf8'));
      const result = await payments.handleWebhookEvent(event);
      res.json({ received: true, ...result });
    } catch (err) {
      next(err);
    }
  }
);
