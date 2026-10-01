import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Bindings } from './types';
import evaluateRoute from './routes/evaluate';
import vaultRoute from './routes/vault';

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal Server Error',
  }, 500);
});

// Health check endpoint
app.get('/health', (c) => c.json({ status: 'ok', runtime: 'cloudflare-worker-hono' }));

// Mount modular sub-routes
app.route('/api/evaluate', evaluateRoute);
app.route('/api/vault', vaultRoute);

export default app;
export { Bindings };