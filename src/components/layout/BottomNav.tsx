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
  User,
  MoreHorizontal,
  Shield,
  Settings,
  X,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { currentUser } from '@/data/mock';

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    title: 'Transactions',
    url: '/dashboard/transactions',
    icon: Receipt,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Artistes',
    url: '/dashboard/artistes',
    icon: Users,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Projets',
    url: '/dashboard/projets',
    icon: FolderKanban,
    gradient: 'from-purple-500 to-fuchsia-500',
  },
  {
    title: 'Plus',
    url: '#more',
    icon: MoreHorizontal,
    gradient: 'from-gray-500 to-slate-500',
  },
];

const moreNavItems = [
  {
    title: 'Transferts',
    url: '/dashboard/transferts',
    icon: ArrowLeftRight,
    gradient: 'from-fuchsia-500 to-purple-500',
  },
  {
    title: 'Bilans',
    url: '/dashboard/bilans',
    icon: BarChart3,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Ressources',
    url: '/dashboard/ressources',
    icon: BookOpen,
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    title: 'Mon Compte',
    url: '/dashboard/mon-compte',
    icon: User,
    gradient: 'from-cyan-500 to-blue-500',
  },
];

const adminNavItems = [
  {
    title: 'Administration',
    url: '/dashboard/admin',
    icon: Shield,
    gradient: 'from-slate-600 to-slate-800',
  },
  {
    title: 'Paramètres',
    url: '/dashboard/admin/settings',
    icon: Settings,
    gradient: 'from-slate-500 to-slate-700',
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const isAdmin = currentUser.role === 'admin';

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return pathname === url;
    }
    return pathname === url || pathname.startsWith(url + '/');
  };

  const isMoreActive = [...moreNavItems, ...adminNavItems].some(item => isActive(item.url));

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More menu panel */}
      <div
        className={cn(
          'fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 md:hidden',
          'transition-all duration-300 ease-out',
          showMore
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <div className="mx-4 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
            <span className="font-semibold text-gray-700">Plus d'options</span>
            <button
              onClick={() => setShowMore(false)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Menu items */}
          <div className="p-2">
            {moreNavItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setShowMore(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                  isActive(item.url)
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                    : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="h-px bg-gray-100 my-2" />
                <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Administration
                </p>
                {adminNavItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                      isActive(item.url)
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-md`
                        : 'hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden transform-gpu will-change-transform">
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div
            className="flex items-center justify-around px-2"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {mainNavItems.map((item) => {
              const active = item.url === '#more' ? (showMore || isMoreActive) : isActive(item.url);
              const Icon = item.icon;

              if (item.url === '#more') {
                return (
                  <button
                    key={item.title}
                    onClick={() => setShowMore(!showMore)}
                    className={cn(
                      'flex flex-col items-center justify-center py-2 px-3 min-w-[64px] transition-all duration-200',
                      'relative group'
                    )}
                  >
                    <div
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300',
                        active
                          ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-110`
                          : 'group-hover:bg-gray-100'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors',
                          active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        'text-[10px] mt-1 font-medium transition-colors',
                        active ? 'text-gray-900' : 'text-gray-500'
                      )}
                    >
                      {item.title}
                    </span>
                    {isMoreActive && !showMore && (
                      <div className="absolute top-1.5 right-3 w-2 h-2 bg-violet-500 rounded-full" />
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 min-w-[64px] transition-all duration-200',
                    'relative group'
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300',
                      active
                        ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-110`
                        : 'group-hover:bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] mt-1 font-medium transition-colors',
                      active ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
