import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { AuthRequest, requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const result = await auth.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      return next(new AppError('Invalid registration payload'));
    }
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await auth.login(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      return next(new AppError('Invalid login payload'));
    }
    next(err);
  }
});

router.post('/google', async (req, res, next) => {
  try {
    const result = await auth.loginWithGoogle(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      return next(new AppError('Invalid Google auth payload'));
    }
    next(err);
  }
});

router.post('/google/code', async (req, res, next) => {
  try {
    const result = await auth.loginWithGoogleCode(req.body);
    res.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === 'ZodError') {
      return next(new AppError('Invalid Google code payload'));
    }
    next(err);
  }
});

router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await auth.me(req.user!.sub);
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
