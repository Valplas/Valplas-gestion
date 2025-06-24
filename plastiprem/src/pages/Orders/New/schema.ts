import { z } from 'zod';
const productSchema = z.object({
  productID: z.string().optional(), // Si es un GUID, valida como string
  name: z.string().optional(),
  // business: z.enum(['Resmaprem', 'Valplas']).optional(),
  // description: z.string().optional(),
  // manufacturer: z.string().optional(),
  // weightKg: z.number().optional(),
  // width: z.number().optional(),
  // long: z.number().optional(),
  // height: z.number().optional(),
  // origin: z.string().optional(),
  // code: z.string().optional(),
});

export const newOrderSchema = z.object({
  product: productSchema,
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0').optional(),
  unitaryPrice: z.number().min(0, 'El precio unitario debe ser positivo').optional(),
  subtotal: z.number().min(0).optional(),
  // code: z.string().optional(),
});

export type NewOrderModel = z.infer<typeof newOrderSchema>;
