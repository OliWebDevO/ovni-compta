'use client';

import Link from 'next/link';
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
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  userRole?: 'admin' | 'editor' | 'viewer';
  artisteNom?: string;
}

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-violet-500 to-purple-600',
    bgHover: 'hover:bg-violet-50',
    textActive: 'text-violet-700',
    bgActive: 'bg-gradient-to-r from-violet-100 to-purple-100',
    borderActive: 'border-violet-300',
    iconBg: 'bg-violet-100 text-violet-600',
  },
  {
    title: 'Transactions',
    url: '/dashboard/transactions',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-600',
    bgHover: 'hover:bg-emerald-50',
    textActive: 'text-emerald-700',
    bgActive: 'bg-gradient-to-r from-emerald-100 to-teal-100',
    borderActive: 'border-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Transferts',
    url: '/dashboard/transferts',
    icon: ArrowLeftRight,
    gradient: 'from-fuchsia-500 to-purple-600',
    bgHover: 'hover:bg-fuchsia-50',
    textActive: 'text-fuchsia-700',
    bgActive: 'bg-gradient-to-r from-fuchsia-100 to-purple-100',
    borderActive: 'border-fuchsia-300',
    iconBg: 'bg-fuchsia-100 text-fuchsia-600',
  },
  {
    title: 'Artistes',
    url: '/dashboard/artistes',
    icon: Users,
    gradient: 'from-blue-500 to-indigo-600',
    bgHover: 'hover:bg-blue-50',
    textActive: 'text-blue-700',
    bgActive: 'bg-gradient-to-r from-blue-100 to-indigo-100',
    borderActive: 'border-blue-300',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Projets',
    url: '/dashboard/projets',
    icon: FolderKanban,
    gradient: 'from-purple-500 to-fuchsia-600',
    bgHover: 'hover:bg-purple-50',
    textActive: 'text-purple-700',
    bgActive: 'bg-gradient-to-r from-purple-100 to-fuchsia-100',
    borderActive: 'border-purple-300',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Bilans',
    url: '/dashboard/bilans',
    icon: BarChart3,
    gradient: 'from-amber-500 to-orange-600',
    bgHover: 'hover:bg-amber-50',
    textActive: 'text-amber-700',
    bgActive: 'bg-gradient-to-r from-amber-100 to-orange-100',
    borderActive: 'border-amber-300',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Ressources',
    url: '/dashboard/ressources',
    icon: BookOpen,
    gradient: 'from-rose-500 to-pink-600',
    bgHover: 'hover:bg-rose-50',
    textActive: 'text-rose-700',
    bgActive: 'bg-gradient-to-r from-rose-100 to-pink-100',
    borderActive: 'border-rose-300',
    iconBg: 'bg-rose-100 text-rose-600',
  },
];

const adminItems = [
  {
    title: 'Administration',
    url: '/dashboard/admin',
    icon: Shield,
    gradient: 'from-slate-600 to-slate-800',
    bgHover: 'hover:bg-slate-100',
    textActive: 'text-slate-800',
    bgActive: 'bg-gradient-to-r from-slate-200 to-gray-200',
    borderActive: 'border-slate-400',
    iconBg: 'bg-slate-200 text-slate-700',
  },
];

const artisteItem = {
  title: 'Mon Compte',
  url: '/dashboard/mon-compte',
  icon: User,
  gradient: 'from-cyan-500 to-blue-600',
  bgHover: 'hover:bg-cyan-50',
  textActive: 'text-cyan-700',
  bgActive: 'bg-gradient-to-r from-cyan-100 to-blue-100',
  borderActive: 'border-cyan-300',
  iconBg: 'bg-cyan-100 text-cyan-600',
};

export function AppSidebar({ userRole, artisteNom }: AppSidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === 'admin';

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return pathname === url;
    }
    return pathname === url || pathname.startsWith(url + '/');
  };

  return (
    <Sidebar className="border-r-0">
      {/* Header avec logo moderne */}
      <SidebarHeader className="p-4 pb-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm font-bold text-lg">
            O
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">O.V.N.I</span>
            <span className="text-xs text-white/70 font-medium">Comptabilité ASBL</span>
          </div>
          <Sparkles className="h-4 w-4 ml-auto text-white/60" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 sidebar-no-scrollbar">
        {/* Navigation principale */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="p-0 h-auto"
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border border-transparent sidebar-item-transition',
                          active
                            ? `${item.bgActive} ${item.borderActive} ${item.textActive} shadow-sm`
                            : `${item.bgHover} hover:border-gray-200 hover:shadow-sm`
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                            active
                              ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                              : item.iconBg
                          )}
                        >
                          <item.icon className="h-4.5 w-4.5" />
                        </div>
                        <span className={cn(
                          'font-medium text-sm',
                          active ? item.textActive : 'text-gray-700'
                        )}>
                          {item.title}
                        </span>
                        {active && (
                          <div className={cn(
                            'ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r',
                            item.gradient
                          )} />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Espace Artiste */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Espace Artiste
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(artisteItem.url)}
                  className="p-0 h-auto"
                >
                  <Link
                    href={artisteItem.url}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border border-transparent sidebar-item-transition',
                      isActive(artisteItem.url)
                        ? `${artisteItem.bgActive} ${artisteItem.borderActive} ${artisteItem.textActive} shadow-sm`
                        : `${artisteItem.bgHover} hover:border-gray-200 hover:shadow-sm`
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                        isActive(artisteItem.url)
                          ? `bg-gradient-to-br ${artisteItem.gradient} text-white shadow-md`
                          : artisteItem.iconBg
                      )}
                    >
                      <artisteItem.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        'font-medium text-sm',
                        isActive(artisteItem.url) ? artisteItem.textActive : 'text-gray-700'
                      )}>
                        {artisteItem.title}
                      </span>
                      {artisteNom && (
                        <span className="text-xs text-gray-500">{artisteNom}</span>
                      )}
                    </div>
                    {isActive(artisteItem.url) && (
                      <div className={cn(
                        'ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r',
                        artisteItem.gradient
                      )} />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Administration */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {adminItems.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="p-0 h-auto"
                      >
                        <Link
                          href={item.url}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border border-transparent sidebar-item-transition',
                            active
                              ? `${item.bgActive} ${item.borderActive} ${item.textActive} shadow-sm`
                              : `${item.bgHover} hover:border-gray-200 hover:shadow-sm`
                          )}
                        >
                          <div
                            className={cn(
                              'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200',
                              active
                                ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                                : item.iconBg
                            )}
                          >
                            <item.icon className="h-4.5 w-4.5" />
                          </div>
                          <span className={cn(
                            'font-medium text-sm',
                            active ? item.textActive : 'text-gray-700'
                          )}>
                            {item.title}
                          </span>
                          {active && (
                            <div className={cn(
                              'ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r',
                              item.gradient
                            )} />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
