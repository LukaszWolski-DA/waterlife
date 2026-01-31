import { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

/**
 * Layout dla stron publicznych (widok klienta)
 * Zawiera oryginalny header z nawigacją, searchem, koszykiem i stopkę
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
