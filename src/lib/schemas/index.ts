/**
 * Zod Validation Schemas
 * Security: Input validation for all server actions
 */

import { z } from 'zod';

// =============================================
// Common Validators
// =============================================

/** Validates hex color format #RRGGBB */
export const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Format couleur invalide. Utilisez #RRGGBB')
  .optional()
  .nullable();

/** Validates UUID format */
export const uuidSchema = z.string().uuid('ID invalide');

/** Validates optional UUID */
export const optionalUuidSchema = z.string().uuid('ID invalide').optional().nullable();

/** Validates email format */
export const emailSchema = z.string().email('Email invalide').max(255, 'Email trop long');

/** Validates phone number (international format) */
export const phoneSchema = z
  .string()
  .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Numéro de téléphone invalide')
  .max(30, 'Numéro trop long')
  .optional()
  .nullable();

/** Validates date string (ISO format) */
export const dateSchema = z.string().refine(
  (val) => !isNaN(Date.parse(val)),
  'Date invalide'
);

/** Validates optional date */
export const optionalDateSchema = z
  .string()
  .refine((val) => !val || !isNaN(Date.parse(val)), 'Date invalide')
  .optional()
  .nullable();

// =============================================
// Artiste Schemas
// =============================================

export const createArtisteSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom est trop long')
    .trim(),
  email: emailSchema.optional().nullable(),
  telephone: phoneSchema,
  notes: z.string().max(2000, 'Notes trop longues').optional().nullable(),
  couleur: colorSchema,
});

export const updateArtisteSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255, 'Le nom est trop long').trim().optional(),
  email: emailSchema.optional().nullable(),
  telephone: phoneSchema,
  notes: z.string().max(2000, 'Notes trop longues').optional().nullable(),
  couleur: colorSchema,
  actif: z.boolean().optional(),
});

export type CreateArtisteInput = z.infer<typeof createArtisteSchema>;
export type UpdateArtisteInput = z.infer<typeof updateArtisteSchema>;

// =============================================
// Projet Schemas
// =============================================

export const projetStatutSchema = z.enum(['actif', 'termine', 'annule']);

export const createProjetSchema = z.object({
  nom: z
    .string()
    .min(1, 'Le nom est requis')
    .max(255, 'Le nom est trop long')
    .trim(),
  code: z
    .string()
    .min(1, 'Le code est requis')
    .max(50, 'Le code est trop long')
    .regex(/^[A-Z0-9_-]+$/i, 'Le code ne peut contenir que des lettres, chiffres, tirets et underscores')
    .trim(),
  description: z.string().max(2000, 'Description trop longue').optional().nullable(),
  budget: z.number().min(0, 'Le budget doit être positif').optional().nullable(),
  date_debut: optionalDateSchema,
  date_fin: optionalDateSchema,
});

export const updateProjetSchema = z.object({
  nom: z.string().min(1).max(255).trim().optional(),
  code: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/i)
    .trim()
    .optional(),
  description: z.string().max(2000).optional().nullable(),
  budget: z.number().min(0).optional().nullable(),
  date_debut: optionalDateSchema,
  date_fin: optionalDateSchema,
  statut: projetStatutSchema.optional(),
});

export type CreateProjetInput = z.infer<typeof createProjetSchema>;
export type UpdateProjetInput = z.infer<typeof updateProjetSchema>;

// =============================================
// Transaction Schemas
// =============================================

export const transactionCategorieSchema = z.enum([
  'smart',
  'thoman',
  'frais_bancaires',
  'loyer',
  'materiel',
  'deplacement',
  'cachet',
  'subvention',
  'transfert_interne',
  'autre',
]);

export const createTransactionSchema = z.object({
  date: dateSchema,
  description: z
    .string()
    .min(1, 'La description est requise')
    .max(500, 'Description trop longue')
    .trim(),
  credit: z.number().min(0, 'Le crédit doit être positif ou nul'),
  debit: z.number().min(0, 'Le débit doit être positif ou nul'),
  artiste_id: optionalUuidSchema,
  projet_id: optionalUuidSchema,
  categorie: transactionCategorieSchema.nullable(),
}).refine(
  (data) => data.credit > 0 || data.debit > 0,
  'Au moins un montant (crédit ou débit) doit être supérieur à 0'
);

export const updateTransactionSchema = z.object({
  date: dateSchema.optional(),
  description: z.string().min(1).max(500).trim().optional(),
  credit: z.number().min(0).optional(),
  debit: z.number().min(0).optional(),
  artiste_id: optionalUuidSchema,
  projet_id: optionalUuidSchema,
  categorie: transactionCategorieSchema.nullable().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// =============================================
// Profile Schemas
// =============================================

export const updateProfileSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255, 'Nom trop long').trim().optional(),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format couleur invalide').optional(),
  avatar: z.string().url('URL avatar invalide').max(500).optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// =============================================
// Invitation Schemas
// =============================================

export const roleSchema = z.enum(['admin', 'editor', 'viewer']);

export const createInvitationSchema = z.object({
  email: emailSchema,
  role: roleSchema,
  artiste_id: optionalUuidSchema,
  can_create_artiste: z.boolean(),
  notes: z.string().max(500, 'Notes trop longues').optional().nullable(),
});

export const invitationCodeSchema = z
  .string()
  .length(6, 'Le code doit contenir 6 caractères')
  .regex(/^[A-Z0-9]+$/, 'Code invalide')
  .transform((val) => val.toUpperCase());

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

// =============================================
// Validation Helper
// =============================================

/**
 * Validates input against a Zod schema and returns a standardized result
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(input);

  if (!result.success) {
    // Return the first error message
    const issues = result.error.issues;
    const firstError = issues[0];
    return {
      success: false,
      error: firstError?.message || 'Données invalides',
    };
  }

  return { success: true, data: result.data };
}
