'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie.split(';').some(c => c.trim().startsWith('cookie-consent='));
    if (!hasConsent) {
      setVisible(true);
    }
  }, []);

  const setCookieConsent = (value: 'accepted' | 'minimal') => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `cookie-consent=${value}; max-age=31536000; path=/; SameSite=Lax${secure}`;
    setVisible(false);
  };

  const handleAccept = () => setCookieConsent('accepted');
  const handleMinimal = () => setCookieConsent('minimal');

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-background border border-border rounded-xl shadow-lg p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Cookie className="h-6 w-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-muted-foreground flex-1">
            Używamy plików cookies, aby zapewnić prawidłowe działanie strony. Więcej informacji znajdziesz w naszej{' '}
            <Link href="/polityka-prywatnosci" className="text-primary underline hover:no-underline">
              polityce prywatności
            </Link>.
          </p>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMinimal}
              className="flex-1 sm:flex-initial"
            >
              Tylko niezbędne
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 sm:flex-initial"
            >
              Akceptuj wszystkie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
