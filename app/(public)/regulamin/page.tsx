import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulamin | Waterlife',
  description: 'Regulamin serwisu Waterlife s.c.',
};

export default function Regulamin() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Regulamin serwisu</h1>
      <p className="text-muted-foreground mb-8">Ostatnia aktualizacja: [DO UZUPEŁNIENIA]</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3">§1. Postanowienia ogólne</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Niniejszy regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem <strong>waterlife.net.pl</strong> (dalej: &quot;Serwis&quot;).
            </li>
            <li>
              Właścicielem i operatorem Serwisu jest <strong>Waterlife s.c.</strong> z siedzibą pod adresem: <strong>[DO UZUPEŁNIENIA]</strong>, NIP: <strong>[DO UZUPEŁNIENIA]</strong> (dalej: &quot;Sprzedawca&quot;).
            </li>
            <li>
              Serwis służy do prezentacji oferty produktowej oraz przyjmowania zapytań ofertowych. Nie stanowi sklepu internetowego w rozumieniu przepisów o prawach konsumenta — złożenie zapytania ofertowego nie jest równoznaczne z zawarciem umowy sprzedaży.
            </li>
            <li>
              Korzystanie z Serwisu jest równoznaczne z akceptacją niniejszego Regulaminu.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§2. Definicje</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Użytkownik</strong> — każda osoba fizyczna, prawna lub jednostka organizacyjna korzystająca z Serwisu</li>
            <li><strong>Konto</strong> — zbiór zasobów i uprawnień przypisanych Użytkownikowi po rejestracji</li>
            <li><strong>Zapytanie ofertowe</strong> — prośba o wycenę produktów złożona za pośrednictwem formularza koszyka</li>
            <li><strong>Produkt</strong> — towar prezentowany w katalogu Serwisu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§3. Rejestracja i konto użytkownika</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Rejestracja konta jest dobrowolna. Niezarejestrowani użytkownicy mogą przeglądać ofertę i składać zapytania ofertowe jako goście.</li>
            <li>Podczas rejestracji Użytkownik podaje adres e-mail oraz hasło. Podane dane muszą być prawdziwe.</li>
            <li>Użytkownik jest zobowiązany do zachowania poufności hasła i nieudostępniania go osobom trzecim.</li>
            <li>Sprzedawca zastrzega sobie prawo do zablokowania lub usunięcia konta Użytkownika naruszającego postanowienia Regulaminu.</li>
            <li>Użytkownik może w każdej chwili usunąć swoje konto — opcja dostępna w ustawieniach profilu.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§4. Składanie zapytań ofertowych</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Zapytanie ofertowe składa się poprzez dodanie produktów do koszyka i wypełnienie formularza z danymi kontaktowymi.</li>
            <li>Złożenie zapytania ofertowego nie jest wiążącą ofertą w rozumieniu Kodeksu cywilnego ani zamówieniem.</li>
            <li>Po otrzymaniu zapytania pracownicy Sprzedawcy skontaktują się z Użytkownikiem w celu ustalenia warunków ewentualnej sprzedaży.</li>
            <li>Ceny produktów widoczne w Serwisie mają charakter orientacyjny i mogą ulec zmianie przy składaniu ostatecznej oferty.</li>
            <li>Sprzedawca zastrzega sobie prawo do odmowy realizacji zamówienia bez podania przyczyny.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§5. Zasady korzystania z Serwisu</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z obowiązującym prawem, postanowieniami niniejszego Regulaminu oraz dobrymi obyczajami.</li>
            <li>Zabrania się podawania fałszywych danych osobowych lub danych osób trzecich bez ich zgody.</li>
            <li>Zabrania się działań mogących zakłócić prawidłowe funkcjonowanie Serwisu.</li>
            <li>Treści zamieszczane przez Użytkownika (np. w wiadomościach) nie mogą naruszać praw osób trzecich ani obowiązujących przepisów prawa.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§6. Ochrona danych osobowych</h2>
          <p>
            Zasady przetwarzania danych osobowych opisane są szczegółowo w{' '}
            <a href="/polityka-prywatnosci" className="text-primary underline">Polityce prywatności</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§7. Odpowiedzialność</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Sprzedawca dokłada wszelkich starań, aby informacje zawarte w Serwisie były aktualne i prawidłowe, jednak nie ponosi odpowiedzialności za błędy lub nieaktualność danych.</li>
            <li>Sprzedawca nie ponosi odpowiedzialności za przerwy w dostępie do Serwisu spowodowane czynnikami zewnętrznymi lub pracami technicznymi.</li>
            <li>Sprzedawca nie ponosi odpowiedzialności za szkody wynikłe z korzystania z Serwisu w sposób niezgodny z Regulaminem.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">§8. Postanowienia końcowe</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu cywilnego.</li>
            <li>Sprzedawca zastrzega sobie prawo do zmiany Regulaminu. O istotnych zmianach Użytkownicy posiadający konto zostaną poinformowani drogą e-mailową.</li>
            <li>Aktualna wersja Regulaminu jest zawsze dostępna pod adresem <strong>waterlife.net.pl/regulamin</strong>.</li>
            <li>Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane przez sąd właściwy dla siedziby Sprzedawcy, chyba że przepisy prawa stanowią inaczej.</li>
          </ol>
        </section>

      </div>
    </div>
  );
}
