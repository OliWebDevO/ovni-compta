'use client';

import { Button } from '@/components/ui/button';
import {
  IllustrationEmpty,
  IllustrationArtist,
  IllustrationProject,
  IllustrationDocuments,
  IllustrationChart,
} from '@/components/illustrations';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

type IllustrationType = 'empty' | 'artist' | 'project' | 'document' | 'chart';

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: IllustrationType;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}

const illustrations = {
  empty: IllustrationEmpty,
  artist: IllustrationArtist,
  project: IllustrationProject,
  document: IllustrationDocuments,
  chart: IllustrationChart,
};

export function EmptyState({
  title,
  description,
  illustration = 'empty',
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  const Illustration = illustrations[illustration];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-scale-in">
      <div className="animate-float mb-6">
        <Illustration size={illustration === 'empty' ? 180 : 150} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild className="btn-shine">
          <Link href={actionHref}>
            <Plus className="mr-2 h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
      {children}
    </div>
  );
}
