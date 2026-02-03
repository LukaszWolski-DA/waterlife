'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createClient();

      // Check if we have a token_hash in the URL (from email link)
      const token_hash = searchParams?.get('token_hash');
      const type = searchParams?.get('type');

      if (!token_hash || type !== 'signup') {
        setStatus('error');
        setMessage('Nieprawidłowy link potwierdzenia. Sprawdź swój email i spróbuj ponownie.');
        return;
      }

      // Verify the email
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup',
      });

      if (error) {
        setStatus('error');
        setMessage(error.message || 'Nie udało się potwierdzić emaila. Link może być wygasły.');
      } else {
        setStatus('success');
        setMessage('Email został potwierdzony! Możesz się teraz zalogować.');

        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-6 w-6 text-green-600" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            Potwierdzenie emaila
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Potwierdzamy Twój adres email...'}
            {status === 'success' && 'Email potwierdzony pomyślnie'}
            {status === 'error' && 'Wystąpił problem'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{message}</p>

          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm">Przekierowujemy Cię na stronę główną...</p>
              <Button asChild className="w-full">
                <Link href="/">Przejdź do strony głównej</Link>
              </Button>
            </div>
          )}

          {status === 'error' && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Wróć do strony głównej</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
