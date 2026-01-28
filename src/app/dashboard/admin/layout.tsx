'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/profile';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuthorization() {
      const { data: user } = await getCurrentUser();

      if (!user) {
        router.push('/login');
        return;
      }

      if (user.role !== 'admin') {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    }

    checkAuthorization();
  }, [router]);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  // Unauthorized state
  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="p-4 bg-rose-100 rounded-full mb-4">
          <ShieldAlert className="h-12 w-12 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Vous n'avez pas les permissions nécessaires pour accéder à cette section.
          Seuls les administrateurs peuvent y accéder.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Retour au dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
