'use server';

import { createClient } from '@/lib/supabase/server';

type EntityType = 'artistes' | 'projets' | 'ressources' | 'transactions';

export async function getEntityName(
  entityType: EntityType,
  id: string
): Promise<{ data: string | null; error: string | null }> {
  const supabase = await createClient();

  try {
    switch (entityType) {
      case 'artistes': {
        const { data, error } = await supabase
          .from('artistes')
          .select('nom')
          .eq('id', id)
          .single();
        if (error) return { data: null, error: error.message };
        return { data: data?.nom || null, error: null };
      }
      case 'projets': {
        const { data, error } = await supabase
          .from('projets')
          .select('nom')
          .eq('id', id)
          .single();
        if (error) return { data: null, error: error.message };
        return { data: data?.nom || null, error: null };
      }
      case 'ressources': {
        const { data, error } = await supabase
          .from('ressources')
          .select('titre')
          .eq('id', id)
          .single();
        if (error) return { data: null, error: error.message };
        return { data: data?.titre || null, error: null };
      }
      case 'transactions': {
        const { data, error } = await supabase
          .from('transactions')
          .select('description')
          .eq('id', id)
          .single();
        if (error) return { data: null, error: error.message };
        // Truncate long descriptions
        const desc = data?.description || null;
        return { data: desc ? (desc.length > 30 ? desc.slice(0, 30) + '...' : desc) : null, error: null };
      }
      default:
        return { data: null, error: 'Unknown entity type' };
    }
  } catch {
    return { data: null, error: 'Failed to fetch entity name' };
  }
}
