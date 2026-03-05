import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności | Waterlife',
  description: 'Polityka prywatności i ochrony danych osobowych Waterlife s.c.',
};

export default function PolitykaPrywatnosci() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Polityka prywatności</h1>
      <p className="text-muted-foreground mb-8">Ostatnia aktualizacja: 5 marca 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3">1. Administrator danych osobowych</h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>Waterlife s.c.</strong>,
            z siedzibą pod adresem: <strong>ul. Pęgowska 1, 55-120 Oborniki Śląskie, woj. dolnośląskie</strong>,
            NIP: <strong>9151800128</strong>, REGON: <strong>365904380</strong>.
          </p>
          <p className="mt-2">
            Kontakt z administratorem: <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">biuro@waterlife.net.pl</a> lub tel. 535-430-854.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Jakie dane osobowe zbieramy</h2>
          <p>Zbieramy następujące dane osobowe:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Dane kontaktowe:</strong> imię, nazwisko, adres e-mail, numer telefonu</li>
            <li><strong>Dane firmowe (opcjonalnie):</strong> nazwa firmy, NIP</li>
            <li><strong>Dane logowania:</strong> adres e-mail oraz zaszyfrowane hasło (dotyczy użytkowników posiadających konto)</li>
            <li><strong>Dane zamówień:</strong> historia złożonych zapytań ofertowych wraz ze szczegółami produktów</li>
            <li><strong>Dane techniczne:</strong> adres IP, typ przeglądarki, pliki cookies niezbędne do działania serwisu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. W jakim celu przetwarzamy dane</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Realizacja zapytań ofertowych</strong> — dane podane w formularzu koszyka służą do przygotowania i przesłania oferty (podstawa prawna: art. 6 ust. 1 lit. b RODO — niezbędność do wykonania umowy/podjęcia działań na żądanie osoby przed zawarciem umowy)
            </li>
            <li>
              <strong>Obsługa formularza kontaktowego</strong> — odpowiedź na pytania i zgłoszenia (podstawa prawna: art. 6 ust. 1 lit. a RODO — zgoda)
            </li>
            <li>
              <strong>Prowadzenie konta użytkownika</strong> — zarządzanie kontem, historia zamówień (podstawa prawna: art. 6 ust. 1 lit. b RODO)
            </li>
            <li>
              <strong>Cele podatkowe i rachunkowe</strong> — jeśli dojdzie do zawarcia umowy (podstawa prawna: art. 6 ust. 1 lit. c RODO — obowiązek prawny)
            </li>
            <li>
              <strong>Marketing bezpośredni</strong> — wyłącznie za wyrażoną zgodą (podstawa prawna: art. 6 ust. 1 lit. a RODO)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Jak długo przechowujemy dane</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Zapytania ofertowe i zamówienia:</strong> przez okres wymagany przepisami prawa (5 lat od końca roku, w którym wystawiono dokument księgowy) lub do czasu wycofania zgody</li>
            <li><strong>Wiadomości z formularza kontaktowego:</strong> do 12 miesięcy od udzielenia odpowiedzi, chyba że dalsze przetwarzanie jest uzasadnione</li>
            <li><strong>Konto użytkownika:</strong> do momentu usunięcia konta lub żądania usunięcia danych</li>
            <li><strong>Pliki cookies sesyjne:</strong> do zakończenia sesji przeglądarki</li>
            <li><strong>Pliki cookies funkcjonalne:</strong> do 12 miesięcy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Komu przekazujemy dane</h2>
          <p>Twoje dane mogą być przekazywane:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Supabase Inc.</strong> — dostawca infrastruktury bazy danych i uwierzytelniania (serwery w UE)</li>
            <li><strong>Resend Inc.</strong> — dostawca usług wysyłki poczty elektronicznej</li>
            <li><strong>Vercel Inc.</strong> — hosting aplikacji</li>
            <li>Organom publicznym i instytucjom, jeśli wymagają tego przepisy prawa</li>
          </ul>
          <p className="mt-2">
            Wymienieni podprzetwarzający działają na podstawie umów powierzenia przetwarzania danych i zapewniają odpowiedni poziom ochrony.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Twoje prawa</h2>
          <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Prawo dostępu</strong> — możesz zażądać informacji o przetwarzanych danych</li>
            <li><strong>Prawo do sprostowania</strong> — możesz poprawić niekompletne lub nieprawidłowe dane</li>
            <li><strong>Prawo do usunięcia</strong> — możesz zażądać usunięcia danych (tzw. &quot;prawo do bycia zapomnianym&quot;); dla użytkowników z kontem — opcja dostępna w ustawieniach profilu</li>
            <li><strong>Prawo do ograniczenia przetwarzania</strong> — możesz zażądać wstrzymania przetwarzania w określonych przypadkach</li>
            <li><strong>Prawo do przenoszenia danych</strong> — możesz otrzymać swoje dane w ustrukturyzowanym formacie</li>
            <li><strong>Prawo do sprzeciwu</strong> — możesz sprzeciwić się przetwarzaniu danych w celach marketingowych</li>
            <li><strong>Prawo do cofnięcia zgody</strong> — w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania przed cofnięciem</li>
          </ul>
          <p className="mt-3">
            Aby skorzystać z tych praw, skontaktuj się z nami pod adresem: <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">biuro@waterlife.net.pl</a>.
            Masz również prawo złożyć skargę do organu nadzorczego — <strong>Prezesa Urzędu Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warszawa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Pliki cookies</h2>
          <p>
            Nasza strona używa plików cookies. Cookies to małe pliki tekstowe zapisywane na Twoim urządzeniu przez przeglądarkę.
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Niezbędne cookies</strong> — wymagane do działania strony (sesja, koszyk); nie wymagają zgody</li>
            <li><strong>Funkcjonalne cookies</strong> — zapamiętują Twoje preferencje (np. zgoda na cookies); wymagają zgody</li>
            <li><strong>Analityczne cookies</strong> — [DO UZUPEŁNIENIA — czy używacie Google Analytics lub innego narzędzia?]</li>
          </ul>
          <p className="mt-2">
            Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki lub za pomocą banera cookies wyświetlanego przy pierwszej wizycie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Zmiany polityki prywatności</h2>
          <p>
            Zastrzegamy sobie prawo do zmiany niniejszej polityki prywatności. Wszelkie zmiany będą publikowane na tej stronie z aktualizacją daty w nagłówku.
            W przypadku istotnych zmian poinformujemy Cię drogą e-mailową (jeśli posiadasz konto).
          </p>
        </section>

      </div>
    </div>
  );
}
