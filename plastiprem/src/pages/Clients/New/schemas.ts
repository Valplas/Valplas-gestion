import { z } from 'zod';

// Definir el esquema de ClientModel
export const clientSchema = z.object({
  clientName: z.string()/* .min(1, "El nombre es requerido").max(50, "Máximo 50 caracteres") */.optional(),
  clientSurname: z.string()/* .max(30, "Máximo 30 caracteres") */.optional(),
  clientType: z.enum(["0", "1"], { message: "El tipo es requerido" }).optional(), // 0 para Individual, 1 para Business
  clientNumber: z.any()/* .min(1, "El número de cliente es requerido") .optional()*/,
  clientAddress: z.string()/* .min(1, "La dirección es requerida").max(100, "Máximo 100 caracteres") */.optional(),
  clientLocality: z.string()/* .min(1, "La localidad es requerida") */.optional(),
  clientNotes: z.string().optional(),
  clientWorkingHours: z.string()/* .min(1, "Los horarios son requeridos") */.optional(),
  clientPoint: z.string().optional(),
  clientPhone: z.string()/* .min(1, "El teléfono es requerido") */.optional(),
  clientAlternativePhone: z.string().optional(),
  clientEmail: z.string()/* .email("Email inválido") */.optional(),
  clientCUIT: z.string()/* .min(1, "El CUIT es requerido") */.optional(),
  clientTaxCondition: z.enum(["0", "1", "2"], { message: "La condición impositiva es requerida" }).optional(), // 0: Consumidor Final, 1: Monotributista, 2: Responsable Inscripto
  clientFont: z.string().optional(),
  clientDate: z.string().transform((str) => new Date(str)).optional(), // Convertir el string en Date
});

