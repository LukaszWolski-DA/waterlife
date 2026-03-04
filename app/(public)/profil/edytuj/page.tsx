'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User, Building2, Phone, Mail, AlertCircle, Trash2 } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { profile, isLoading, error, updateProfile } = useUserProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company: '',
    nip: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect jeśli nie zalogowany
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Wypełnij formularz danymi z profilu
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        company: profile.company || '',
        nip: profile.nip || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(formData);
      
      toast({
        title: 'Profil zaktualizowany',
        description: 'Twoje dane zostały pomyślnie zapisane',
      });

      // Opcjonalnie: przekieruj do profilu lub zamówień
      // router.push('/profil/zamowienia');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się zaktualizować profilu',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/profile', { method: 'DELETE' });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Konto usunięte',
          description: 'Twoje konto i dane osobowe zostały usunięte.',
        });
        router.push('/');
      } else {
        throw new Error(data.error || 'Nie udało się usunąć konta');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się usunąć konta',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  // Loading state - sprawdzanie autentykacji
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    );
  }

  // Nie zalogowany
  if (!isAuthenticated) {
    return null; // Redirect się już wykonał
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/profil/zamowienia')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Wróć do zamówień
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="h-8 w-8" />
          Edytuj profil
        </h1>
        <p className="text-muted-foreground mt-2">
          Zaktualizuj swoje dane osobowe i firmowe
        </p>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Formularz */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dane osobowe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dane osobowe
            </CardTitle>
            <CardDescription>
              Podstawowe informacje o Tobie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">
                  Imię <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="Jan"
                />
              </div>
              <div>
                <Label htmlFor="last_name">
                  Nazwisko <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Kowalski"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Telefon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-9"
                  placeholder="+48 123 456 789"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-muted-foreground text-xs">(nie można zmienić)</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-9 bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email jest przypisany do Twojego konta i nie może być zmieniony przez formularz
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Dane firmowe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dane firmowe
            </CardTitle>
            <CardDescription>
              Opcjonalnie - dla klientów biznesowych
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Nazwa firmy</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Moja Firma Sp. z o.o."
              />
            </div>

            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input
                id="nip"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                placeholder="1234567890"
                maxLength={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Przyciski */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            className="flex-1 md:flex-initial"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push('/profil/zamowienia')}
            disabled={isSaving}
          >
            Anuluj
          </Button>
        </div>
      </form>

      {/* Strefa niebezpieczna */}
      <Card className="border-destructive/40 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Strefa niebezpieczna
          </CardTitle>
          <CardDescription>
            Trwałe usunięcie konta i wszystkich powiązanych danych osobowych
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Usunięcie konta jest <strong>nieodwracalne</strong>. Twoje dane osobowe zostaną usunięte zgodnie z RODO (prawo do bycia zapomnianym).
            Historia zapytań ofertowych zostanie zachowana w formie anonimowej na potrzeby księgowości.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Usuwanie...' : 'Usuń konto'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Czy na pewno chcesz usunąć konto?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ta operacja jest <strong>nieodwracalna</strong>. Twoje dane osobowe (imię, nazwisko, telefon, dane firmowe) zostaną trwale usunięte.
                  Nie będziesz mógł się zalogować na to konto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Anuluj</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Usuń konto na zawsze
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
