'use client';

import { Fragment, useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  ArrowLeftRight,
  Users,
  FolderKanban,
  BarChart3,
  Shield,
  User,
  ChevronRight,
  Home,
  LogOut,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { cn, getInitials, getRoleColor } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUser, type CurrentUser } from '@/lib/actions/profile';
import { logout } from '@/lib/auth/actions';
import { getEntityName } from '@/lib/actions/breadcrumbs';

interface BreadcrumbConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const breadcrumbMap: Record<string, BreadcrumbConfig> = {
  dashboard: {
    label: 'Dashboard',
    icon: LayoutDashboard,
    gradient: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-700',
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-300',
  },
  transactions: {
    label: 'Transactions',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  transferts: {
    label: 'Transferts',
    icon: ArrowLeftRight,
    gradient: 'from-fuchsia-500 to-purple-600',
    textColor: 'text-fuchsia-700',
    bgColor: 'bg-fuchsia-100',
    borderColor: 'border-fuchsia-300',
  },
  artistes: {
    label: 'Artistes',
    icon: Users,
    gradient: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  projets: {
    label: 'Projets',
    icon: FolderKanban,
    gradient: 'from-purple-500 to-fuchsia-600',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  bilans: {
    label: 'Bilans',
    icon: BarChart3,
    gradient: 'from-amber-500 to-orange-600',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
  },
  admin: {
    label: 'Administration',
    icon: Shield,
    gradient: 'from-slate-600 to-slate-800',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
  'mon-compte': {
    label: 'Mon Compte',
    icon: User,
    gradient: 'from-cyan-500 to-blue-600',
    textColor: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-300',
  },
  ressources: {
    label: 'Ressources',
    icon: BookOpen,
    gradient: 'from-rose-500 to-pink-600',
    textColor: 'text-rose-700',
    bgColor: 'bg-rose-100',
    borderColor: 'border-rose-300',
  },
  edit: {
    label: 'Modifier',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  new: {
    label: 'Nouvelle',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-600',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
  },
  invitations: {
    label: 'Invitations',
    icon: Shield,
    gradient: 'from-slate-600 to-slate-800',
    textColor: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
  },
};

// Helper to check if a string is a UUID
const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// Map parent segments to entity types
const entityTypeMap: Record<string, 'artistes' | 'projets' | 'ressources' | 'transactions'> = {
  artistes: 'artistes',
  projets: 'projets',
  ressources: 'ressources',
  transactions: 'transactions',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [entityNames, setEntityNames] = useState<Record<string, string>>({});

  // Fetch current user and prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    async function fetchUser() {
      const { data } = await getCurrentUser();
      setUser(data);
      setIsLoading(false);
    }
    fetchUser();
  }, []);

  // Fetch entity names for UUID segments
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);

    async function fetchEntityNames() {
      const newNames: Record<string, string> = {};

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        const prevSegment = pathSegments[i - 1];

        if (isUUID(segment) && prevSegment && entityTypeMap[prevSegment]) {
          // Skip if we already have this entity name
          if (entityNames[segment]) continue;

          const entityType = entityTypeMap[prevSegment];
          const { data } = await getEntityName(entityType, segment);
          if (data) {
            newNames[segment] = data;
          }
        }
      }

      if (Object.keys(newNames).length > 0) {
        setEntityNames(prev => ({ ...prev, ...newNames }));
      }
    }

    fetchEntityNames();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Get the current page config for styling the header
  const currentSegment = segments[segments.length - 1];
  const parentSegment = segments[segments.length - 2];
  // For UUID segments (detail pages), use parent segment's config
  const currentConfig = isUUID(currentSegment) && parentSegment
    ? breadcrumbMap[parentSegment] || breadcrumbMap['dashboard']
    : breadcrumbMap[currentSegment] || breadcrumbMap['dashboard'];

  return (
    <SidebarProvider>
      <AppSidebar userRole={user?.role} artisteNom={user?.artiste_nom} />
      <SidebarInset className="bg-gradient-to-br from-gray-50/80 to-slate-100/80 min-w-0 overflow-x-hidden">
        {/* Floating header container - Hidden in print */}
        <div className="sticky top-0 z-30 p-3 pb-0 no-print">
          <header
            className={cn(
              'flex h-14 items-center gap-3 px-4 rounded-2xl',
              'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50',
              'border-2',
              currentConfig.borderColor
            )}
          >
            {/* Sidebar trigger with modern styling */}
            <SidebarTrigger className="-ml-1 hidden md:flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors" />
            <Separator orientation="vertical" className="mr-1 h-5 bg-gray-200/50 hidden md:block" />

            {/* Modern breadcrumb */}
            <Breadcrumb className="flex-1">
              <BreadcrumbList className="flex items-center gap-1.5 sm:gap-2">
                {segments.map((segment, index) => {
                  const isLast = index === segments.length - 1;
                  const href = '/' + segments.slice(0, index + 1).join('/');
                  const config = breadcrumbMap[segment];
                  const prevSegment = segments[index - 1];

                  // Use entity name for UUIDs, otherwise use config label or segment
                  const label = isUUID(segment) && entityNames[segment]
                    ? entityNames[segment]
                    : config?.label || segment;

                  // For UUIDs, use the parent segment's config for styling
                  const effectiveConfig = isUUID(segment) && prevSegment
                    ? breadcrumbMap[prevSegment]
                    : config;
                  const Icon = effectiveConfig?.icon || Home;

                  return (
                    <Fragment key={segment}>
                      {index > 0 && (
                        <BreadcrumbSeparator className="[&>svg]:hidden">
                          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
                        </BreadcrumbSeparator>
                      )}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="flex items-center gap-2">
                            <span
                              className={cn(
                                'flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br text-white shadow-sm',
                                effectiveConfig?.gradient || 'from-gray-500 to-gray-600'
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className={cn(
                              'font-semibold text-sm max-w-[150px] sm:max-w-[250px] truncate',
                              effectiveConfig?.textColor || 'text-gray-900'
                            )}>
                              {label}
                            </span>
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={href}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all text-sm"
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline max-w-[100px] truncate">{label}</span>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Profile dropdown - only render after mount to prevent hydration mismatch */}
            {isMounted && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50">
                    <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold">
                        {getInitials(user.nom)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900 leading-tight">
                        {user.nom.split(' ')[0]}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-gray-100">
                  <div className="px-2 py-2 mb-1">
                    <p className="font-semibold text-gray-900">{user.nom}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <Badge
                      variant={getRoleColor(user.role)}
                      className="mt-2 text-[10px] font-semibold uppercase tracking-wider"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-100" />
                  <DropdownMenuItem
                    className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold">
                    ...
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </header>
        </div>

        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
      <BottomNav userRole={user?.role} />
    </SidebarProvider>
  );
}
