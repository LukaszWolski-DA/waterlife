import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zwroty i reklamacje | Waterlife',
  description: 'Informacje o zwrotach, odstąpieniu od umowy i reklamacjach w Waterlife.',
};

export default function Zwroty() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Zwroty i reklamacje</h1>
      <p className="text-muted-foreground mb-8">Twoje prawa jako konsumenta i jak z nich skorzystać.</p>

      <div className="prose prose-gray max-w-none space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-3">Prawo do odstąpienia od umowy (14 dni)</h2>
          <p>
            Zgodnie z art. 27 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, masz prawo
            odstąpić od umowy zawartej na odległość w terminie <strong>14 dni</strong> bez
            podawania przyczyny.
          </p>
          <p className="mt-2">
            Termin liczy się od dnia dostarczenia towaru. Wystarczy poinformować nas o swojej
            decyzji przed jego upływem — e-mailem lub telefonicznie.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Warunki zwrotu</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Towar musi być <strong>nieużywany</strong> i <strong>fabrycznie zapakowany</strong> — w stanie takim, w jakim został do Ciebie dostarczony.</li>
            <li>Koszty odesłania towaru ponosi <strong>Kupujący</strong>.</li>
            <li>Jeżeli po sprawdzeniu przesyłki stwierdzimy, że towar był używany lub otwierany, zastrzegamy sobie prawo do nieprzyjęcia zwrotu i odesłania go na Twój koszt.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Jak złożyć zwrot?</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Skontaktuj się z nami: <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">biuro@waterlife.net.pl</a> lub tel. 535-430-854.</li>
            <li>Poinformuj nas o chęci zwrotu i podaj numer zamówienia.</li>
            <li>Odeślij towar na adres wskazany przez obsługę klienta.</li>
            <li>Po otrzymaniu i sprawdzeniu paczki zwrócimy należność w ciągu 14 dni roboczych.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Reklamacje</h2>
          <p>
            Reklamacje rozpatrujemy przeważnie w terminie do <strong>14 dni roboczych</strong> od
            ich otrzymania. W przypadku reklamacji prosimy o kontakt pod adresem{' '}
            <a href="mailto:biuro@waterlife.net.pl" className="text-primary underline">
              biuro@waterlife.net.pl
            </a>{' '}
            lub telefonicznie: 535-430-854 (pon.–pt. 9:00–15:00).
          </p>
          <p className="mt-2">
            Więcej informacji o gwarancji znajdziesz na stronie{' '}
            <a href="/gwarancja" className="text-primary underline">Gwarancja</a>.
          </p>
        </section>

      </div>
    </div>
  );
}
