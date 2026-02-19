'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, MailOpen, Reply, Archive, Eye, RefreshCw, MessageSquare } from 'lucide-react';
import type { ContactMessage, MessageStatus } from '@/types/contact';

/**
 * Admin page - Lista wiadomości kontaktowych
 * Pozwala na przeglądanie, filtrowanie i zarządzanie wiadomościami
 */
export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [total, setTotal] = useState(0);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all'
        ? '/api/admin/messages'
        : `/api/admin/messages?status=${statusFilter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
        setTotal(data.total);
      } else {
        console.error('Error loading messages:', data.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const getStatusBadge = (status: MessageStatus) => {
    const variants: Record<MessageStatus, { variant: any; icon: any; label: string }> = {
      new: { variant: 'default', icon: Mail, label: 'Nowa' },
      read: { variant: 'secondary', icon: MailOpen, label: 'Przeczytana' },
      replied: { variant: 'outline', icon: Reply, label: 'Odpowiedziana' },
      archived: { variant: 'outline', icon: Archive, label: 'Zarchiwizowana' },
    };

    const { variant, icon: Icon, label } = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getUnreadCount = () => {
    return messages.filter(m => m.status === 'new').length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wiadomości Kontaktowe</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj wiadomościami ze strony kontaktowej
          </p>
        </div>
        <Button onClick={loadMessages} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Odśwież
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wszystkie</p>
                <p className="text-2xl font-bold">{total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nowe</p>
                <p className="text-2xl font-bold">{getUnreadCount()}</p>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Przeczytane</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'read').length}
                </p>
              </div>
              <MailOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Odpowiedziane</p>
                <p className="text-2xl font-bold">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
              <Reply className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filtruj według statusu:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="new">Nowe</SelectItem>
                <SelectItem value="read">Przeczytane</SelectItem>
                <SelectItem value="replied">Odpowiedziane</SelectItem>
                <SelectItem value="archived">Zarchiwizowane</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Wyświetlono {messages.length} z {total} wiadomości
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Messages table */}
      <Card>
        <CardContent className="pt-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Brak wiadomości</p>
              <p className="text-sm text-muted-foreground mt-1">
                {statusFilter === 'all'
                  ? 'Nie otrzymano jeszcze żadnych wiadomości'
                  : `Brak wiadomości ze statusem "${statusFilter}"`}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Od</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Temat</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{getStatusBadge(message.status)}</TableCell>
                      <TableCell className="font-medium">
                        {message.customer_info.name}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${message.customer_info.email}`}
                          className="text-primary hover:underline"
                        >
                          {message.customer_info.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {message.subject || <span className="text-muted-foreground italic">Brak tematu</span>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(message.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/wiadomosci/${message.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
