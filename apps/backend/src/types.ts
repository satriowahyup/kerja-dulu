import { z } from 'zod';

export type Bindings = CloudflareBindings;

export const EvaluationSchema = z.object({
  user_id: z.string().default('user_default'),
  item_name: z.string().min(2),
  item_category: z.enum(['fashion', 'gadget', 'hobby', 'gaming', 'fnb', 'other']),
  price: z.number().positive(),
  monthly_income: z.number().positive(),
  working_hours_per_week: z.number().default(40),
  reason_to_buy: z.string().optional(),
});

export type EvaluationInput = z.infer<typeof EvaluationSchema>;

export const AIOutputSchema = z.object({
  ai_verdict: z.enum(['dangerously_impulsive', 'questionable', 'reasonable']),
  ai_roast_critique: z.string(),
  ai_reality_check: z.string(),
  cheaper_alternative: z.string().nullable(),
});

export type AIOutput = z.infer<typeof AIOutputSchema>;

export interface VaultItem {
  id: string;
  user_id: string;
  item_name: string;
  item_category: string;
  price: number;
  work_hours_required: number;
  reason_to_buy?: string | null;
  ai_verdict: 'dangerously_impulsive' | 'questionable' | 'reasonable';
  ai_roast_critique: string;
  ai_reality_check: string;
  status: 'cooling' | 'bought' | 'passed';
  created_at: string;
  unlock_at: string;
  resolved_at?: string | null;
  is_unlocked?: number;
}

export interface SavingsItem {
  id: string;
  user_id: string;
  vault_item_id: string;
  saved_amount: number;
  hours_reclaimed: number;
  created_at: string;
  item_name?: string;
  item_category?: string;
}

export interface SavingsSummary {
  total_saved: number;
  total_hours_reclaimed: number;
  saved_count: number;
}
