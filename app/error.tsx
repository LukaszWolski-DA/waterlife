'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Droplets } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-slate-700">
            <Droplets className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight">Waterlife</span>
          </div>
        </div>

        <p className="text-7xl font-black text-slate-200 mb-2">500</p>
        <h1 className="text-2xl font-bold text-slate-800 mb-3">Coś poszło nie tak</h1>
        <p className="text-slate-500 mb-8">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę główną.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
}
