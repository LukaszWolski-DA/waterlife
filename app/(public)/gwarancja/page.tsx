import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gwarancja | Waterlife',
  description: 'Informacje o gwarancji produktów oferowanych przez Waterlife.',
};

export default function Gwarancja() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Gwarancja</h1>
      <p className="text-muted-foreground mb-8">Wszystkie nasze produkty są nowe i objęte gwarancją producenta.</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3">Produkty nowe i nieużywane</h2>
          <p>
            Każdy produkt zakupiony w Waterlife jest <strong>fabrycznie nowy i nieużywany</strong>.
            Sprzedajemy wyłącznie towary bezpośrednio od sprawdzonych producentów i dystrybutorów.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Podstawa gwarancji</h2>
          <p>
            Okres i warunki gwarancji określa producent danego produktu. Jeżeli producent nie
            wystawia kart gwarancyjnych, <strong>podstawą gwarancji jest dowód zakupu</strong> —
            paragon fiskalny lub faktura VAT. Prosimy o zachowanie dokumentu zakupu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Jak zgłosić reklamację gwarancyjną?</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Skontaktuj się z nami: <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">biuro@waterlife.net.pl</a> lub tel. 535-430-854.</li>
            <li>Przygotuj dowód zakupu (paragon lub fakturę VAT) oraz opis usterki.</li>
            <li>Po weryfikacji zgłoszenia poinformujemy Cię o dalszych krokach.</li>
            <li>Reklamacje rozpatrujemy w terminie do <strong>14 dni roboczych</strong>.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Kontakt z obsługą klienta</h2>
          <p>
            Jesteśmy dostępni od poniedziałku do piątku w godzinach <strong>9:00–15:00</strong>:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>E-mail: <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">biuro@waterlife.net.pl</a></li>
            <li>Telefon: 535-430-854</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
