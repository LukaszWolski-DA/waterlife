'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';

/**
 * Layout dla panelu administratora
 * Zawiera boczne menu nawigacyjne i obszar roboczy
 * Chroni wszystkie ścieżki /admin przed nieautoryzowanym dostępem
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if on login page
    if (pathname === '/admin/login') {
      return;
    }

    // Redirect to login if not authenticated
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Ładowanie...</div>
      </div>
    );
  }

  // Allow login page to render without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Redirect happening - show nothing
  if (!isAuthenticated) {
    return null;
  }

  // Original admin layout for authenticated users
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">WaterLife Admin</h1>
        <Navigation />
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
