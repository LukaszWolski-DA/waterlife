import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

/**
 * Strona z wiadomościami z formularza kontaktowego
 * Wyświetla listę wszystkich wiadomości od klientów
 */
export default function AdminMessagesPage() {
  // TODO: Pobrać wiadomości z API/Supabase
  const messages: any[] = [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Wiadomości kontaktowe</h1>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nadawca</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Temat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Załącznik</TableHead>
              <TableHead>Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Brak wiadomości
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.date}</TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      {message.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {message.attachment ? (
                      <a
                        href={message.attachment}
                        className="text-blue-600 hover:underline"
                      >
                        Pobierz
                      </a>
                    ) : (
                      'Brak'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Podgląd
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
