import * as z from 'zod';

export const productSchema = z.object({
  business: z.enum(['0', '1']).optional(),
  description: z.string().max(500),
  manufacturer: z.string().optional(),
  weightKg: z.number().positive().optional(),
  width: z.number().positive().optional(),
  long: z.number().positive().optional(),
  height: z.number().positive().optional(),
  origin: z.string().optional(),
  code: z.number().int().optional(),
  // container: z.boolean().optional(),
  // ProductIDRelated: z.string().optional(),
  // quantity: z.number().int().optional(),
  // category: z.string().optional(),
  // subcategory: z.string().optional(),
});
