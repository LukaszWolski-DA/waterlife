'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Tag,
  Home,
  Factory,
  LogOut
} from 'lucide-react';

/**
 * Menu nawigacyjne dla panelu administratora
 * Wyświetla linki do różnych sekcji panelu admina
 */
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/strona-glowna',
      label: 'Strona Główna',
      icon: Home,
    },
    {
      href: '/admin/produkty',
      label: 'Produkty',
      icon: Package,
    },
    {
      href: '/admin/kategorie',
      label: 'Kategorie',
      icon: Tag,
    },
    {
      href: '/admin/producenci',
      label: 'Producenci',
      icon: Factory,
    },
    {
      href: '/admin/zamowienia',
      label: 'Zamówienia',
      icon: ShoppingBag,
    },
    {
      href: '/admin/wiadomosci',
      label: 'Wiadomości',
      icon: MessageSquare,
    },
  ];

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Logout button */}
      <div className="pt-4 mt-4 border-t border-gray-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-white hover:bg-gray-700 hover:text-white px-4 py-3"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Wyloguj się</span>
        </Button>
      </div>
    </nav>
  );
}
