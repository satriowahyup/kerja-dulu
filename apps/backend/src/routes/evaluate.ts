import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { Bindings, EvaluationSchema, AIOutputSchema, AIOutput } from '../types';

const router = new Hono<{ Bindings: Bindings }>();

router.post('/', zValidator('json', EvaluationSchema), async (c) => {
  const data = c.req.valid('json');

  const totalMonthlyHours = data.working_hours_per_week * 4.33;
  const hourlyRate = data.monthly_income / totalMonthlyHours;
  const workHoursRequired = Number((data.price / hourlyRate).toFixed(1));
  const workDaysRequired = Number((workHoursRequired / 8).toFixed(1));

  const systemPrompt = `You are a candid, financially savvy devil's advocate for Gen Z and Millennials.
Analyze this purchase intention objectively. Be honest, slightly witty, but deeply educational about opportunity cost.
Respond ONLY with a valid raw JSON object matching this schema:
{
  "ai_verdict": "dangerously_impulsive" | "questionable" | "reasonable",
  "ai_roast_critique": "A punchy 2-sentence reality check on why buying this might be driven by FOMO or short-term dopamine",
  "ai_reality_check": "1 deep reflective question the user must answer before spending",
  "cheaper_alternative": "A frugal or free alternative, or null"
}
Do not use markdown fences. Output raw JSON only.`;

  const userContext = `Item: ${data.item_name}
Category: ${data.item_category}
Price: Rp ${data.price.toLocaleString('id-ID')}
User Hourly Wage: Rp ${Math.round(hourlyRate).toLocaleString('id-ID')}
Work time needed: ${workHoursRequired} hours (~${workDaysRequired} work days).
User reason: "${data.reason_to_buy || 'No specific reason, impulse want'}"`;

  let parsedAI: AIOutput;
  try {
    const aiResult: any = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContext },
      ],
      temperature: 0.2,
    });

    const rawJson = (aiResult.response || '').replace(/```json|```/g, '').trim();
    parsedAI = AIOutputSchema.parse(JSON.parse(rawJson));
  } catch (error) {
    console.error('Failed to run AI or parse output, using fallback:', error);
    parsedAI = {
      ai_verdict: 'questionable',
      ai_roast_critique: 'Membeli barang ini sekarang berisiko menjadi pengeluaran impulsif yang memotong alokasi tabungan pentingmu.',
      ai_reality_check: 'Apakah kamu masih benar-benar menginginkan barang ini setelah jeda waktu 72 jam?',
      cheaper_alternative: null,
    };
  }

  // Pastikan record user ada di user_profiles agar tidak melanggar foreign key constraint
  await c.env.DB.prepare(
    `INSERT OR IGNORE INTO user_profiles (id, name, monthly_income, working_hours_per_week, hourly_rate)
     VALUES (?, 'Default User', ?, ?, ?)`
  ).bind(
    data.user_id,
    data.monthly_income,
    data.working_hours_per_week,
    hourlyRate
  ).run();

  const itemId = crypto.randomUUID();
  await c.env.DB.prepare(
    `INSERT INTO vault_items (
      id, user_id, item_name, item_category, price, work_hours_required,
      reason_to_buy, ai_verdict, ai_roast_critique, ai_reality_check, status, unlock_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'cooling', datetime('now', '+3 days'))`
  ).bind(
    itemId,
    data.user_id,
    data.item_name,
    data.item_category,
    data.price,
    workHoursRequired,
    data.reason_to_buy || '',
    parsedAI.ai_verdict,
    parsedAI.ai_roast_critique,
    parsedAI.ai_reality_check
  ).run();

  return c.json({
    success: true,
    data: {
      id: itemId,
      metrics: {
        hourly_rate: Math.round(hourlyRate),
        work_hours_required: workHoursRequired,
        work_days_required: workDaysRequired,
      },
      analysis: parsedAI,
      unlock_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    },
  });
});

export default router;
