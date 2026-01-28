'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/actions/profile';

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
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      const { data: user } = await getCurrentUser();
      setRole(user?.role || null);
      setIsLoading(false);
    }
    fetchRole();
  }, []);

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
}
