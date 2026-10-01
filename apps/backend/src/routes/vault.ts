import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Bindings, VaultItem } from '../types';

const router = new Hono<{ Bindings: Bindings }>();

// GET /api/vault - List all items in vault
router.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT *, 
      CASE WHEN datetime('now') >= unlock_at THEN 1 ELSE 0 END AS is_unlocked
     FROM vault_items 
     ORDER BY created_at DESC`
  ).all<VaultItem>();

  return c.json({ success: true, data: results });
});

// GET /api/vault/savings - Summary and history of saved money & hours
router.get('/savings', async (c) => {
  const summaryResult = await c.env.DB.prepare(
    `SELECT 
      COALESCE(SUM(saved_amount), 0) AS total_saved,
      COALESCE(SUM(hours_reclaimed), 0) AS total_hours_reclaimed,
      COUNT(id) AS saved_count
     FROM savings_tracker`
  ).first<{
    total_saved: number;
    total_hours_reclaimed: number;
    saved_count: number;
  }>();

  const historyResult = await c.env.DB.prepare(
    `SELECT 
      s.id, s.user_id, s.vault_item_id, s.saved_amount, s.hours_reclaimed, s.created_at,
      v.item_name, v.item_category, v.price, v.ai_verdict
     FROM savings_tracker s
     JOIN vault_items v ON s.vault_item_id = v.id
     ORDER BY s.created_at DESC`
  ).all();

  return c.json({
    success: true,
    data: {
      summary: summaryResult || { total_saved: 0, total_hours_reclaimed: 0, saved_count: 0 },
      history: historyResult.results || [],
    },
  });
});

const ActionSchema = z.object({
  action: z.enum(['passed', 'bought']),
});

// POST /api/vault/:id/action - Resolve cooling vault item
router.post('/:id/action', zValidator('json', ActionSchema), async (c) => {
  const id = c.req.param('id');
  const { action } = c.req.valid('json');

  const item = await c.env.DB.prepare(
    `SELECT * FROM vault_items WHERE id = ?`
  ).bind(id).first<VaultItem>();

  if (!item) {
    return c.json({ success: false, error: 'Vault item tidak ditemukan' }, 404);
  }

  if (item.status !== 'cooling') {
    return c.json({ success: false, error: `Item sudah diselesaikan sebelumnya (${item.status})` }, 400);
  }

  // Update item status
  await c.env.DB.prepare(
    `UPDATE vault_items 
     SET status = ?, resolved_at = datetime('now') 
     WHERE id = ?`
  ).bind(action, id).run();

  // If user decides to pass (batal beli), record into savings_tracker
  if (action === 'passed') {
    const savingsId = crypto.randomUUID();
    await c.env.DB.prepare(
      `INSERT INTO savings_tracker (id, user_id, vault_item_id, saved_amount, hours_reclaimed)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(
      savingsId,
      item.user_id,
      item.id,
      item.price,
      item.work_hours_required
    ).run();
  }

  return c.json({
    success: true,
    message: action === 'passed' 
      ? 'Selamat! Kamu berhasil menahan godaan belanja dan menghemat uang.' 
      : 'Item ditandai sebagai dibeli.',
    status: action,
  });
});

export default router;
