'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Mail, Phone, Calendar, Save, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ContactMessage, MessageStatus } from '@/types/contact';

/**
 * Admin page - Szczegóły wiadomości kontaktowej
 * Pozwala na odczyt, zmianę statusu i dodanie notatek
 */
interface MessageDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<MessageStatus>('new');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadMessage();
  }, [id]);

  const loadMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/messages/${id}`);
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStatus(data.message.status);
        setAdminNotes(data.message.admin_notes || '');
        
        // Auto-mark as read if it's new
        if (data.message.status === 'new') {
          await updateMessageStatus('read');
        }
      } else {
        toast({
          title: 'Błąd',
          description: data.error || 'Nie udało się załadować wiadomości',
          variant: 'destructive',
        });
        router.push('/admin/wiadomosci');
      }
    } catch (error) {
      console.error('Error loading message:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się załadować wiadomości',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (newStatus: MessageStatus) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setStatus(data.message.status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        toast({
          title: 'Zapisano',
          description: 'Zmiany zostały zapisane pomyślnie',
        });
      } else {
        throw new Error(data.error || 'Nie udało się zapisać zmian');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: error instanceof Error ? error.message : 'Nie udało się zapisać zmian',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadgeVariant = (status: MessageStatus): any => {
    const variants: Record<MessageStatus, any> = {
      new: 'default',
      read: 'secondary',
      replied: 'outline',
      archived: 'outline',
    };
    return variants[status];
  };

  const getStatusLabel = (status: MessageStatus): string => {
    const labels: Record<MessageStatus, string> = {
      new: 'Nowa',
      read: 'Przeczytana',
      replied: 'Odpowiedziana',
      archived: 'Zarchiwizowana',
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/wiadomosci">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-lg font-medium">Wiadomość nie znaleziona</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/wiadomosci">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Powrót
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Szczegóły Wiadomości</h1>
            <p className="text-muted-foreground mt-1">
              Odczytaj i zarządzaj wiadomością kontaktową
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`mailto:${message.customer_info.email}?subject=Re: ${message.subject || 'Kontakt ze strony WaterLife'}`}>
            <Button variant="outline">
              <Reply className="mr-2 h-4 w-4" />
              Odpowiedz
            </Button>
          </a>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Treść Wiadomości</CardTitle>
                <Badge variant={getStatusBadgeVariant(message.status)}>
                  {getStatusLabel(message.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {message.subject && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Temat</label>
                  <p className="text-lg font-semibold mt-1">{message.subject}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wiadomość</label>
                <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-foreground">
                  {message.message}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Wysłano: {formatDate(message.created_at)}
              </div>
            </CardContent>
          </Card>

          {/* Admin notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notatki Administratora</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Dodaj notatki dla innych administratorów..."
                rows={6}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Notatki są widoczne tylko dla administratorów
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer info */}
          <Card>
            <CardHeader>
              <CardTitle>Dane Nadawcy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Imię i nazwisko</label>
                <p className="font-medium mt-1">{message.customer_info.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <a
                  href={`mailto:${message.customer_info.email}`}
                  className="flex items-center gap-2 text-primary hover:underline mt-1"
                >
                  <Mail className="h-4 w-4" />
                  {message.customer_info.email}
                </a>
              </div>

              {message.customer_info.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                  <a
                    href={`tel:${message.customer_info.phone}`}
                    className="flex items-center gap-2 text-primary hover:underline mt-1"
                  >
                    <Phone className="h-4 w-4" />
                    {message.customer_info.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Wiadomości</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={(value) => setStatus(value as MessageStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nowa</SelectItem>
                  <SelectItem value="read">Przeczytana</SelectItem>
                  <SelectItem value="replied">Odpowiedziana</SelectItem>
                  <SelectItem value="archived">Zarchiwizowana</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Zmień status aby oznaczyć odpowiedź lub archiwizację
              </p>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID wiadomości:</span>
                <p className="font-mono text-xs mt-1 break-all">{message.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Utworzono:</span>
                <p className="mt-1">{formatDate(message.created_at)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ostatnia aktualizacja:</span>
                <p className="mt-1">{formatDate(message.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
