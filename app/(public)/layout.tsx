import { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import CookieConsent from '@/components/CookieConsent';
import { getHomepageContentServer } from '@/lib/homepage-server';

/**
 * Layout dla stron publicznych (widok klienta)
 * Zawiera oryginalny header z nawigacją, searchem, koszykiem i stopkę
 */
export default async function PublicLayout({ children }: { children: ReactNode }) {
  const content = await getHomepageContentServer();
  const { phone, phoneLink, email, emailLink } = content.contact;

  return (
    <div className="min-h-screen flex flex-col">
      <Header phone={phone} phoneLink={phoneLink} email={email} emailLink={emailLink} />
      <main className="flex-1">
        {children}
      </main>
      <Footer phone={phone} phoneLink={phoneLink} email={email} emailLink={emailLink} />
      <Toaster />
      <CookieConsent />
    </div>
  );
}
