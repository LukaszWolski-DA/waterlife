'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

/**
 * Formularz kontaktowy
 * Pozwala na wysłanie wiadomości z opcjonalnym załącznikiem
 */
export default function ContactForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (file) {
        formData.append('attachment', file);
      }

      const response = await fetch('/api/kontakt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Wiadomość wysłana!',
          description: 'Odpowiemy tak szybko, jak to możliwe.',
        });
        e.currentTarget.reset();
        setFile(null);
      } else {
        throw new Error(data.error || 'Błąd podczas wysyłania wiadomości');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się wysłać wiadomości',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Sprawdzenie rozmiaru pliku (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'Plik za duży',
          description: 'Maksymalny rozmiar pliku to 5MB',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Imię i nazwisko *</Label>
        <Input
          id="name"
          name="name"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="subject">Temat</Label>
        <Input
          id="subject"
          name="subject"
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="message">Wiadomość *</Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="attachment">Załącznik (opcjonalnie)</Label>
        <Input
          id="attachment"
          name="attachment"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          disabled={loading}
        />
        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Wybrany plik: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Dozwolone formaty: JPG, PNG, PDF (max 5MB)
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Wysyłanie...' : 'Wyślij wiadomość'}
      </Button>
    </form>
  );
}
