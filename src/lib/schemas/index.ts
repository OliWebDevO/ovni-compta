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
  .min(6, 'Code trop court')
  .max(10, 'Code trop long')
  .regex(/^[A-Z0-9]+$/, 'Code invalide')
  .transform((val) => val.toUpperCase());

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

// =============================================
// Facture Schemas
// =============================================

export const typeLiaisonSchema = z.enum(['artiste', 'projet', 'asbl']);

export const createFactureSchema = z.object({
  date: dateSchema,
  description: z.string().min(1, 'La description est requise').max(500, 'Description trop longue').trim(),
  type_liaison: typeLiaisonSchema,
  artiste_id: optionalUuidSchema,
  projet_id: optionalUuidSchema,
  fichier_nom: z.string().min(1, 'Nom de fichier requis').max(255, 'Nom de fichier trop long'),
  fichier_path: z.string().min(1, 'Chemin de fichier requis').max(500, 'Chemin trop long'),
  fichier_size: z.number().min(0).nullable(),
});

export type CreateFactureInput = z.infer<typeof createFactureSchema>;

// =============================================
// Caisse OVNI (ASBL Transaction) Schemas
// =============================================

export const createAsblTransactionSchema = z.object({
  date: dateSchema,
  description: z.string().min(1, 'La description est requise').max(500, 'Description trop longue').trim(),
  credit: z.number().min(0, 'Le crédit doit être positif ou nul'),
  debit: z.number().min(0, 'Le débit doit être positif ou nul'),
  categorie: transactionCategorieSchema.nullable(),
}).refine(
  (data) => data.credit > 0 || data.debit > 0,
  'Au moins un montant (crédit ou débit) doit être supérieur à 0'
);

export type CreateAsblTransactionInput = z.infer<typeof createAsblTransactionSchema>;

// =============================================
// Transfert Schemas
// =============================================

export const transfertTypeSchema = z.enum(['artiste', 'projet', 'asbl']);

export const createTransfertSchema = z.object({
  date: dateSchema,
  montant: z.number().positive('Le montant doit être positif'),
  description: z.string().min(1, 'La description est requise').max(500, 'Description trop longue').trim(),
  source_type: transfertTypeSchema,
  source_artiste_id: optionalUuidSchema,
  source_projet_id: optionalUuidSchema,
  destination_type: transfertTypeSchema,
  destination_artiste_id: optionalUuidSchema,
  destination_projet_id: optionalUuidSchema,
});

export const updateTransfertSchema = createTransfertSchema;

export type CreateTransfertInput = z.infer<typeof createTransfertSchema>;

// =============================================
// Bilan Schemas
// =============================================

export const anneeSchema = z.number().int().min(2000).max(2100);

// =============================================
// Ressource Schemas
// =============================================

export const ressourceCategorieSchema = z.enum(['guide', 'juridique', 'comptabilite', 'artistes', 'liens']);

export const createRessourceSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis').max(255, 'Titre trop long').trim(),
  description: z.string().min(1, 'La description est requise').max(2000, 'Description trop longue').trim(),
  contenu: z.string().max(10000, 'Contenu trop long').optional().nullable(),
  categorie: ressourceCategorieSchema,
  url: z.string().url('URL invalide').max(500, 'URL trop longue').optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  icon: z.string().max(50).optional().nullable(),
  important: z.boolean().optional(),
});

export const updateRessourceSchema = z.object({
  titre: z.string().min(1).max(255).trim().optional(),
  description: z.string().min(1).max(2000).trim().optional(),
  contenu: z.string().max(10000).optional().nullable(),
  categorie: ressourceCategorieSchema.optional(),
  url: z.string().url().max(500).optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  icon: z.string().max(50).optional().nullable(),
  important: z.boolean().optional(),
});

export type CreateRessourceInput = z.infer<typeof createRessourceSchema>;
export type UpdateRessourceInput = z.infer<typeof updateRessourceSchema>;

// =============================================
// Auth Schemas
// =============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères').max(72, 'Mot de passe trop long'),
  nom: z.string().min(1, 'Le nom est requis').max(255, 'Nom trop long').trim(),
  couleur: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Format couleur invalide').optional().default('#888888'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;

// =============================================
// Breadcrumb Schemas
// =============================================

export const entityTypeSchema = z.enum(['artistes', 'projets', 'ressources', 'transactions']);

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
