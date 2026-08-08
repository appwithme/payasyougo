import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function isDbUnreachable(err: unknown) {
  if (!err || typeof err !== 'object') return false;
  const anyErr = err as { code?: string; name?: string; message?: string };
  if (anyErr.code === 'P1001' || anyErr.code === 'P1017') return true;
  if (anyErr.name === 'PrismaClientInitializationError') return true;
  if (typeof anyErr.message === 'string' && anyErr.message.includes("Can't reach database server")) {
    return true;
  }
  return false;
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P1001' || err.code === 'P1017') {
      return res.status(503).json({
        error: 'Database is temporarily unavailable. Please try again in a moment.',
      });
    }
  }

  if (isDbUnreachable(err)) {
    return res.status(503).json({
      error: 'Database is temporarily unavailable. Please try again in a moment.',
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
