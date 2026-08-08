import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import routesRoutes from './routes/routes.routes';
import driversRoutes from './routes/drivers.routes';
import paymentsRoutes, { webhookRouter } from './routes/payments.routes';
import transactionsRoutes from './routes/transactions.routes';

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'payasyougo-api' });
});

// Paystack webhook needs raw body — mount before json parser
app.use('/api/payments/webhook', webhookRouter);

app.use(express.json({ limit: '3mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/transactions', transactionsRoutes);

app.use(errorHandler);

app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`PayAsYouGo API listening on http://0.0.0.0:${env.PORT}`);
});
