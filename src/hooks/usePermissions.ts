'use client';

import { useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';

type UserRole = 'admin' | 'editor' | 'viewer';

interface Permissions {
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  role: UserRole | null;
}

export function usePermissions(): Permissions {
  const { user, isLoading } = useUser();

  return useMemo(() => {
    const role = user?.role || null;
    const isAdmin = role === 'admin';
    const isEditor = role === 'editor';
    const canEdit = isAdmin || isEditor;
    const canCreate = isAdmin || isEditor;
    const canDelete = isAdmin || isEditor;

    return {
      canEdit,
      canCreate,
      canDelete,
      isAdmin,
      isLoading,
      role,
    };
  }, [user?.role, isLoading]);
}
